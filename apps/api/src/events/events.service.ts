import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

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
   * Return details of a specific event by ID.
   */
  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
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

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return {
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
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
   * Register the authenticated user for an event.
   */
  async register(eventId: string, userId: string) {
    // Verify the event exists
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, title: true },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

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
      throw new ConflictException('You are already registered for this event');
    }

    // Create registration
    const registration = await this.prisma.eventRegistration.create({
      data: {
        userId,
        eventId,
      },
    });

    return {
      message: 'Successfully registered for event',
      eventId: event.id,
      eventTitle: event.title,
      registeredAt: registration.createdAt,
    };
  }
}
