import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { emailOTP } from 'better-auth/plugins';
import { sendMail, formatOtpEmailHtml } from './mail.js';

const connectionString =
  process.env['DATABASE_URL'] ||
  'postgresql://postgres:postgres@localhost:5432/campusly?schema=public';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  user: {
    additionalFields: {
      username: {
        type: 'string',
        required: false,
        input: true,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId:
        process.env['GOOGLE_CLIENT_ID'] ||
        'campusly-google-client-id.apps.googleusercontent.com',
      clientSecret:
        process.env['GOOGLE_CLIENT_SECRET'] ||
        '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t',
      enabled: true,
    },
  },
  plugins: [
    emailOTP({
      expiresIn: 600, // 10 minutes
      sendVerificationOnSignUp: false, // We can trigger verification or verify during registration
      async sendVerificationOTP({ email, otp, type }) {
        await sendMail({
          to: email,
          subject: `Verify your Campusly Account — OTP: ${otp}`,
          text: `Your Campusly verification code is ${otp}. It expires in 10 minutes.`,
          html: formatOtpEmailHtml(otp),
        });
      },
    }),
  ],
  trustedOrigins: [
    process.env['FRONTEND_URL'] ?? 'http://localhost:3000',
    'http://localhost:4000',
  ],
  advanced: {
    database: {
      joins: true,
    },
  },
});
