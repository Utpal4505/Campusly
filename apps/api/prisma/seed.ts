import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Robust env loading regardless of execution CWD
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
  'Theatre & Drama',
  'Social Welfare',
  'Environmental Initiatives',
];

const SEED_CLUBS = [
  // Grassroots & Departmental Coding Chapters
  {
    id: 'seed-club-codingblocks',
    name: 'Coding Blocks LPU Community',
    description:
      'Grassroots student community focusing on C++, Java DSA bootcamps, weekly speed-coding sprints, and placement prep rounds in Block 34.',
    interestNames: ['Competitive Programming', 'Web Development', 'Open Source'],
  },
  {
    id: 'seed-club-codingninjas',
    name: 'Coding Ninjas LPU Student Chapter',
    description:
      'Student-led campus chapter hosting beginner-friendly programming bootcamps, 12-hour mini-hacks, and peer-to-peer developer mentorship.',
    interestNames: ['Web Development', 'App Development', 'Competitive Programming'],
  },
  {
    id: 'seed-club-gfg',
    name: 'GeeksforGeeks (GFG) Student Chapter LPU',
    description:
      'Official campus chapter organizing weekly algorithmic showdowns, DSA interview preparation workshops, and hackathons in Block 34.',
    interestNames: ['Competitive Programming', 'Data Science', 'Open Source'],
  },
  {
    id: 'seed-club-codechef',
    name: 'CodeChef Campus Chapter LPU',
    description:
      'Algorithmic programming society running live watch parties for Starters & Cook-Off contests, editorial breakdown sessions, and ICPC prep.',
    interestNames: ['Competitive Programming', 'Data Science'],
  },
  {
    id: 'seed-club-girlscript',
    name: 'GirlScript LPU Chapter',
    description:
      'Inclusive tech community empowering students through open-source contribution sprints, beginner-friendly hackathons, and tech mentorship.',
    interestNames: ['Open Source', 'Web Development', 'Artificial Intelligence'],
  },
  {
    id: 'seed-club-cybsec',
    name: 'CybSec LPU / Null Chapter',
    description:
      'White-hat ethical hackers and infosec researchers. Hands-on CTF war games, bug bounty hunting, reverse engineering, and Cyberwar hackathons.',
    interestNames: ['Cybersecurity', 'Cloud Computing', 'Blockchain'],
  },
  {
    id: 'seed-club-risc',
    name: 'RISC (Robotics & Intelligent Systems Community)',
    description:
      'Student robotics research collective building autonomous rovers, battle bots, drone navigation firmware, and hosting RoboWars in Innovation Studio.',
    interestNames: ['Robotics', 'Artificial Intelligence', 'Machine Learning'],
  },
  {
    id: 'seed-club-electech',
    name: 'Club ElecTech (Hardware & IoT)',
    description:
      'Hardware and embedded electronics makers club working on Arduino, ESP32, Raspberry Pi, sensor telemetry, and smart campus automation.',
    interestNames: ['Robotics', 'Cloud Computing'],
  },

  // University-Wide & Flagship Tech Chapters
  {
    id: 'seed-club-gdg',
    name: 'GDG on Campus LPU (formerly GDSC)',
    description:
      'University chapter for student builders passionate about Google developer technologies, Android, Flutter, Cloud architectures, and the Solution Challenge.',
    interestNames: ['Web Development', 'Cloud Computing', 'Artificial Intelligence', 'App Development'],
  },
  {
    id: 'seed-club-ieee',
    name: 'IEEE LPU Student Branch',
    description:
      'Preeminent technical student branch bridging academic research and industry through robotics symposiums, technical paper workshops, and IoT hackathons.',
    interestNames: ['Robotics', 'Artificial Intelligence', 'Cybersecurity'],
  },
  {
    id: 'seed-club-tatva',
    name: 'Tatva Student Organization (DSW)',
    description:
      'Flagship DSW student organization known for organizing national-scale technical conventions, gaming summits, and the annual HackWave hackathon.',
    interestNames: ['Startups', 'Web Development', 'Open Source'],
  },
  {
    id: 'seed-club-aurora',
    name: 'Aurora Student Organization',
    description:
      'High-energy tech and innovation group organizing sprint hackathons, Aurora Codefest, and hands-on software development bootcamps.',
    interestNames: ['Competitive Programming', 'Web Development', 'UI/UX'],
  },
  {
    id: 'seed-club-lscc',
    name: 'LSCC (LPU SAEINDIA Collegiate Club)',
    description:
      'Automotive engineering and motorsport team designing, fabricating, and racing BAJA SAE all-terrain vehicles and Formula Student race cars.',
    interestNames: ['Robotics', 'Fitness & Health'],
  },

  // Cultural, Media, Creative & Performing Arts
  {
    id: 'seed-club-natyamanch',
    name: 'Natya Manch (DSW Theatre Society)',
    description:
      'Premier campus theatre society famous for high-impact Nukkad Natak (street plays) outside Block 38 Uni Mall, proscenium stage dramas, and mime.',
    interestNames: ['Theatre & Drama', 'Content Creation', 'Public Speaking'],
  },
  {
    id: 'seed-club-iqlipse',
    name: 'IQLIPSE & Dhwani Music Society',
    description:
      'Campus acoustic bands, vocalists, beatboxers, and instrumentalists hosting open mics at Baldev Raj Mittal Unipolis and campus concerts.',
    interestNames: ['Music', 'Content Creation'],
  },
  {
    id: 'seed-club-vibedance',
    name: 'Vibe Dance Crew / Western & Eastern Beats',
    description:
      'Elite dance teams representing LPU in hip-hop, folk (Bhangra, Giddha), and contemporary styles across national college fests and YouthVibe.',
    interestNames: ['Fitness & Health', 'Content Creation'],
  },
  {
    id: 'seed-club-shutterbugs',
    name: 'Shutterbugs LPU & Uni TV',
    description:
      'Official campus media society covering university life with DSLR photography, cinematography, reel production, and color grading workshops.',
    interestNames: ['Photography', 'Content Creation', 'Design'],
  },
  {
    id: 'seed-club-designersden',
    name: 'Designers Den (School of Design, Block 12)',
    description:
      'Product designers, visual artists, and Figma creators hosting 24-hour UI/UX sprints, design thinking workshops, and campus design reviews.',
    interestNames: ['Design', 'UI/UX', 'Content Creation'],
  },
  {
    id: 'seed-club-kalakriti',
    name: 'Kalakriti & Canvas Fine Arts Club',
    description:
      'Fine arts guild specializing in acrylic painting, digital illustration, charcoal sketching, clay modeling, and campus art installations.',
    interestNames: ['Design', 'Content Creation'],
  },

  // Business, Finance & Entrepreneurship (Mittal School of Business)
  {
    id: 'seed-club-sml',
    name: 'SML (Society for Management Learning)',
    description:
      'Prominent Mittal School of Business (MSB) organization hosting management symposiums, corporate crisis simulations, and business case competitions.',
    interestNames: ['Startups', 'Entrepreneurship', 'Public Speaking'],
  },
  {
    id: 'seed-club-ecell',
    name: 'E-Cell LPU & Griffin Startup Hub',
    description:
      'University startup incubator under DSW supporting student founders with pitch sessions, angel mentor access, and the InnovateX conference.',
    interestNames: ['Startups', 'Entrepreneurship', 'Finance & Investing'],
  },
  {
    id: 'seed-club-finix',
    name: 'Finix (The Finance & Investment Club)',
    description:
      'Student-led finance club conducting mock stock trading leagues, crypto and algorithmic trading sessions, and personal finance bootcamps.',
    interestNames: ['Finance & Investing', 'Startups', 'Data Science'],
  },
  {
    id: 'seed-club-markophilic',
    name: 'Markophilic (The Marketing Society)',
    description:
      'Creative marketing guild hosting Ad-Mad satire commercials, viral product launch pitch battles, and digital growth marketing workshops.',
    interestNames: ['Startups', 'Design', 'Content Creation'],
  },

  // Social Initiatives, Literary, Oratory & Esports
  {
    id: 'seed-club-sankalp',
    name: 'Sankalp Green & Environmental Club',
    description:
      'Student-driven sustainability society organizing campus tree plantation drives, plastic-free initiatives, and renewable energy workshops.',
    interestNames: ['Environmental Initiatives', 'Social Welfare'],
  },
  {
    id: 'seed-club-wingsofhope',
    name: 'Wings of Hope & Aashray Social Welfare',
    description:
      'Dedicated social impact body coordinating blood donation drives, underprivileged children education camps, and disaster relief campaigns.',
    interestNames: ['Social Welfare', 'Public Speaking'],
  },
  {
    id: 'seed-club-spade',
    name: 'SPADE & Club20 Student Welfare',
    description:
      'Vibrant student welfare collective organizing campus health checkups, mental wellness discussions, and interactive freshmen mixer sessions.',
    interestNames: ['Social Welfare', 'Fitness & Health'],
  },
  {
    id: 'seed-club-debate',
    name: 'LPU Parliamentary Debating Union',
    description:
      'Asian Parliamentary debating team, oratory society, and Model United Nations (MUN) caucus training in Senate Chambers (Block 1).',
    interestNames: ['Debate', 'Public Speaking', 'Entrepreneurship'],
  },
  {
    id: 'seed-club-esports',
    name: 'LPU Esports & Gaming Guild',
    description:
      'Competitive gaming guild organizing inter-hostel Valorant, BGMI, and FIFA LAN tournaments with live broadcast and shoutcasting in Block 34.',
    interestNames: ['Gaming', 'Design', 'Content Creation'],
  },
];

const SEED_EVENTS = [
  // ── Top-Level Flagship Hackathons ──
  {
    id: 'seed-event-sih',
    title: 'Smart India Hackathon (SIH 2026) LPU Internal Selection',
    description:
      'Annual university-level 36-hour internal hackathon to evaluate and nominate top 30 student teams to represent LPU at the national SIH grand finale.',
    date: new Date('2026-11-05T09:00:00Z'),
    location: 'Block 34, Central Auditorium & Computing Labs',
    price: 0,
    interestNames: ['Artificial Intelligence', 'Web Development', 'Startups', 'Cybersecurity'],
  },
  {
    id: 'seed-event-hackwave',
    title: 'HackWave 2026 (National Hackathon by Tatva)',
    description:
      '36-hour flagship national-level hackathon with tracks in Web3, Generative AI, Open Innovation, and FinTech. ₹1,50,000 cash prize pool.',
    date: new Date('2026-11-14T09:30:00Z'),
    location: 'Shanti Devi Mittal Auditorium (Block 38)',
    price: 0,
    interestNames: ['Web Development', 'Blockchain', 'Artificial Intelligence', 'Startups'],
  },
  {
    id: 'seed-event-cyberwar',
    title: 'Cyberwar 2026: 36-Hour National CTF & Hack',
    description:
      'National cybersecurity hackathon hosted by CybSec LPU. Live jeopardy-style CTF, exploit mitigation, cryptography puzzles, and web penetration testing.',
    date: new Date('2026-11-22T10:00:00Z'),
    location: 'Cyber Defense Lab, Block 34 (SCSE)',
    price: 0,
    interestNames: ['Cybersecurity', 'Cloud Computing', 'Open Source'],
  },
  {
    id: 'seed-event-aetherax',
    title: 'AetheraX 2026: 24h IoT & Hardware-Software Hackathon',
    description:
      'Multi-track hardware and software innovation challenge. Build connected IoT devices, smart campus prototypes, and edge AI solutions in 24 hours.',
    date: new Date('2026-12-02T10:00:00Z'),
    location: 'Innovation Studio & Workshop, Block 36',
    price: 0,
    interestNames: ['Robotics', 'Artificial Intelligence', 'App Development'],
  },
  {
    id: 'seed-event-wow',
    title: 'Week of Wonders (WoW Hack) by GDG on Campus',
    description:
      'Multi-day tech summit and hackathon with Google Developer Experts, mentorship on Android Studio, Flutter, Cloud Run, and Gemini API integration.',
    date: new Date('2026-12-12T09:00:00Z'),
    location: 'Block 34 SCSE Main Hall & Online',
    price: 0,
    interestNames: ['Artificial Intelligence', 'Web Development', 'App Development', 'Cloud Computing'],
  },
  {
    id: 'seed-event-youthvibe',
    title: 'YouthVibe 2027: National Inter-College Tech Arena',
    description:
      'Flagship mega hackathon and robotics showdown of LPU YouthVibe. Teams battle across 48 hours for ₹2,00,000 in prizes and industry hiring fast-tracks.',
    date: new Date('2027-01-22T10:00:00Z'),
    location: 'Baldev Raj Mittal Unipolis',
    price: 199,
    interestNames: ['Artificial Intelligence', 'Web Development', 'Robotics', 'Gaming'],
  },

  // ── Mid-Level & Departmental Competitions ──
  {
    id: 'seed-event-auroracode',
    title: 'Aurora Codefest 2026: Algorithmic & Sprint Clash',
    description:
      'Intense algorithmic problem-solving and speed coding showdown. Dynamic programming, graph algorithms, and system design challenges.',
    date: new Date('2026-11-18T14:00:00Z'),
    location: 'Central Computing Lab 4, Block 14',
    price: 0,
    interestNames: ['Competitive Programming', 'Data Science', 'Open Source'],
  },
  {
    id: 'seed-event-robowars',
    title: 'RoboWars & Autonomous Combat Arena',
    description:
      'Combat bot showdown and autonomous line-follower obstacle race hosted by RISC. Weight categories: 5kg featherweight and autonomous line bots.',
    date: new Date('2026-11-28T11:00:00Z'),
    location: 'Innovation Studio & Combat Arena, Block 36',
    price: 99,
    interestNames: ['Robotics', 'Fitness & Health'],
  },
  {
    id: 'seed-event-kaggle',
    title: 'Kaggle Campus Cup: Predictive ML Datathon',
    description:
      'Analyze complex campus datasets to engineer predictive student placement models and computer vision pipelines. Mentored by data scientists.',
    date: new Date('2026-12-06T10:00:00Z'),
    location: 'Data Analytics Wing, Block 32',
    price: 149,
    interestNames: ['Data Science', 'Machine Learning', 'Artificial Intelligence'],
  },
  {
    id: 'seed-event-innovatex',
    title: 'InnovateX 2026: Campus Startup Pitch Gala',
    description:
      'LPU student founders pitch pre-seed ideas to Punjab Angel Network investors and alumni founders. Seed grant pool of ₹1,00,000.',
    date: new Date('2026-12-16T15:30:00Z'),
    location: 'Mittal School of Business (Block 14 Auditorium)',
    price: 0,
    interestNames: ['Startups', 'Entrepreneurship', 'Finance & Investing'],
  },

  // ── Grassroots & Low-Level Departmental Mini-Events (Weekly/Monthly) ──
  {
    id: 'seed-event-novicehack',
    title: 'Novice 12-Hour Overnight Mini-Hack',
    description:
      'Beginner-friendly overnight coding sprint organized by Coding Ninjas & GFG LPU for 1st & 2nd years to ship their first working CRUD web app.',
    date: new Date('2026-10-26T18:00:00Z'),
    location: 'Lab 5, Block 34 (SCSE)',
    price: 0,
    interestNames: ['Web Development', 'Open Source', 'UI/UX'],
  },
  {
    id: 'seed-event-speedcode',
    title: '2-Hour LeetCode Speed-Coding Sprint',
    description:
      'Fast-paced bi-weekly contest by Coding Blocks LPU. 4 DSA problems in 120 minutes with live campus leaderboard and swag vouchers.',
    date: new Date('2026-10-30T17:00:00Z'),
    location: 'Computing Lab 2, Block 14',
    price: 0,
    interestNames: ['Competitive Programming', 'Open Source'],
  },
  {
    id: 'seed-event-designsprint',
    title: '24-Hour UI/UX Campus Design Sprint',
    description:
      'Non-code design sprint by Designers Den. Redesign campus transit, hostel laundry, and food ordering experiences in Figma with component systems.',
    date: new Date('2026-11-08T11:00:00Z'),
    location: 'Design Studio A, Block 12',
    price: 0,
    interestNames: ['Design', 'UI/UX', 'Content Creation'],
  },
  {
    id: 'seed-event-nukkadnatak',
    title: 'Nukkad Natak Street Play Festival',
    description:
      'High-voltage street theatre showcase by Natya Manch outside Uni Mall. 8 departmental teams perform socially charged musical street plays.',
    date: new Date('2026-11-12T16:00:00Z'),
    location: 'Uni Mall Lawn & Plaza (Block 38)',
    price: 0,
    interestNames: ['Theatre & Drama', 'Social Welfare', 'Content Creation'],
  },
  {
    id: 'seed-event-photowalk',
    title: 'Golden Hour Photo Walk & Reel Contest',
    description:
      'Guided campus photography tour by Shutterbugs LPU focusing on golden-hour architectural framing, candid portraits, and 30-second reels.',
    date: new Date('2026-11-20T15:30:00Z'),
    location: 'Uni-Lake, Main Campus Plaza',
    price: 0,
    interestNames: ['Photography', 'Content Creation', 'Design'],
  },
  {
    id: 'seed-event-esportsderby',
    title: 'Campus LAN Valorant & BGMI Derby',
    description:
      'Inter-hostel gaming clash organized by LPU Esports Guild. 16 teams compete on low-latency LAN rigs with spectator commentary.',
    date: new Date('2026-11-25T13:00:00Z'),
    location: 'Esports Gaming Lounge, Block 34',
    price: 149,
    interestNames: ['Gaming', 'Content Creation', 'Design'],
  },
  {
    id: 'seed-event-admad',
    title: 'Case Study & Ad-Mad Satire Commercial Showdown',
    description:
      'Mittal School of Business marketing clash. Teams create 90-second satirical commercials and tackle a live brand PR crisis.',
    date: new Date('2026-12-04T14:30:00Z'),
    location: 'Seminar Hall 2, Block 14 (MSB)',
    price: 0,
    interestNames: ['Startups', 'Content Creation', 'Public Speaking'],
  },
  {
    id: 'seed-event-unplugged',
    title: 'Campus Acoustic Unplugged & Open Mic',
    description:
      'Open-air musical evening by IQLIPSE. Acoustic guitars, beatboxers, indie vocalists, and student bands under the night lights.',
    date: new Date('2026-12-10T18:00:00Z'),
    location: 'Amphitheatre Central Green (Unipolis)',
    price: 0,
    interestNames: ['Music', 'Content Creation'],
  },
  {
    id: 'seed-event-treeplantation',
    title: 'Green Campus Cleanliness & Tree Plantation Drive',
    description:
      'Volunteer morning with Sankalp Club planting 300 saplings across LPU green belts and hosting an e-waste awareness session.',
    date: new Date('2026-12-18T08:30:00Z'),
    location: 'Block 13 Lawns & Central Gardens',
    price: 0,
    interestNames: ['Environmental Initiatives', 'Social Welfare'],
  },
  {
    id: 'seed-event-parldebate',
    title: 'Asian Parliamentary Debate Round: AI & Ethics',
    description:
      'Elite oratory clash hosted by LPU Debating Union in parliamentary style. Motions on autonomous AI copyright, privacy, and campus free speech.',
    date: new Date('2026-12-24T14:00:00Z'),
    location: 'Senate Chambers, Block 1',
    price: 0,
    interestNames: ['Debate', 'Public Speaking', 'Artificial Intelligence'],
  },
];

const SEED_STUDENTS = [
  {
    id: 'seed-student-1',
    name: 'Rahul Sharma',
    username: 'rahul_dev',
    email: 'rahul.sharma@lpu.in',
    department: 'School of Computer Science & Engineering (Block 34)',
    yearOfStudy: 3,
    bio: 'Full-stack TypeScript dev building agentic tooling. Competing in SIH 2026 and Coding Blocks mini-hacks.',
    interestNames: ['Artificial Intelligence', 'Web Development', 'Open Source', 'Competitive Programming'],
  },
  {
    id: 'seed-student-2',
    name: 'Ananya Singh',
    username: 'ananya_design',
    email: 'ananya.singh@lpu.in',
    department: 'School of Design (Block 12)',
    yearOfStudy: 2,
    bio: 'Product designer in Designers Den. Passionate about Figma systems, campus UX, and clean visual identity.',
    interestNames: ['Design', 'UI/UX', 'Content Creation', 'Startups'],
  },
  {
    id: 'seed-student-3',
    name: 'Dev Kapoor',
    username: 'dev_kapoor',
    email: 'dev.kapoor@lpu.in',
    department: 'School of Computer Science & Engineering (Block 34)',
    yearOfStudy: 3,
    bio: 'Coding Ninjas student chapter lead. Building Flutter and React Native cross-platform apps.',
    interestNames: ['Web Development', 'App Development', 'Open Source'],
  },
  {
    id: 'seed-student-4',
    name: 'Priya Verma',
    username: 'priya_ai',
    email: 'priya.verma@lpu.in',
    department: 'School of Computer Applications (Block 34)',
    yearOfStudy: 3,
    bio: 'Fine-tuning open source LLMs and building retrieval agents. Seeking data science hackathon partners.',
    interestNames: ['Artificial Intelligence', 'Machine Learning', 'Data Science'],
  },
  {
    id: 'seed-student-5',
    name: 'Rohan Mehta',
    username: 'rohan_mehta',
    email: 'rohan.mehta@lpu.in',
    department: 'Mittal School of Business (Block 14)',
    yearOfStudy: 4,
    bio: 'E-Cell & Griffin member. Building a student micro-SaaS incubator. Looking for technical co-founders.',
    interestNames: ['Startups', 'Entrepreneurship', 'Finance & Investing'],
  },
  {
    id: 'seed-student-6',
    name: 'Sneha Reddy',
    username: 'sneha_robotics',
    email: 'sneha.reddy@lpu.in',
    department: 'School of Electronics & Electrical Engineering (Block 28)',
    yearOfStudy: 2,
    bio: 'RISC robotics developer. Embedded C, ROS2 navigation, and autonomous rover sensor telemetry.',
    interestNames: ['Robotics', 'Artificial Intelligence', 'Machine Learning'],
  },
  {
    id: 'seed-student-7',
    name: 'Aarav Patel',
    username: 'aarav_coder',
    email: 'aarav.patel@lpu.in',
    department: 'School of Computer Science & Engineering (Block 34)',
    yearOfStudy: 2,
    bio: 'Competitive programmer (Candidate Master on CF). Looking for ICPC squad mates for CodeChef LPU.',
    interestNames: ['Competitive Programming', 'Data Science', 'Open Source'],
  },
  {
    id: 'seed-student-8',
    name: 'Tanvi Joshi',
    username: 'tanvi_joshi',
    email: 'tanvi.joshi@lpu.in',
    department: 'School of Journalism & Film Production (Block 25)',
    yearOfStudy: 3,
    bio: 'Shutterbugs cinematography lead. Directing campus visual stories and cinematic YouTube docuseries.',
    interestNames: ['Photography', 'Content Creation', 'Design'],
  },
  {
    id: 'seed-student-9',
    name: 'Manpreet Singh',
    username: 'manpreet_theatre',
    email: 'manpreet.singh@lpu.in',
    department: 'Division of Student Welfare (Block 13)',
    yearOfStudy: 3,
    bio: 'Natya Manch director. Writing socially impactful Nukkad Natak scripts and street performance music.',
    interestNames: ['Theatre & Drama', 'Content Creation', 'Public Speaking'],
  },
  {
    id: 'seed-student-10',
    name: 'Harsh Gupta',
    username: 'harsh_fintech',
    email: 'harsh.gupta@lpu.in',
    department: 'Mittal School of Business (Block 14)',
    yearOfStudy: 2,
    bio: 'Finix finance society member. Quantitative trading models, crypto security, and campus fintech.',
    interestNames: ['Finance & Investing', 'Startups', 'Data Science'],
  },
];

async function main() {
  console.log('🌱 Seeding authentic LPU campus interests...');

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

  // Ensure DSW central organizer user exists
  console.log('🌱 Seeding LPU Division of Student Welfare (DSW) organizer...');
  const organizer = await prisma.user.upsert({
    where: { email: 'organizer@campusly.internal' },
    update: {
      name: 'LPU Division of Student Welfare (DSW)',
      department: 'Division of Student Welfare, Block 13',
    },
    create: {
      id: 'seed-organizer-user',
      name: 'LPU Division of Student Welfare (DSW)',
      email: 'organizer@campusly.internal',
      department: 'Division of Student Welfare, Block 13',
      yearOfStudy: 4,
      emailVerified: true,
    },
  });

  // Seed authentic LPU events across all tiers
  console.log(`🌱 Seeding ${SEED_EVENTS.length} authentic LPU events (flagship to departmental)...`);
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
  console.log(`✅ Successfully seeded ${SEED_EVENTS.length} authentic LPU events!`);

  // Seed authentic LPU clubs across all categories
  console.log(`🌱 Seeding ${SEED_CLUBS.length} authentic LPU clubs across all domains...`);
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
  console.log(`✅ Successfully seeded ${SEED_CLUBS.length} authentic LPU clubs!`);

  // Seed authentic LPU student profiles
  console.log('🌱 Seeding authentic LPU student profiles...');
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
  console.log(`✅ Successfully seeded ${SEED_STUDENTS.length} authentic LPU student profiles!`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
