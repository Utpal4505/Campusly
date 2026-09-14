import '../env.js';
import {
  Injectable,
  type OnModuleInit,
  type OnModuleDestroy,
} from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const connectionString =
      process.env['DATABASE_URL'] ||
      'postgresql://postgres:postgres@localhost:5432/campusly?schema=public';
    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }

  async onModuleInit() {
    if (process.env['DATABASE_URL']) {
      await this.$connect();
    }
  }

  async onModuleDestroy() {
    if (process.env['DATABASE_URL']) {
      await this.$disconnect();
    }
  }
}
