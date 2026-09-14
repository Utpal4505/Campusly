import { Injectable } from '@nestjs/common';
import type { FeedResponse } from '@repo/schemas';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class FeedService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a deterministic discovery feed combining upcoming events and campus clubs.
   * If a userId is provided and the user has selected interests, items with overlapping
   * interests are prioritized with human-readable matched interest tags.
   */
  async getFeed(
    userId?: string,
    queryInterestIds?: string[],
    queryInterestNames?: string[],
  ): Promise<FeedResponse> {
    const userInterestIds = new Set<string>();

    if (userId) {
      const userInterests = await this.prisma.userInterest.findMany({
        where: { userId },
        select: { interestId: true },
      });
      for (const ui of userInterests) {
        userInterestIds.add(ui.interestId);
      }
    }

    if (queryInterestIds && queryInterestIds.length > 0) {
      for (const id of queryInterestIds) {
        userInterestIds.add(id);
      }
    }

    if (queryInterestNames && queryInterestNames.length > 0) {
      const matched = await this.prisma.interest.findMany({
        where: { name: { in: queryInterestNames } },
        select: { id: true },
      });
      for (const m of matched) {
        userInterestIds.add(m.id);
      }
    }

    // Fetch upcoming events
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

    // Fetch active clubs
    const clubs = await this.prisma.club.findMany({
      orderBy: {
        name: 'asc',
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
            members: true,
          },
        },
      },
    });

    // Map events into feed items
    const eventEntries = events.map((event) => {
      const mappedInterests = event.interests.map((ei) => ({
        id: ei.interest.id,
        name: ei.interest.name,
      }));
      const matchedInterests =
        userInterestIds.size > 0
          ? mappedInterests
              .filter((i) => userInterestIds.has(i.id))
              .map((i) => i.name)
          : [];

      return {
        item: {
          type: 'event' as const,
          id: event.id,
          title: event.title,
          description: event.description,
          matchedInterests,
          interests: mappedInterests,
          metadata: {
            date: event.date.toISOString(),
            location: event.location,
            coverImage: event.coverImage,
            registrationCount: event._count.registrations,
            creatorName: event.creator.name,
          },
        },
        score: matchedInterests.length * 10,
        createdAt: event.createdAt,
      };
    });

    // Map clubs into feed items
    const clubEntries = clubs.map((club) => {
      const mappedInterests = club.interests.map((ci) => ({
        id: ci.interest.id,
        name: ci.interest.name,
      }));
      const matchedInterests =
        userInterestIds.size > 0
          ? mappedInterests
              .filter((i) => userInterestIds.has(i.id))
              .map((i) => i.name)
          : [];

      return {
        item: {
          type: 'club' as const,
          id: club.id,
          title: club.name,
          description: club.description,
          matchedInterests,
          interests: mappedInterests,
          metadata: {
            logo: club.logo,
            coverImage: club.coverImage,
            memberCount: club._count.members,
            creatorName: club.creator.name,
          },
        },
        score: matchedInterests.length * 10,
        createdAt: club.createdAt,
      };
    });

    // Combine and rank deterministically
    const allEntries = [...eventEntries, ...clubEntries];

    allEntries.sort((a, b) => {
      // Primary sort: highest matching score first
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // Secondary sort: chronological creation date
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    const items = allEntries.map((e) => e.item);
    const hasPersonalizedResults =
      userInterestIds.size > 0 &&
      items.some((i) => i.matchedInterests.length > 0);

    return {
      items,
      total: items.length,
      hasPersonalizedResults,
    };
  }
}
