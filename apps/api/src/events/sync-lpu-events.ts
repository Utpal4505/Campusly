import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure env is loaded regardless of execution CWD
const candidatePaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '..', '.env'),
  path.resolve(__dirname, '../..', '.env'),
  path.resolve(__dirname, '../../..', '.env'),
];

for (const p of candidatePaths) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    break;
  }
}

const connectionString =
  process.env['DATABASE_URL'] ||
  'postgresql://postgres:postgres@localhost:5432/campusly?schema=public';

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

interface DevfolioHackathon {
  _source: {
    uuid: string;
    name: string;
    tagline?: string;
    desc?: string;
    starts_at: string;
    ends_at?: string;
    city?: string;
    country?: string;
    slug: string;
    banner_url?: string;
    cover_img?: string;
    type?: string;
    prize_pool?: number;
  };
}

async function syncLiveHackathons() {
  console.log('🔄 Fetching live national & campus hackathons from Devfolio API...');

  try {
    const res = await fetch('https://api.devfolio.co/api/search/hackathons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Campusly-Sync-Bot/1.0',
      },
      body: JSON.stringify({
        type: 'application_open',
      }),
    });

    if (!res.ok) {
      throw new Error(`Devfolio API responded with status ${res.status}`);
    }

    const data = (await res.json()) as { hits?: { hits?: DevfolioHackathon[] } };
    const items = data.hits?.hits ?? [];

    console.log(`📡 Discovered ${items.length} live upcoming hackathons online!`);

    // Ensure campus organizer user exists to attribute imported events
    const organizer = await prisma.user.upsert({
      where: { email: 'organizer@campusly.internal' },
      update: {},
      create: {
        id: 'seed-organizer-user',
        name: 'LPU Division of Student Welfare (DSW)',
        email: 'organizer@campusly.internal',
        department: 'Division of Student Welfare, Block 13',
        yearOfStudy: 4,
        emailVerified: true,
      },
    });

    // Default interests to associate
    const webDevInterest = await prisma.interest.findUnique({ where: { name: 'Web Development' } });
    const aiInterest = await prisma.interest.findUnique({ where: { name: 'Artificial Intelligence' } });
    const startupsInterest = await prisma.interest.findUnique({ where: { name: 'Startups' } });

    let syncedCount = 0;
    for (const h of items) {
      const src = h._source;
      if (!src.name || !src.starts_at) continue;

      const eventId = `live-devfolio-${src.slug || src.uuid}`;
      const location = src.city
        ? `${src.city}, ${src.country || 'India'}`
        : 'Online & Campus Hybrid';
      const description = src.desc || src.tagline || 'Live student hackathon open for campus registration.';

      const event = await prisma.event.upsert({
        where: { id: eventId },
        update: {
          title: src.name,
          description,
          coverImage: src.banner_url || src.cover_img || null,
          date: new Date(src.starts_at),
          location,
          price: 0,
          currency: 'INR',
        },
        create: {
          id: eventId,
          title: src.name,
          description,
          coverImage: src.banner_url || src.cover_img || null,
          date: new Date(src.starts_at),
          location,
          price: 0,
          currency: 'INR',
          creatorId: organizer.id,
        },
      });

      // Link tags
      if (webDevInterest) {
        await prisma.eventInterest.upsert({
          where: { eventId_interestId: { eventId: event.id, interestId: webDevInterest.id } },
          update: {},
          create: { eventId: event.id, interestId: webDevInterest.id },
        });
      }
      if (aiInterest) {
        await prisma.eventInterest.upsert({
          where: { eventId_interestId: { eventId: event.id, interestId: aiInterest.id } },
          update: {},
          create: { eventId: event.id, interestId: aiInterest.id },
        });
      }
      if (startupsInterest) {
        await prisma.eventInterest.upsert({
          where: { eventId_interestId: { eventId: event.id, interestId: startupsInterest.id } },
          update: {},
          create: { eventId: event.id, interestId: startupsInterest.id },
        });
      }

      syncedCount++;
    }

    console.log(`✅ Successfully synced and updated ${syncedCount} live hackathons into PostgreSQL!`);
  } catch (error) {
    console.error('❌ Failed to sync live hackathons:', error);
  } finally {
    await prisma.$disconnect();
  }
}

syncLiveHackathons();
