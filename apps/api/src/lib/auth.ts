import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString =
  process.env['DATABASE_URL'] ||
  'postgresql://postgres:postgres@localhost:5432/campusly?schema=public';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [process.env['FRONTEND_URL'] ?? 'http://localhost:3000'],
  advanced: {
    database: {
      joins: true,
    },
  },
});
