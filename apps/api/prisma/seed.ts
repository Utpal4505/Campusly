import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString =
  process.env['DATABASE_URL'] ||
  'postgresql://postgres:postgres@localhost:5432/campusly?schema=public';

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const CAMPUS_INTERESTS: string[] = [
  'Artificial Intelligence',
  'Web Development',
  'App Development',
  'Cybersecurity',
  'Data Science',
  'Machine Learning',
  'Cloud Computing',
  'Blockchain',
  'Competitive Programming',
  'Open Source',
  'Robotics',
  'Startups',
  'Entrepreneurship',
  'Design',
  'UI/UX',
  'Gaming',
  'Cricket',
  'Football',
  'Music',
  'Photography',
  'Public Speaking',
  'Debate',
  'Finance & Investing',
  'Fitness & Health',
  'Content Creation',
];

const SEED_EVENTS = [
  {
    id: 'seed-event-1',
    title: 'Campus Hackathon 2026',
    description:
      'Annual 36-hour student hackathon. Build innovative AI, Web, and Mobile solutions with mentorship and sponsor prizes.',
    date: new Date('2026-10-20T09:00:00Z'),
    location: 'Main Auditorium, Block 34',
    interestNames: [
      'Artificial Intelligence',
      'Web Development',
      'Startups',
    ],
  },
  {
    id: 'seed-event-2',
    title: 'AI & Robotics Project Showcase',
    description:
      'Hands-on exhibition of autonomous bots, machine learning research projects, and embedded hardware demos.',
    date: new Date('2026-10-25T14:00:00Z'),
    location: 'Innovation Lab 3, Uni Central',
    interestNames: [
      'Artificial Intelligence',
      'Robotics',
      'Machine Learning',
    ],
  },
  {
    id: 'seed-event-3',
    title: 'UI/UX Design Sprint',
    description:
      'Interactive workshop on design thinking, Figma component architectures, and prototyping for real student products.',
    date: new Date('2026-11-02T11:00:00Z'),
    location: 'Design Studio A, Block 12',
    interestNames: ['Design', 'UI/UX'],
  },
  {
    id: 'seed-event-4',
    title: 'Startup Pitch Night & Founder Mixer',
    description:
      'Campus founders pitch early-stage ideas to alumni mentors and student leaders. Networking and refreshments included.',
    date: new Date('2026-11-10T17:30:00Z'),
    location: 'Student Activity Center, Hall B',
    interestNames: [
      'Startups',
      'Entrepreneurship',
      'Finance & Investing',
    ],
  },
];

const SEED_CLUBS = [
  {
    id: 'seed-club-1',
    name: 'Google Developer Student Club',
    description:
      'Community for university students passionate about Google developer technologies, cloud architectures, and open-source collaboration.',
    interestNames: [
      'Web Development',
      'Cloud Computing',
      'Open Source',
    ],
  },
  {
    id: 'seed-club-2',
    name: 'AI & Robotics Society',
    description:
      'Student-led technical club fostering hands-on research in autonomous bots, machine learning, and computer vision competitions.',
    interestNames: [
      'Artificial Intelligence',
      'Robotics',
      'Machine Learning',
    ],
  },
  {
    id: 'seed-club-3',
    name: 'Design & UX Collective',
    description:
      'Creative space for product designers, Figma creators, and visual storytellers building intuitive student interfaces.',
    interestNames: ['Design', 'UI/UX', 'Content Creation'],
  },
  {
    id: 'seed-club-4',
    name: 'Campus E-Cell',
    description:
      'Hub for budding campus entrepreneurs. We host startup pitch sessions, incubator access, and mentor mixers.',
    interestNames: [
      'Startups',
      'Entrepreneurship',
      'Finance & Investing',
    ],
  },
];

async function main() {
  console.log('🌱 Seeding Campusly interests...');

  let count = 0;
  for (const name of CAMPUS_INTERESTS) {
    await prisma.interest.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    count++;
  }
  console.log(`✅ Successfully seeded ${count} campus interests!`);

  // Ensure a campus organizer user exists to attribute events & clubs to
  console.log('🌱 Seeding campus organizer, events, and clubs...');
  const organizer = await prisma.user.upsert({
    where: { email: 'organizer@campusly.internal' },
    update: {},
    create: {
      id: 'seed-organizer-user',
      name: 'Campus Event Board',
      email: 'organizer@campusly.internal',
      department: 'Student Affairs',
      yearOfStudy: 4,
      emailVerified: true,
    },
  });

  // Seed events and link their interests
  for (const eventData of SEED_EVENTS) {
    const event = await prisma.event.upsert({
      where: { id: eventData.id },
      update: {
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        location: eventData.location,
      },
      create: {
        id: eventData.id,
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        location: eventData.location,
        creatorId: organizer.id,
      },
    });

    for (const interestName of eventData.interestNames) {
      const interest = await prisma.interest.findUnique({
        where: { name: interestName },
      });
      if (interest) {
        await prisma.eventInterest.upsert({
          where: {
            eventId_interestId: {
              eventId: event.id,
              interestId: interest.id,
            },
          },
          update: {},
          create: {
            eventId: event.id,
            interestId: interest.id,
          },
        });
      }
    }
  }
  console.log(`✅ Successfully seeded ${SEED_EVENTS.length} campus events!`);

  // Seed clubs and link their interests
  for (const clubData of SEED_CLUBS) {
    const club = await prisma.club.upsert({
      where: { id: clubData.id },
      update: {
        name: clubData.name,
        description: clubData.description,
      },
      create: {
        id: clubData.id,
        name: clubData.name,
        description: clubData.description,
        creatorId: organizer.id,
      },
    });

    for (const interestName of clubData.interestNames) {
      const interest = await prisma.interest.findUnique({
        where: { name: interestName },
      });
      if (interest) {
        await prisma.clubInterest.upsert({
          where: {
            clubId_interestId: {
              clubId: club.id,
              interestId: interest.id,
            },
          },
          update: {},
          create: {
            clubId: club.id,
            interestId: interest.id,
          },
        });
      }
    }
  }
  console.log(`✅ Successfully seeded ${SEED_CLUBS.length} campus clubs!`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
