import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class InterestsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Return all campus interests ordered alphabetically.
   */
  async findAll() {
    return this.prisma.interest.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
      },
    });
  }
}
