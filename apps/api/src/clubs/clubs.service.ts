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
   * Return full details of a specific club by ID.
   */
  async findOne(id: string) {
    const club = await this.prisma.club.findUnique({
      where: { id },
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
   * Join a club as a member.
   */
  async join(clubId: string, userId: string) {
    // Verify the club exists
    const club = await this.prisma.club.findUnique({
      where: { id: clubId },
      select: { id: true, name: true },
    });

    if (!club) {
      throw new NotFoundException('Club not found');
    }

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
