import {
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
