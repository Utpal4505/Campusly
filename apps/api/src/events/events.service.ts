import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { TicketsService } from '../tickets/tickets.service.js';

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ticketsService: TicketsService,
  ) {}

  /**
   * Return all upcoming campus events with creators, tagged interests, and registration counts.
   */
  async findAll() {
    const events = await this.prisma.event.findMany({
      orderBy: {
        date: 'asc',
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        interests: {
          include: {
            interest: true,
          },
        },
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    });

    return events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      price: event.price ?? 0,
      currency: event.currency ?? 'INR',
      creator: {
        id: event.creator.id,
        name: event.creator.name,
      },
      interests: event.interests.map((ei) => ({
        id: ei.interest.id,
        name: ei.interest.name,
      })),
      registrationCount: event._count.registrations,
      createdAt: event.createdAt,
    }));
  }

  /**
   * Return details of a specific event by ID or slug.
   */
  async findOne(id: string) {
    const event = await this.findEventRecord(id);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return {
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      price: event.price ?? 0,
      currency: event.currency ?? 'INR',
      creator: {
        id: event.creator.id,
        name: event.creator.name,
        department: event.creator.department,
      },
      interests: event.interests.map((ei) => ({
        id: ei.interest.id,
        name: ei.interest.name,
      })),
      registrationCount: event._count.registrations,
      createdAt: event.createdAt,
    };
  }

  /**
   * Helper to find an event by exact ID, lowercased ID, or slugified title.
   */
  public async findEventRecord(idOrSlug: string) {
    const direct = await this.prisma.event.findUnique({
      where: { id: idOrSlug },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            department: true,
          },
        },
        interests: {
          include: {
            interest: true,
          },
        },
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    });

    if (direct) return direct;

    const allEvents = await this.prisma.event.findMany({
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            department: true,
          },
        },
        interests: {
          include: {
            interest: true,
          },
        },
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    });

    const target = idOrSlug.toLowerCase().trim();
    return (
      allEvents.find((e) => {
        if (e.id.toLowerCase() === target) return true;
        const slug = e.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
        return slug === target || slug.includes(target) || target.includes(slug);
      }) || null
    );
  }

  /**
   * Register the authenticated user for an event.
   */
  async register(idOrSlug: string, userId: string) {
    // Verify the event exists
    const event = await this.findEventRecord(idOrSlug);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const eventId = event.id;

    // Check for existing registration
    const existing = await this.prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    if (existing) {
      const ticket = await this.ticketsService.mintTicketForRegistration(existing.id);
      return {
        message: 'Already registered for event. Ticket confirmed!',
        eventId: event.id,
        eventTitle: event.title,
        registeredAt: existing.createdAt,
        ticket,
      };
    }

    // Create registration
    const registration = await this.prisma.eventRegistration.create({
      data: {
        userId,
        eventId,
        paymentStatus: 'FREE',
        amount: 0,
      },
    });

    const ticket = await this.ticketsService.mintTicketForRegistration(registration.id);

    return {
      message: 'Successfully registered for event. Ticket issued!',
      eventId: event.id,
      eventTitle: event.title,
      registeredAt: registration.createdAt,
      ticket,
    };
  }

  /**
   * Create a new campus event and link associated interests.
   */
  async create(
    data: {
      title: string;
      description?: string | null;
      date: Date | string;
      location?: string | null;
      price?: number;
      currency?: string;
      interestIds?: string[];
      interestNames?: string[];
    },
    creatorId: string,
  ) {
    const eventDate = new Date(data.date);
    const price = typeof data.price === 'number' ? data.price : 0;
    const currency = data.currency || 'INR';

    const event = await this.prisma.event.create({
      data: {
        title: data.title,
        description: data.description || null,
        date: isNaN(eventDate.getTime()) ? new Date() : eventDate,
        location: data.location || 'LPU Campus',
        price,
        currency,
        creatorId,
      },
    });

    let interestIdsToLink: string[] = [];
    if (data.interestIds && data.interestIds.length > 0) {
      interestIdsToLink = data.interestIds;
    } else if (data.interestNames && data.interestNames.length > 0) {
      const found = await this.prisma.interest.findMany({
        where: {
          name: { in: data.interestNames, mode: 'insensitive' },
        },
      });
      interestIdsToLink = found.map((i) => i.id);
    }

    if (interestIdsToLink.length > 0) {
      await this.prisma.eventInterest.createMany({
        data: interestIdsToLink.map((interestId) => ({
          eventId: event.id,
          interestId,
        })),
        skipDuplicates: true,
      });
    }

    return this.findOne(event.id);
  }
}
