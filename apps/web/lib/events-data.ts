/**
 * Centralized LPU Campus Events Registry
 * Contains authentic Lovely Professional University (LPU) events with campus venues,
 * dates, hosts, prize pools, and detailed schedules.
 */

export interface EventScheduleItem {
  time: string;
  title: string;
  description: string;
}

export interface EventMentor {
  name: string;
  role: string;
  avatarSlug: string;
}

export interface CampusEvent {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: "Hackathon" | "Tech & AI" | "Robotics" | "Design" | "Fest & Culture";
  categoryBadge: string;
  date: string;
  time: string;
  monthDay: { month: string; day: string };
  venue: string;
  venueLandmark: string;
  venueDirections: string;
  host: string;
  hostSlug?: string;
  entryFee: string;
  isFree: boolean;
  prizePool: string;
  spotsTotal: number;
  spotsRemaining: number;
  registrationDeadline: string;
  gradient: string;
  accentColor: string;
  about: string;
  whatToExpect: {
    icon: string;
    title: string;
    description: string;
  }[];
  schedule: EventScheduleItem[];
  rules: string[];
  tags: string[];
  mentors: EventMentor[];
}

export const LPU_EVENTS: Record<string, CampusEvent> = {
  "genai-hackathon": {
    id: "genai-hackathon",
    slug: "genai-hackathon",
    title: "GenAI Hackathon 2026",
    subtitle: "Build. Compete. Ship Production-Grade AI Agents.",
    category: "Hackathon",
    categoryBadge: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
    date: "18–20 October 2026",
    time: "6:00 PM – 48 Hours Non-Stop",
    monthDay: { month: "OCT", day: "18" },
    venue: "Block 32 · School of CSE",
    venueLandmark: "Innovation Wing, 4th Floor Computing Labs",
    venueDirections: "Enter through Gate 2, head to Block 32 central elevator, 4th Floor AI Research Center.",
    host: "Coding Blocks & AI Society",
    hostSlug: "ai-robotics-society",
    entryFee: "₹249",
    isFree: false,
    prizePool: "₹50,000 in Prizes",
    spotsTotal: 120,
    spotsRemaining: 18,
    registrationDeadline: "Closes Oct 16 at 11:59 PM",
    gradient: "from-blue-950 via-indigo-950 to-slate-950 border-blue-800/40",
    accentColor: "blue",
    about:
      "Join the premier 48-hour student generative AI sprint at LPU. Build innovative applications using large language models, agentic frameworks, multi-modal pipelines, and low-latency APIs. Compete with top developers, present live before industry judges, and win grant funding.",
    whatToExpect: [
      {
        icon: "⚡",
        title: "48-Hour Sprint",
        description: "Teams of 2–4 builders. Solo participants can find peers directly through Campusly.",
      },
      {
        icon: "🤝",
        title: "Mentorship & Cluster Access",
        description: "Hands-on guidance from senior research leads with dedicated cloud GPU compute.",
      },
      {
        icon: "🏆",
        title: "Live Pitches & Cash Pool",
        description: "Pitch live on stage to tech leads and seed investors with ₹50,000 in direct prizes.",
      },
    ],
    schedule: [
      { time: "Day 1 · 6:00 PM", title: "Kickoff & Problem Statements", description: "Keynote address, API credentials handout, and challenge release." },
      { time: "Day 2 · 11:00 AM", title: "Mentor Checkpoint 1", description: "Architecture teardown and live model latency optimization." },
      { time: "Day 2 · 8:00 PM", title: "Midnight Pitch Rehearsals", description: "Quick 2-minute prototype demos with club tech leads." },
      { time: "Day 3 · 4:00 PM", title: "Final Demos & Award Ceremony", description: "Top 8 finalists pitch live on stage at Block 32 Auditorium." },
    ],
    rules: [
      "Teams can have 2 to 4 members (solo participants are paired during kickoff).",
      "All code must be committed to public GitHub repositories created after kickoff.",
      "Pre-trained open weights and public APIs (OpenAI, Claude, Groq, Ollama) are fully allowed.",
      "College student ID is mandatory at physical check-in.",
    ],
    tags: ["LLMs", "FastAPI", "Next.js", "PyTorch", "Autonomous Agents"],
    mentors: [
      { name: "Rahul Sharma", role: "AI & Backend Lead", avatarSlug: "rahul-sharma" },
      { name: "Priya Verma", role: "ML Researcher @ AI Society", avatarSlug: "priya-verma" },
    ],
  },

  "innovatex-sprint": {
    id: "innovatex-sprint",
    slug: "innovatex-sprint",
    title: "InnovateX 48h Campus Sprint",
    subtitle: "The Flagship Collegiate Hackathon of LPU School of CSE.",
    category: "Hackathon",
    categoryBadge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    date: "25–27 October 2026",
    time: "10:00 AM Onwards",
    monthDay: { month: "OCT", day: "25" },
    venue: "Shanti Devi Mittal Auditorium",
    venueLandmark: "Main Stage & Multi-Tier Arena",
    venueDirections: "Central university boulevard, next to the administration plaza.",
    host: "School of Computer Science & Engineering",
    entryFee: "Free",
    isFree: true,
    prizePool: "₹1,00,000 Incubation Grant",
    spotsTotal: 250,
    spotsRemaining: 34,
    registrationDeadline: "Closes Oct 23 at 6:00 PM",
    gradient: "from-emerald-950 via-teal-950 to-slate-950 border-emerald-800/40",
    accentColor: "emerald",
    about:
      "InnovateX is LPU's flagship engineering hackathon bringing together over 250+ student developers, designers, and innovators under one roof. Work across 4 tracks: Smart Campus Infrastructure, Healthcare & BioTech, FinTech & Web3, and Open Student Innovation.",
    whatToExpect: [
      {
        icon: "💡",
        title: "Campus-Wide Impact",
        description: "Winning solutions will be piloted directly on the LPU campus network.",
      },
      {
        icon: "🚀",
        title: "Incubation Grant",
        description: "Top 3 teams secure direct entry into the LPU Startup Accelerator with seed funding.",
      },
      {
        icon: "🍱",
        title: "Full Hospitality & Meals",
        description: "All meals, midnight snacks, RedBull refills, and resting lounges fully covered.",
      },
    ],
    schedule: [
      { time: "Day 1 · 10:00 AM", title: "Opening Ceremony & Keynote", description: "Inauguration by Dean of Engineering and corporate sponsors." },
      { time: "Day 1 · 12:00 PM", title: "Hacking Begins", description: "Track selection and repository initialization." },
      { time: "Day 2 · 3:00 PM", title: "Midway Evaluation", description: "Jury walkthroughs and progress evaluation on campus staging." },
      { time: "Day 3 · 2:00 PM", title: "Grand Finale Showcase", description: "Top 10 teams present to angel investors and university leadership." },
    ],
    rules: [
      "Open to all enrolled students across any year or engineering discipline.",
      "Inter-college and inter-departmental teams are warmly welcomed.",
      "Hardware and software prototypes are both accepted.",
      "Free registration sponsored by LPU Innovation Council.",
    ],
    tags: ["Full-Stack", "Mobile", "Smart Campus", "Startups", "Cloud"],
    mentors: [
      { name: "Dev Kapoor", role: "Systems Lead & Full Stack", avatarSlug: "dev-kapoor" },
      { name: "Ananya Singh", role: "Product Design Lead", avatarSlug: "ananya-singh" },
    ],
  },

  "roboquest-rover": {
    id: "roboquest-rover",
    slug: "roboquest-rover",
    title: "RoboQuest 2026: Autonomous Rover Challenge",
    subtitle: "High-Speed Obstacle Traversal, SLAM, and Bot Arena Battles.",
    category: "Robotics",
    categoryBadge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
    date: "02 November 2026",
    time: "9:00 AM – 6:00 PM",
    monthDay: { month: "NOV", day: "02" },
    venue: "Block 38 · Robotics & Mechatronics Yard",
    venueLandmark: "Ground Floor Indoor Arena & Outdoor Terrain",
    venueDirections: "Located in the engineering workshop cluster between Block 37 and 38.",
    host: "AI & Robotics Society",
    hostSlug: "ai-robotics-society",
    entryFee: "₹199",
    isFree: false,
    prizePool: "₹40,000 + Hardware Kits",
    spotsTotal: 60,
    spotsRemaining: 11,
    registrationDeadline: "Closes Oct 30 at 11:59 PM",
    gradient: "from-purple-950 via-violet-950 to-slate-950 border-purple-800/40",
    accentColor: "purple",
    about:
      "Put your robotic algorithms and embedded hardware to the test. RoboQuest 2026 features two competitive categories: Autonomous Indoor Navigation (ROS2 / LiDAR obstacle avoidance) and Combat Bot Clash (RC lightweight combat).",
    whatToExpect: [
      {
        icon: "🤖",
        title: "Dual Track Arena",
        description: "Choose between autonomous ROS2 navigation obstacle courses or RC combat.",
      },
      {
        icon: "🛠️",
        title: "Lab & Hardware Workbench",
        description: "Full access to soldering benches, 3D printers, and replacement ESCs on-site.",
      },
      {
        icon: "🎖️",
        title: "Cash & Component Kits",
        description: "Winners receive cash prizes plus high-torque brushless motors and Jetson boards.",
      },
    ],
    schedule: [
      { time: "9:00 AM", title: "Bot Scrutineering & Safety Inspection", description: "Weight, dimension, and fail-safe frequency checks." },
      { time: "11:00 AM", title: "Time Trials & SLAM Navigation", description: "Obstacle course speed trials with autonomous obstacle avoidance." },
      { time: "2:30 PM", title: "Combat Elimination Rounds", description: "Head-to-head bot battles in the reinforced steel cage arena." },
      { time: "5:30 PM", title: "Podium & Hardware Awards", description: "Trophies and maker sponsor prizes awarded." },
    ],
    rules: [
      "Maximum bot weight limit: 3.5kg for autonomous rovers, 5.0kg for combat bots.",
      "Flame, chemical, and untethered projectile weapons are strictly prohibited.",
      "Teams can comprise up to 4 students.",
      "Safety goggles must be worn at all times near the arena pit.",
    ],
    tags: ["ROS2", "Robotics", "Arduino", "Computer Vision", "Hardware"],
    mentors: [
      { name: "Priya Verma", role: "AI Society President", avatarSlug: "priya-verma" },
      { name: "Rahul Sharma", role: "Autonomous Systems Lead", avatarSlug: "rahul-sharma" },
    ],
  },

  "designsphere-lpu": {
    id: "designsphere-lpu",
    slug: "designsphere-lpu",
    title: "DesignSphere LPU: 24h UI/UX Jam",
    subtitle: "Crafting High-Contrast Interfaces, Design Tokens, & Micro-Interactions.",
    category: "Design",
    categoryBadge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    date: "08 November 2026",
    time: "11:00 AM – 24 Hours",
    monthDay: { month: "NOV", day: "08" },
    venue: "UniMall Creative Studio (3rd Floor)",
    venueLandmark: "Student Innovation & Co-Working Loft",
    venueDirections: "Take the UniMall central glass elevator to 3rd Floor, Studio B-12.",
    host: "Design & Build Guild",
    hostSlug: "design-guild",
    entryFee: "Free",
    isFree: true,
    prizePool: "₹30,000 + Figma Subscriptions",
    spotsTotal: 80,
    spotsRemaining: 15,
    registrationDeadline: "Closes Nov 06 at 6:00 PM",
    gradient: "from-amber-950 via-orange-950 to-slate-950 border-amber-800/40",
    accentColor: "amber",
    about:
      "DesignSphere is LPU's premier 24-hour design jam bringing together product designers, design engineers, and UX researchers. Prototype mobile and web interfaces addressing real student workflows: campus dining queues, hostel maintenance, and peer study rooms.",
    whatToExpect: [
      {
        icon: "🎨",
        title: "Figma Pro Licenses",
        description: "All participants receive 1-year complimentary Figma Professional licenses.",
      },
      {
        icon: "📱",
        title: "Interactive Prototypes",
        description: "Judging focuses on user journey clarity, accessibility (WCAG), and visual polish.",
      },
      {
        icon: "🌟",
        title: "Portfolio Reviews",
        description: "Direct 1-on-1 design portfolio teardowns by senior industry product leads.",
      },
    ],
    schedule: [
      { time: "11:00 AM", title: "Design Brief & Prompt Release", description: "Unveiling real student pain points and design system constraints." },
      { time: "3:00 PM", title: "Typography & Token Workshop", description: "Crash course on semantic design tokens and micro-interactions." },
      { time: "10:00 PM", title: "Figma Jam Critiques", description: "Informal peer teardowns and design sanity checks over coffee." },
      { time: "Day 2 · 11:00 AM", title: "Showcase & Winner Pitch", description: "Present interactive prototypes on the studio big screen." },
    ],
    rules: [
      "Solo designers or pairs of 2 are welcome.",
      "Work must be designed in Figma with accessible color contrast ratios.",
      "Design token architecture and mobile responsiveness are rewarded.",
    ],
    tags: ["Figma", "UI/UX", "Design Systems", "Prototyping", "Accessibility"],
    mentors: [
      { name: "Ananya Singh", role: "Design Guild President", avatarSlug: "ananya-singh" },
      { name: "Dev Kapoor", role: "Frontend & Design Engineer", avatarSlug: "dev-kapoor" },
    ],
  },

  "spectra-techfest": {
    id: "spectra-techfest",
    slug: "spectra-techfest",
    title: "Spectra 2026: Annual Tech & Culture Summit",
    subtitle: "The Largest Annual Celebration of Technology, Arts & Innovation at LPU.",
    category: "Fest & Culture",
    categoryBadge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
    date: "14–16 November 2026",
    time: "Full Day Campus Celebration",
    monthDay: { month: "NOV", day: "14" },
    venue: "Baldev Raj Mittal Unipolis",
    venueLandmark: "Grand Open Amphitheatre & Exhibition Grounds",
    venueDirections: "Central university plaza next to UniMall and the sports stadium.",
    host: "Student Welfare Wing & Campusly",
    entryFee: "Free",
    isFree: true,
    prizePool: "Trophies & Verified Certificates",
    spotsTotal: 1200,
    spotsRemaining: 180,
    registrationDeadline: "Closes Nov 12 at 11:59 PM",
    gradient: "from-rose-950 via-purple-950 to-slate-950 border-rose-800/40",
    accentColor: "rose",
    about:
      "Spectra is the university's flagship multi-day techno-cultural summit. Bringing together over 5,000+ attendees across Punjab, Spectra features founder keynotes, student project exhibitions, LAN gaming tournaments, laser light shows, and club networking pavilions.",
    whatToExpect: [
      {
        icon: "🎤",
        title: "Tech Founder Keynotes",
        description: "Listen to inspiring talks from collegiate founders, YC alumni, and AI researchers.",
      },
      {
        icon: "🎮",
        title: "Collegiate Esports Arena",
        description: "LAN tournaments featuring Valorant, BGMI, and FIFA on the Unipolis mega screens.",
      },
      {
        icon: "🎪",
        title: "Club Project Exhibition",
        description: "Over 40+ campus clubs showcase their best autonomous bots, drones, and web apps.",
      },
    ],
    schedule: [
      { time: "Day 1 · 10:00 AM", title: "Grand Inauguration Parade", description: "Opening march with university dignitaries and club crest displays." },
      { time: "Day 1 · 2:00 PM", title: "Project Expo & Startup Pavilions", description: "Over 80+ student inventions on display for visitors." },
      { time: "Day 2 · 1:00 PM", title: "Esports Finals & Live Coding Battles", description: "Speed coding competitions and gaming brackets." },
      { time: "Day 3 · 6:00 PM", title: "Celebrity Evening & Awards", description: "Prize distribution and celebration night at Unipolis." },
    ],
    rules: [
      "All registered students receive free entry pass with barcode for food stalls.",
      "External university students must present valid college ID at the registration desk.",
      "Event registration guarantees priority seating at the keynote sessions.",
    ],
    tags: ["Campus Fest", "Keynotes", "Esports", "Exhibition", "Networking"],
    mentors: [
      { name: "Rahul Sharma", role: "Campus Student Lead", avatarSlug: "rahul-sharma" },
      { name: "Ananya Singh", role: "Creative Director", avatarSlug: "ananya-singh" },
      { name: "Priya Verma", role: "Tech Expo Coordinator", avatarSlug: "priya-verma" },
    ],
  },
};

export const LPU_EVENTS_LIST: CampusEvent[] = Object.values(LPU_EVENTS);

const EVENT_ID_ALIASES: Record<string, string> = {
  "seed-event-1": "genai-hackathon",
  "seed-event-2": "robotics-challenge",
  "seed-event-3": "design-jam",
  "seed-event-4": "unipolis-fest",
};

export function getEventBySlug(slug: string): CampusEvent {
  const resolved = EVENT_ID_ALIASES[slug] || slug;
  const found = LPU_EVENTS[resolved];
  if (found) return found;
  return LPU_EVENTS["genai-hackathon"] as CampusEvent;
}
