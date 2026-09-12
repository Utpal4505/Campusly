import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Return the authenticated user's profile along with their selected interests.
   */
  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        userInterests: {
          include: {
            interest: true,
          },
          orderBy: {
            interest: {
              name: 'asc',
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      bio: user.bio,
      department: user.department,
      yearOfStudy: user.yearOfStudy,
      createdAt: user.createdAt,
      interests: user.userInterests.map((ui) => ({
        id: ui.interest.id,
        name: ui.interest.name,
      })),
    };
  }

  /**
   * Replace the user's selected interests with the supplied interest IDs.
   */
  async updatePreferences(userId: string, interestIds: string[]) {
    // Deduplicate requested IDs
    const uniqueIds = Array.from(new Set(interestIds));

    // Verify all requested interest IDs exist in the database
    const existingInterests = await this.prisma.interest.findMany({
      where: {
        id: { in: uniqueIds },
      },
      select: { id: true },
    });

    if (existingInterests.length !== uniqueIds.length) {
      throw new BadRequestException('One or more interest IDs are invalid');
    }

    // Atomic replacement of UserInterest records
    await this.prisma.$transaction([
      this.prisma.userInterest.deleteMany({
        where: { userId },
      }),
      this.prisma.userInterest.createMany({
        data: uniqueIds.map((interestId) => ({
          userId,
          interestId,
        })),
      }),
    ]);

    // Fetch and return the newly saved interests
    const updated = await this.prisma.userInterest.findMany({
      where: { userId },
      include: {
        interest: true,
      },
      orderBy: {
        interest: {
          name: 'asc',
        },
      },
    });

    return {
      message: 'Preferences updated successfully',
      interests: updated.map((ui) => ({
        id: ui.interest.id,
        name: ui.interest.name,
      })),
    };
  }

  /**
   * Return all campus users/peers with their tagged interests.
   * Can filter by interest name/ID or search term.
   */
  async findAll(interest?: string, search?: string) {
    const where: any = {};

    where.email = {
      not: 'organizer@campusly.internal',
    };

    if (interest && interest !== 'All') {
      where.userInterests = {
        some: {
          interest: {
            OR: [
              { id: interest },
              { name: { equals: interest, mode: 'insensitive' } },
            ],
          },
        },
      };
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { department: { contains: q, mode: 'insensitive' } },
        { bio: { contains: q, mode: 'insensitive' } },
        {
          userInterests: {
            some: {
              interest: {
                name: { contains: q, mode: 'insensitive' },
              },
            },
          },
        },
      ];
    }

    const users = await this.prisma.user.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
      include: {
        userInterests: {
          include: {
            interest: true,
          },
          orderBy: {
            interest: {
              name: 'asc',
            },
          },
        },
      },
    });

    return users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      image: u.image,
      bio: u.bio,
      department: u.department,
      yearOfStudy: u.yearOfStudy,
      createdAt: u.createdAt,
      interests: u.userInterests.map((ui) => ({
        id: ui.interest.id,
        name: ui.interest.name,
      })),
    }));
  }

  /**
   * Return a single user by ID or slugified name.
   */
  async findOne(idOrSlug: string) {
    // 1. Try finding by ID
    let user = await this.prisma.user.findUnique({
      where: { id: idOrSlug },
      include: {
        userInterests: {
          include: {
            interest: true,
          },
        },
      },
    });

    if (!user) {
      // 2. Try finding by slugified name
      const allUsers = await this.prisma.user.findMany({
        include: {
          userInterests: {
            include: {
              interest: true,
            },
          },
        },
      });

      const targetSlug = idOrSlug.toLowerCase().trim();
      user =
        allUsers.find((u) => {
          if (u.id.toLowerCase() === targetSlug) return true;
          const slug = u.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
          return slug === targetSlug || slug.includes(targetSlug) || targetSlug.includes(slug);
        }) || null;
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      bio: user.bio,
      department: user.department,
      yearOfStudy: user.yearOfStudy,
      createdAt: user.createdAt,
      interests: user.userInterests.map((ui) => ({
        id: ui.interest.id,
        name: ui.interest.name,
      })),
    };
  }
}
