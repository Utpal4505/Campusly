import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import crypto from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Automatically generate and persist a unique ticket for an event registration.
   */
  async mintTicketForRegistration(registrationId: string) {
    const registration = await this.prisma.eventRegistration.findUnique({
      where: { id: registrationId },
      include: {
        event: {
          include: {
            creator: true,
            interests: { include: { interest: true } },
          },
        },
        user: true,
        ticket: true,
      },
    });

    if (!registration) {
      throw new NotFoundException('Registration record not found');
    }

    if (registration.ticket) {
      const fullTicket = await this.prisma.ticket.findUnique({
        where: { id: registration.ticket.id },
        include: {
          event: {
            include: {
              creator: true,
              interests: { include: { interest: true } },
            },
          },
          registration: true,
          user: true,
        },
      });
      return fullTicket || registration.ticket;
    }

    // Generate unique serial, e.g. CPLY-7F3K92
    let ticketNumber = '';
    let isUnique = false;
    while (!isUnique) {
      const hex = crypto.randomBytes(3).toString('hex').toUpperCase();
      ticketNumber = `CPLY-${hex}`;
      const exists = await this.prisma.ticket.findUnique({
        where: { ticketNumber },
      });
      if (!exists) {
        isUnique = true;
      }
    }

    // Generate scannable QR payload
    const qrData = JSON.stringify({
      ticketNumber,
      eventId: registration.eventId,
      eventTitle: registration.event.title,
      userId: registration.userId,
      studentName: registration.user.name,
      paymentStatus: registration.paymentStatus,
      amount: registration.amount,
      issuedAt: new Date().toISOString(),
    });

    return this.prisma.ticket.create({
      data: {
        ticketNumber,
        userId: registration.userId,
        eventId: registration.eventId,
        registrationId: registration.id,
        qrCode: Buffer.from(qrData).toString('base64'),
        status: 'CONFIRMED',
      },
      include: {
        event: {
          include: {
            creator: true,
            interests: { include: { interest: true } },
          },
        },
        registration: true,
        user: true,
      },
    });
  }

  /**
   * Find all tickets belonging to an authenticated user.
   * Auto-mints tickets for any existing event registrations that don't have a ticket yet.
   */
  async findAllForUser(userId: string) {
    // Auto-heal / auto-mint any registrations for this user that don't have a ticket yet
    const unmintedRegistrations = await this.prisma.eventRegistration.findMany({
      where: {
        userId,
        ticket: null,
      },
    });

    for (const reg of unmintedRegistrations) {
      try {
        await this.mintTicketForRegistration(reg.id);
      } catch (err) {
        console.error(`Failed to auto-mint ticket for registration ${reg.id}:`, err);
      }
    }

    const tickets = await this.prisma.ticket.findMany({
      where: { userId },
      include: {
        event: {
          include: {
            creator: true,
            interests: { include: { interest: true } },
          },
        },
        registration: true,
        user: true,
      },
      orderBy: {
        event: {
          date: 'desc',
        },
      },
    });

    return tickets.map((t) => this.formatTicket(t));
  }

  /**
   * Find a specific ticket for an authenticated user with owner-only access guard.
   */
  async findOneForUser(ticketIdOrNumber: string, userId: string) {
    let ticket = await this.prisma.ticket.findFirst({
      where: {
        OR: [{ id: ticketIdOrNumber }, { ticketNumber: ticketIdOrNumber }],
      },
      include: {
        event: {
          include: {
            creator: true,
            interests: { include: { interest: true } },
          },
        },
        registration: true,
        user: true,
      },
    });

    if (!ticket) {
      // Check if user has an eventRegistration for this event ID / slug
      const event = await this.prisma.event.findFirst({
        where: {
          OR: [
            { id: ticketIdOrNumber },
            { title: { equals: ticketIdOrNumber, mode: 'insensitive' } },
          ],
        },
      });
      if (event) {
        const reg = await this.prisma.eventRegistration.findUnique({
          where: {
            userId_eventId: {
              userId,
              eventId: event.id,
            },
          },
        });
        if (reg) {
          const minted = await this.mintTicketForRegistration(reg.id);
          return this.formatTicket(minted);
        }
      }
      throw new NotFoundException('Ticket not found');
    }

    if (ticket.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to view this ticket',
      );
    }

    return this.formatTicket(ticket);
  }

  /**
   * Verify and Check-in an attendee ticket at the event gate.
   * Handles raw ticket numbers (e.g. CPLY-7F3K92), ticket UUIDs, or raw base64/JSON QR payloads.
   */
  async checkinTicket(ticketNumberOrId: string, eventId?: string) {
    let cleanCode = (ticketNumberOrId || '').trim();

    // If payload is base64 encoded JSON (as generated in qrCode field), decode it
    if (cleanCode.length > 20 && !cleanCode.startsWith('CPLY-') && !cleanCode.startsWith('c')) {
      try {
        const decoded = Buffer.from(cleanCode, 'base64').toString('utf-8');
        const parsed = JSON.parse(decoded);
        if (parsed.ticketNumber) {
          cleanCode = parsed.ticketNumber;
        }
      } catch {
        // Also check if raw string is JSON
        try {
          const parsed = JSON.parse(cleanCode);
          if (parsed.ticketNumber) {
            cleanCode = parsed.ticketNumber;
          }
        } catch {
          // not JSON, keep cleanCode
        }
      }
    }

    const ticket = await this.prisma.ticket.findFirst({
      where: {
        OR: [
          { ticketNumber: { equals: cleanCode, mode: 'insensitive' } },
          { id: cleanCode },
        ],
      },
      include: {
        event: true,
        user: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket with code "${cleanCode}" could not be verified.`);
    }

    if (eventId && ticket.eventId !== eventId) {
      throw new BadRequestException(
        `This ticket is valid for "${ticket.event.title}", not this event!`,
      );
    }

    if (ticket.status === 'CHECKED_IN') {
      return {
        success: true,
        status: 'CHECKED_IN' as const,
        alreadyCheckedIn: true,
        ticketNumber: ticket.ticketNumber,
        attendeeName: ticket.user.name,
        attendeeEmail: ticket.user.email,
        eventTitle: ticket.event.title,
        eventId: ticket.eventId,
        checkedInAt: ticket.updatedAt.toISOString(),
        message: 'This ticket was already checked in earlier!',
      };
    }

    const updated = await this.prisma.ticket.update({
      where: { id: ticket.id },
      data: { status: 'CHECKED_IN' },
      include: {
        event: true,
        user: true,
      },
    });

    return {
      success: true,
      status: 'CHECKED_IN' as const,
      alreadyCheckedIn: false,
      ticketNumber: updated.ticketNumber,
      attendeeName: updated.user.name,
      attendeeEmail: updated.user.email,
      eventTitle: updated.event.title,
      eventId: updated.eventId,
      checkedInAt: updated.updatedAt.toISOString(),
      message: 'Gate pass verified successfully! Attendee checked in.',
    };
  }

  private formatTicket(ticket: any) {
    return {
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      userId: ticket.userId,
      eventId: ticket.eventId,
      registrationId: ticket.registrationId,
      qrCode: ticket.qrCode,
      status: ticket.status,
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
      event: {
        id: ticket.event.id,
        title: ticket.event.title,
        description: ticket.event.description,
        date: ticket.event.date.toISOString(),
        location: ticket.event.location,
        price: ticket.event.price,
        currency: ticket.event.currency,
        interests: ticket.event.interests.map((i: any) => i.interest.name),
        creatorName: ticket.event.creator?.name || 'Campus Event Organizer',
      },
      user: {
        id: ticket.user.id,
        name: ticket.user.name,
        email: ticket.user.email,
      },
      registration: {
        paymentStatus: ticket.registration.paymentStatus,
        paymentId: ticket.registration.paymentId,
        orderId: ticket.registration.orderId,
        amount: ticket.registration.amount,
      },
    };
  }
}
