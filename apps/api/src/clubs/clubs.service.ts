import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ClubsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Return all campus clubs with creators, tagged interests, and member counts.
   */
  async findAll() {
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

    return clubs.map((club) => ({
      id: club.id,
      name: club.name,
      description: club.description,
      creator: {
        id: club.creator.id,
        name: club.creator.name,
      },
      interests: club.interests.map((ci) => ({
        id: ci.interest.id,
        name: ci.interest.name,
      })),
      memberCount: club._count.members,
      createdAt: club.createdAt,
    }));
  }

  /**
   * Return full details of a specific club by ID or slug.
   */
  async findOne(id: string) {
    const club = await this.findClubRecord(id);

    if (!club) {
      throw new NotFoundException('Club not found');
    }

    return {
      id: club.id,
      name: club.name,
      description: club.description,
      creator: {
        id: club.creator.id,
        name: club.creator.name,
      },
      interests: club.interests.map((ci) => ({
        id: ci.interest.id,
        name: ci.interest.name,
      })),
      memberCount: club._count.members,
      createdAt: club.createdAt,
    };
  }

  /**
   * Helper to find a club record by exact ID, lowercase ID, or slugified name.
   */
  private async findClubRecord(idOrSlug: string) {
    const direct = await this.prisma.club.findUnique({
      where: { id: idOrSlug },
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

    if (direct) return direct;

    const allClubs = await this.prisma.club.findMany({
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

    const target = idOrSlug.toLowerCase().trim();
    return (
      allClubs.find((c) => {
        if (c.id.toLowerCase() === target) return true;
        const slug = c.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
        return slug === target || slug.includes(target) || target.includes(slug);
      }) || null
    );
  }

  /**
   * Join a club as a member.
   */
  async join(idOrSlug: string, userId: string) {
    // Verify the club exists
    const club = await this.findClubRecord(idOrSlug);

    if (!club) {
      throw new NotFoundException('Club not found');
    }

    const clubId = club.id;

    // Check for existing membership
    const existing = await this.prisma.clubMember.findUnique({
      where: {
        userId_clubId: {
          userId,
          clubId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('You are already a member of this club');
    }

    // Create membership record
    const membership = await this.prisma.clubMember.create({
      data: {
        userId,
        clubId,
        role: 'member',
      },
    });

    return {
      message: 'Successfully joined club',
      clubId: club.id,
      clubName: club.name,
      role: membership.role,
      joinedAt: membership.createdAt,
    };
  }
}
