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
}
