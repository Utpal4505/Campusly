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
      username: user.username,
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
      const cleanQ = q.replace(/^@/, '');
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { username: { contains: cleanQ, mode: 'insensitive' } },
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
      username: u.username,
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
   * Return a single user by ID, username, or slugified name.
   */
  async findOne(idOrSlug: string) {
    const cleanHandle = idOrSlug.replace(/^@/, '').trim();

    // 1. Try finding by ID or username
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { id: idOrSlug },
          { username: cleanHandle },
          { username: { equals: cleanHandle, mode: 'insensitive' } },
        ],
      },
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

      const targetSlug = cleanHandle.toLowerCase().trim();
      user =
        allUsers.find((u) => {
          if (u.id.toLowerCase() === targetSlug) return true;
          if (u.username && u.username.toLowerCase() === targetSlug) return true;
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
      username: user.username,
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
   * Check if a requested username handle is available.
   */
  async checkUsername(rawUsername: string) {
    const clean = (rawUsername || '').replace(/^@/, '').toLowerCase().trim();

    if (!clean) {
      return {
        available: false,
        username: '',
        error: 'Please enter a username',
      };
    }

    if (clean.length < 3) {
      return {
        available: false,
        username: clean,
        error: 'Handle must be at least 3 characters',
      };
    }

    if (clean.length > 20) {
      return {
        available: false,
        username: clean,
        error: 'Handle cannot exceed 20 characters',
      };
    }

    if (!/^[a-z0-9_]+$/.test(clean)) {
      return {
        available: false,
        username: clean,
        error: 'Only lowercase letters, numbers, and underscores are allowed',
      };
    }

    const RESERVED_HANDLES = new Set([
      'admin',
      'administrator',
      'feed',
      'events',
      'clubs',
      'api',
      'login',
      'register',
      'tickets',
      'messages',
      'people',
      'onboarding',
      'campusly',
      'support',
      'settings',
      'profile',
      'user',
      'users',
    ]);

    if (RESERVED_HANDLES.has(clean)) {
      return {
        available: false,
        username: clean,
        error: 'This handle is reserved',
      };
    }

    const existing = await this.prisma.user.findFirst({
      where: {
        username: {
          equals: clean,
          mode: 'insensitive',
        },
      },
      select: { id: true },
    });

    if (existing) {
      const yearSuffix = new Date().getFullYear().toString().slice(-2);
      return {
        available: false,
        username: clean,
        error: 'Already taken',
        suggestions: [
          `${clean}_${Math.floor(10 + Math.random() * 90)}`,
          `${clean}_lpu`,
          `${clean}${yearSuffix}`,
        ],
      };
    }

    return {
      available: true,
      username: clean,
      suggestions: [],
    };
  }

  /**
   * Update or claim the authenticated user's campus handle.
   */
  async updateUsername(userId: string, rawUsername: string) {
    const clean = (rawUsername || '').replace(/^@/, '').toLowerCase().trim();

    // If the user already has this handle, return current profile
    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { username: true },
    });
    if (currentUser?.username && currentUser.username.toLowerCase() === clean) {
      return this.getMe(userId);
    }

    const check = await this.checkUsername(rawUsername);
    if (!check.available) {
      throw new BadRequestException(check.error || 'Username is not available');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { username: check.username },
    });

    return this.getMe(userId);
  }

  /**
   * Update student profile fields (name, bio, department, yearOfStudy).
   */
  async updateProfile(
    userId: string,
    data: {
      name?: string;
      bio?: string;
      department?: string;
      yearOfStudy?: number | string;
    },
  ) {
    const updateData: any = {};
    if (data.name && data.name.trim()) updateData.name = data.name.trim();
    if (data.bio !== undefined) updateData.bio = data.bio?.trim() || null;
    if (data.department !== undefined)
      updateData.department = data.department?.trim() || null;
    if (data.yearOfStudy !== undefined && data.yearOfStudy !== null) {
      const parsed = parseInt(String(data.yearOfStudy), 10);
      updateData.yearOfStudy = isNaN(parsed) ? null : parsed;
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return this.getMe(userId);
  }
}
