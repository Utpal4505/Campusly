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
    price: 199,
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
    interestNames: ['Design', 'UI/UX', 'Content Creation'],
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
  {
    id: 'seed-event-5',
    title: 'CTF Cybersecurity Bootcamp & Live War Games',
    description:
      '48-hour ethical hacking challenge. Penetration testing, cryptography puzzles, web vulnerability exploitation, and defense.',
    date: new Date('2026-11-15T10:00:00Z'),
    location: 'Cyber Defense Lab, Block 34',
    interestNames: ['Cybersecurity', 'Cloud Computing', 'Open Source'],
  },
  {
    id: 'seed-event-6',
    title: 'Algorithmic Code Clash 2026',
    description:
      'Speed programming competition on advanced dynamic programming, graph theory, and algorithmic problem solving.',
    date: new Date('2026-11-20T16:00:00Z'),
    location: 'Online & Central Computing Lab 4',
    interestNames: ['Competitive Programming', 'Data Science', 'Open Source'],
  },
  {
    id: 'seed-event-7',
    title: 'Flutter & React Native Mobile Hack Jam',
    description:
      'Build and publish cross-platform iOS & Android apps in a weekend. Industry mentor code reviews and prizes.',
    date: new Date('2026-11-28T09:30:00Z'),
    location: 'Mobile Innovation Suite, Block 28',
    interestNames: ['App Development', 'Web Development', 'UI/UX'],
  },
  {
    id: 'seed-event-8',
    title: 'Campus Esports Championship: Valorant & BGMI',
    description:
      'Inter-college gaming tournament with live casting, spectator arena, and ₹40,000 prize pool.',
    date: new Date('2026-12-05T13:00:00Z'),
    location: 'Indoor Sports Arena & Gaming Lounge',
    price: 299,
    interestNames: ['Gaming', 'Content Creation', 'Design'],
  },
  {
    id: 'seed-event-9',
    title: 'Kaggle Campus Cup: Predictive ML Datathon',
    description:
      'Analyze complex campus datasets to build predictive models. Real-world machine learning challenge for student data scientists.',
    date: new Date('2026-12-10T10:00:00Z'),
    location: 'Data Analytics Wing, Block 32',
    price: 149,
    interestNames: ['Data Science', 'Machine Learning', 'Artificial Intelligence'],
  },
  {
    id: 'seed-event-10',
    title: 'Acoustic Unplugged & Indie Music Jam',
    description:
      'Open mic night for student vocalists, bands, and instrumentalists. High-energy music and creative collaboration.',
    date: new Date('2026-12-15T18:00:00Z'),
    location: 'Amphitheatre Central Green',
    interestNames: ['Music', 'Content Creation'],
  },
  {
    id: 'seed-event-11',
    title: 'Campus Photo Walk & Street Photography Exhibition',
    description:
      'Guided photography tour focusing on golden-hour campus architecture, candid portraits, and Lightroom editing.',
    date: new Date('2026-12-20T15:30:00Z'),
    location: 'Main University Plaza',
    interestNames: ['Photography', 'Content Creation', 'Design'],
  },
  {
    id: 'seed-event-12',
    title: 'Parliamentary Debate & Eloquence Gala',
    description:
      'National-style Asian parliamentary debate championship. Sharpen oratory mastery, critical argumentation, and diplomacy.',
    date: new Date('2026-12-28T11:00:00Z'),
    location: 'Senate Chambers, Block 1',
    interestNames: ['Debate', 'Public Speaking', 'Entrepreneurship'],
  },
  {
    id: 'seed-event-13',
    title: 'LPU Premier League: T20 Cricket Cup',
    description:
      'Annual departmental cricket league. 16 teams battle for the campus championship cup with floodlit finals.',
    date: new Date('2027-01-10T14:00:00Z'),
    location: 'University Sports Complex Grounds',
    interestNames: ['Cricket', 'Fitness & Health'],
  },
  {
    id: 'seed-event-14',
    title: 'Inter-Department Football Derby & League',
    description:
      '7-a-side competitive soccer league with scouts, refereeing, and athletic awards for student football players.',
    date: new Date('2027-01-18T16:30:00Z'),
    location: 'Main Football Turf Stadium',
    interestNames: ['Football', 'Fitness & Health'],
  },
];

const SEED_STUDENTS = [
  {
    id: 'seed-student-1',
    name: 'Rahul Sharma',
    username: 'rahul_dev',
    email: 'rahul.sharma@lpu.in',
    department: 'School of Computer Science & Engineering',
    yearOfStudy: 3,
    bio: 'Looking for teammates for hackathons and building agentic developer tools.',
    interestNames: ['Artificial Intelligence', 'Web Development', 'Open Source', 'Startups'],
  },
  {
    id: 'seed-student-2',
    name: 'Ananya Singh',
    username: 'ananya_singh',
    email: 'ananya.singh@lpu.in',
    department: 'School of Design',
    yearOfStudy: 2,
    bio: 'Interested in building student products and designing modern web experiences.',
    interestNames: ['Design', 'UI/UX', 'Content Creation', 'Startups'],
  },
  {
    id: 'seed-student-3',
    name: 'Dev Kapoor',
    username: 'dev_kapoor',
    email: 'dev.kapoor@lpu.in',
    department: 'School of Computer Science & Engineering',
    yearOfStudy: 3,
    bio: 'Working on campus utilities and cross-platform Flutter/React Native tools.',
    interestNames: ['Web Development', 'App Development', 'Open Source'],
  },
  {
    id: 'seed-student-4',
    name: 'Priya Verma',
    username: 'priya_ai',
    email: 'priya.verma@lpu.in',
    department: 'School of Computer Applications',
    yearOfStudy: 3,
    bio: 'Looking for research collaborators and hackathon partners for LLM projects.',
    interestNames: ['Artificial Intelligence', 'Machine Learning', 'Data Science'],
  },
  {
    id: 'seed-student-5',
    name: 'Rohan Mehta',
    username: 'rohan_mehta',
    email: 'rohan.mehta@lpu.in',
    department: 'Mittal School of Business',
    yearOfStudy: 4,
    bio: 'Building student startup incubators and fintech tools. Seeking co-founders.',
    interestNames: ['Startups', 'Entrepreneurship', 'Finance & Investing'],
  },
  {
    id: 'seed-student-6',
    name: 'Sneha Reddy',
    username: 'sneha_robotics',
    email: 'sneha.reddy@lpu.in',
    department: 'School of Electronics & Electrical Engineering',
    yearOfStudy: 2,
    bio: 'Autonomous bot engineering, drone navigation, and sensor firmware.',
    interestNames: ['Robotics', 'Artificial Intelligence', 'Machine Learning'],
  },
  {
    id: 'seed-student-7',
    name: 'Aarav Patel',
    username: 'aarav_coder',
    email: 'aarav.patel@lpu.in',
    department: 'School of Computer Science & Engineering',
    yearOfStudy: 2,
    bio: 'Competitive programmer (Candidate Master on CF). Looking for ICPC squad mates.',
    interestNames: ['Competitive Programming', 'Data Science', 'Open Source'],
  },
  {
    id: 'seed-student-8',
    name: 'Tanvi Joshi',
    username: 'tanvi_joshi',
    email: 'tanvi.joshi@lpu.in',
    department: 'School of Journalism & Film Production',
    yearOfStudy: 3,
    bio: 'Campus cinematography lead, event visual stories, and video editing.',
    interestNames: ['Photography', 'Content Creation', 'Design'],
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
  {
    id: 'seed-club-5',
    name: 'CyberShield Information Security Society',
    description:
      'White-hat ethical hackers and security researchers. Hands-on bug bounty hunting, reverse engineering, and defensive forensics.',
    interestNames: ['Cybersecurity', 'Cloud Computing', 'Blockchain'],
  },
  {
    id: 'seed-club-6',
    name: 'Competitive Coding & Algorithmic Guild',
    description:
      'Dedicated training club for Codeforces, LeetCode, and ICPC contests with weekly live mock rounds and problem editorial discussions.',
    interestNames: ['Competitive Programming', 'Data Science', 'Open Source'],
  },
  {
    id: 'seed-club-7',
    name: 'Mobile App Developers Guild',
    description:
      'Community building slick native & cross-platform Android and iOS applications with Flutter, Swift, and React Native.',
    interestNames: ['App Development', 'Web Development', 'UI/UX'],
  },
  {
    id: 'seed-club-8',
    name: 'GameCraft & Esports Union',
    description:
      'Unity and Unreal engine game developers, 3D modelers, and competitive esports organizers uniting gamers across campus.',
    interestNames: ['Gaming', 'Design', 'App Development'],
  },
  {
    id: 'seed-club-9',
    name: 'Data Science & Machine Learning Hub',
    description:
      'Applied analytics group working on big data, LLM fine-tuning, computer vision, and quantitative research papers.',
    interestNames: ['Data Science', 'Machine Learning', 'Artificial Intelligence'],
  },
  {
    id: 'seed-club-10',
    name: 'Campus Music Society & Sound Lab',
    description:
      'Bands, vocalists, audio producers, and live session musicians organizing acoustic jams and campus concerts.',
    interestNames: ['Music', 'Content Creation'],
  },
  {
    id: 'seed-club-11',
    name: 'Shutterbugs Photography & Media Guild',
    description:
      'Visual storytellers mastering DSLR photography, cinematography, color grading, and creative campus media coverage.',
    interestNames: ['Photography', 'Content Creation', 'Design'],
  },
  {
    id: 'seed-club-12',
    name: 'Toastmasters & Campus Debate Union',
    description:
      'Elite oratory club fostering charismatic public speaking, parliamentary debate, negotiation, and campus leadership.',
    interestNames: ['Public Speaking', 'Debate', 'Entrepreneurship'],
  },
  {
    id: 'seed-club-13',
    name: 'Campus Athletics, Cricket & Football Club',
    description:
      'Official student sports body organizing intramural tournaments, varsity cricket matches, and fitness training.',
    interestNames: ['Cricket', 'Football', 'Fitness & Health'],
  },
  {
    id: 'seed-club-14',
    name: 'Blockchain & FinTech Society',
    description:
      'Student chapter researching decentralized protocols, smart contract auditing, algorithmic trading, and personal finance.',
    interestNames: ['Blockchain', 'Finance & Investing', 'Cybersecurity'],
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
        price: (eventData as any).price ?? 0,
        currency: 'INR',
      },
      create: {
        id: eventData.id,
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        location: eventData.location,
        price: (eventData as any).price ?? 0,
        currency: 'INR',
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

  // Seed campus students and link their interests
  console.log('🌱 Seeding campus students & peer profiles...');
  for (const studentData of SEED_STUDENTS) {
    const student = await prisma.user.upsert({
      where: { email: studentData.email },
      update: {
        name: studentData.name,
        username: studentData.username,
        department: studentData.department,
        yearOfStudy: studentData.yearOfStudy,
        bio: studentData.bio,
      },
      create: {
        id: studentData.id,
        name: studentData.name,
        username: studentData.username,
        email: studentData.email,
        department: studentData.department,
        yearOfStudy: studentData.yearOfStudy,
        bio: studentData.bio,
        emailVerified: true,
      },
    });

    for (const interestName of studentData.interestNames) {
      const interest = await prisma.interest.findUnique({
        where: { name: interestName },
      });
      if (interest) {
        await prisma.userInterest.upsert({
          where: {
            userId_interestId: {
              userId: student.id,
              interestId: interest.id,
            },
          },
          update: {},
          create: {
            userId: student.id,
            interestId: interest.id,
          },
        });
      }
    }
  }
  console.log(`✅ Successfully seeded ${SEED_STUDENTS.length} campus students!`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
