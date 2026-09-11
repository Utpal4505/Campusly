"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AppHeader from "@/components/AppHeader";
import { useCampusStore } from "@/lib/store";
import { getAnimeAvatar } from "@/lib/avatars";
import {
  ArrowLeft,
  Heart,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Sparkles,
  Zap,
  Building2,
  Share2,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Check,
  Trophy,
  BookOpen,
  Code2,
  Radio,
  Clock,
  Send,
  HelpCircle,
  Copy,
  ChevronRight,
} from "lucide-react";

interface LeadershipMember {
  role: string;
  name: string;
  slug: string;
  avatar: string;
  degree: string;
  bio?: string;
}

interface PerkItem {
  icon: string;
  title: string;
  description: string;
}

interface ProjectItem {
  title: string;
  stack: string[];
  status: string;
  description: string;
}

interface DomainTrack {
  id: string;
  name: string;
  description: string;
  openSpots: number;
}

interface ClubData {
  name: string;
  badge: string;
  category: string;
  tagline: string;
  membersCount: number;
  meetingTime: string;
  meetingDay: string;
  meetingHour: string;
  meetingVenue: string;
  venueDirections: string;
  recruitingStatus: string;
  spotsRemaining: number;
  applicationDeadline: string;
  about: string;
  mission: string;
  iconEmoji: string;
  accentColor: string;
  gradient: string;
  nextSession: {
    title: string;
    topic: string;
    date: string;
    time: string;
    location: string;
  };
  leadership: LeadershipMember[];
  perks: PerkItem[];
  projects: ProjectItem[];
  domainTracks: DomainTrack[];
  faqs: { question: string; answer: string }[];
  community: {
    discordMembers: number;
    githubRepos: number;
    portalLink: string;
  };
}

const clubsData: Record<string, ClubData> = {
  "ai-robotics-society": {
    name: "AI & Robotics Society",
    badge: "Official Campus Student Organization",
    category: "Artificial Intelligence · Robotics · Machine Learning",
    tagline: "Advancing machine learning research, agentic architectures, and hardware autonomy on campus.",
    membersCount: 142,
    meetingTime: "Every Thursday · 6:00 PM – 7:30 PM",
    meetingDay: "Every Thursday",
    meetingHour: "6:00 PM",
    meetingVenue: "CS Hall 3 · Innovation Wing",
    venueDirections: "Take the east stairs to 3rd floor, Room 304 (next to Advanced Robotics Lab).",
    recruitingStatus: "Fall Cohort Open",
    spotsRemaining: 12,
    applicationDeadline: "Closes this Sunday at 11:59 PM",
    about:
      "The AI & Robotics Society is the premier student-led research and engineering community on campus. We host weekly research paper teardowns, provide members with access to dedicated high-performance GPU compute clusters, organize competitive campus hackathon squads, and engineer autonomous robotics prototypes for national collegiate competitions.",
    mission:
      "To empower campus builders with practical, production-level AI and robotics skills before graduation.",
    iconEmoji: "🤖",
    accentColor: "purple",
    gradient: "from-purple-950 via-indigo-950 to-slate-950 border-purple-800/40",
    nextSession: {
      title: "Lab Night & Research Teardown",
      topic: "Building Multi-Agent Workflows with LangGraph & Local LLMs",
      date: "Thu, Oct 22",
      time: "6:00 PM – 7:30 PM",
      location: "CS Hall 3, Room 304",
    },
    leadership: [
      {
        role: "President",
        name: "Priya Verma",
        slug: "priya-verma",
        avatar: "PV",
        degree: "Data Science & AI · 3rd Year",
        bio: "Previously built multi-modal vision systems; researching LLM reasoning efficiency.",
      },
      {
        role: "Technical Lead",
        name: "Rahul Sharma",
        slug: "rahul-sharma",
        avatar: "RS",
        degree: "CSE · 2nd Year",
        bio: "Building autonomous research agents. Manages club GPU clusters and open-source repos.",
      },
    ],
    perks: [
      {
        icon: "⚡",
        title: "Dedicated GPU Cluster Access",
        description: "Reserved A100/H100 cloud nodes for training deep learning models, fine-tuning, and research experiments.",
      },
      {
        icon: "📚",
        title: "Weekly Paper Reading Groups",
        description: "Interactive teardowns breaking down breakthrough NeurIPS, ICML, and CVPR publications.",
      },
      {
        icon: "🏆",
        title: "Sponsored Hackathon Squads",
        description: "Full travel stipends, registration coverage, and hardware kits for premier national hackathons.",
      },
      {
        icon: "🤝",
        title: "Alumni & Research Lab Mentorship",
        description: "Direct 1-on-1 career and research guidance from alumni now at Google DeepMind, OpenAI, and Meta.",
      },
    ],
    projects: [
      {
        title: "Autonomous Rover Navigation",
        stack: ["ROS2", "OpenCV", "LiDAR", "C++"],
        status: "Seeking 2 Hardware Testers",
        description: "Indoor SLAM and obstacle avoidance robot designed for campus package delivery navigation.",
      },
      {
        title: "Campus LLM Academic Advisor",
        stack: ["FastAPI", "LangChain", "Next.js", "ChromaDB"],
        status: "Active Alpha Testing",
        description: "Open-source conversational assistant indexing university syllabi, degree roadmaps, and prerequisites.",
      },
      {
        title: "Low-Power Vision Edge Sensor",
        stack: ["TinyML", "ESP32-S3", "PyTorch"],
        status: "Prototyping",
        description: "Edge vision module detecting real-time library occupancy without recording identifiable video data.",
      },
    ],
    domainTracks: [
      {
        id: "ml-agents",
        name: "Machine Learning & Autonomous Agents",
        description: "Fine-tuning open models, agentic workflows (LangGraph), and prompt evaluation pipelines.",
        openSpots: 5,
      },
      {
        id: "robotics-hw",
        name: "Robotics Core & Embedded Systems",
        description: "Hands-on ROS2 navigation, motor drivers, sensor fusion, and 3D enclosure CAD fabrication.",
        openSpots: 3,
      },
      {
        id: "fullstack-ai",
        name: "Full-Stack AI Application Engineering",
        description: "Building production interfaces, Next.js web portals, and low-latency Python backend APIs.",
        openSpots: 4,
      },
    ],
    faqs: [
      {
        question: "Do I need previous AI or robotics experience to join?",
        answer: "Not at all! We accept students at all skill levels. For beginners, we have guided onboarding lab sessions and senior student mentors to help you build your first project.",
      },
      {
        question: "What is the weekly time commitment?",
        answer: "General members spend ~2–3 hours per week (1 hour for the weekly Thursday session + 1–2 hours collaborating on lab projects).",
      },
      {
        question: "Are club memberships free?",
        answer: "Yes, 100% free. All computing resources, hardware kits, and workshop materials are fully sponsored by our campus departmental fund.",
      },
    ],
    community: {
      discordMembers: 185,
      githubRepos: 14,
      portalLink: "https://campusly.edu/clubs/ai-robotics",
    },
  },
  "design-guild": {
    name: "Design & Build Guild",
    badge: "Official Campus Student Organization",
    category: "Product Design · UI/UX · Creative Tech",
    tagline: "Uniting designers, design engineers, and creative builders to craft intuitive student products.",
    membersCount: 98,
    meetingTime: "Every Tuesday · 5:30 PM – 7:00 PM",
    meetingDay: "Every Tuesday",
    meetingHour: "5:30 PM",
    meetingVenue: "Design Studio B · Art & Media Hub",
    venueDirections: "Ground floor, south corridor of Art & Media building next to the 3D Print Lab.",
    recruitingStatus: "Fall Cohort Open",
    spotsRemaining: 8,
    applicationDeadline: "Closes this Sunday at 11:59 PM",
    about:
      "Design & Build Guild bridges the gap between aesthetic product design and production frontend engineering. Members participate in weekly Figma design system critiques, collaborate directly with engineering teams on hackathon prototypes, and learn modern web typography, design tokens, and micro-interactions.",
    mission:
      "To cultivate world-class product designers and design engineers through real campus software launches.",
    iconEmoji: "🎨",
    accentColor: "amber",
    gradient: "from-amber-950 via-orange-950 to-slate-950 border-amber-800/40",
    nextSession: {
      title: "Design System Studio Lab",
      topic: "Figma Variables, Token Syncing, and Tailwind CSS Bridges",
      date: "Tue, Oct 20",
      time: "5:30 PM – 7:00 PM",
      location: "Design Studio B",
    },
    leadership: [
      {
        role: "President",
        name: "Ananya Singh",
        slug: "ananya-singh",
        avatar: "AS",
        degree: "Design & CS · 3rd Year",
        bio: "Specializes in interaction design, mobile accessibility, and typographic hierarchy.",
      },
      {
        role: "Systems Lead",
        name: "Dev Kapoor",
        slug: "dev-kapoor",
        avatar: "DK",
        degree: "Software Engineering · 2nd Year",
        bio: "Passionate about bridging Figma component libraries with React and Tailwind code.",
      },
    ],
    perks: [
      {
        icon: "🎨",
        title: "Figma Enterprise Campus License",
        description: "Full access to shared team libraries, premium prototyping tokens, and plugin workspaces.",
      },
      {
        icon: "🚀",
        title: "Campus Startup Pairing",
        description: "Direct matchmaking with campus technical founders who need product UI/UX and design engineering.",
      },
      {
        icon: "💼",
        title: "Bi-Weekly Portfolio Reviews",
        description: "1-on-1 critique sessions with senior product designers working at top tech firms.",
      },
      {
        icon: "✨",
        title: "Interactive Web & Motion Sprints",
        description: "Hands-on tutorials in Framer Motion, Tailwind CSS, and web micro-interactions.",
      },
    ],
    projects: [
      {
        title: "Campusly Universal Design System",
        stack: ["Figma", "Tailwind CSS", "Radix UI"],
        status: "Active V2 Component Release",
        description: "Unified component library and design tokens powering student-built campus applications.",
      },
      {
        title: "Student Dining Experience App",
        stack: ["React Native", "Figma", "User Research"],
        status: "User Testing Phase",
        description: "Mobile prototype reducing campus dining hall wait times with live crowd estimations.",
      },
      {
        title: "Interactive Campus Accessibility Map",
        stack: ["Mapbox", "SVG Animations", "WCAG 2.1"],
        status: "Seeking 1 Visual Designer",
        description: "Wheelchair-accessible route navigation and building entrance ramps visual guide.",
      },
    ],
    domainTracks: [
      {
        id: "ui-ux",
        name: "UI/UX & Product Design",
        description: "User research, wireframing, high-fidelity Figma components, and usability testing.",
        openSpots: 4,
      },
      {
        id: "design-eng",
        name: "Design Engineering & Frontend",
        description: "Translating Figma designs into accessible React, Tailwind CSS, and CSS animations.",
        openSpots: 4,
      },
    ],
    faqs: [
      {
        question: "Do I need to be a design major to join?",
        answer: "No! Many of our active members are Computer Science, Business, or Cognitive Science majors who love product design.",
      },
      {
        question: "Do I need a portfolio to apply?",
        answer: "No prior portfolio is required for general membership. If you have any projects or sketches, you can link them, but enthusiasm to learn is what counts.",
      },
      {
        question: "What tools will I learn?",
        answer: "You will master Figma, FigJam, Tailwind CSS, Framer Motion, and modern design handoff workflows.",
      },
    ],
    community: {
      discordMembers: 130,
      githubRepos: 8,
      portalLink: "https://campusly.edu/clubs/design-guild",
    },
  },
};

export default function ClubDetailPage() {
  const params = useParams();
  const rawSlug = (params?.slug as string) || "ai-robotics-society";
  const slug = rawSlug.toLowerCase();

  const { userName } = useCampusStore();

  const club: ClubData = clubsData[slug] || {
    name: rawSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    badge: "Official Campus Student Organization",
    category: "Technology · Innovation · Community",
    tagline: "Student organization empowering builders, creators, and community leaders.",
    membersCount: 65,
    meetingTime: "Every Wednesday · 5:00 PM – 6:30 PM",
    meetingDay: "Every Wednesday",
    meetingHour: "5:00 PM",
    meetingVenue: "Student Activity Center · Hall A",
    venueDirections: "2nd floor, Student Activity Center, Main Hallway.",
    recruitingStatus: "Recruiting Members",
    spotsRemaining: 10,
    applicationDeadline: "Applications open ongoing",
    about:
      "A student-run campus organization dedicated to peer learning, community projects, and hosting regular workshops for all experience levels.",
    mission: "To foster peer collaboration and hands-on project experience across campus.",
    iconEmoji: "🏛️",
    accentColor: "blue",
    gradient: "from-blue-950 via-indigo-950 to-slate-950 border-blue-800/40",
    nextSession: {
      title: "Weekly Club Workshop",
      topic: "Introduction to Campus Initiatives & Project Teams",
      date: "Wed, Oct 21",
      time: "5:00 PM – 6:30 PM",
      location: "Student Activity Center",
    },
    leadership: [
      {
        role: "Club Lead",
        name: "Campus Leader",
        slug: "rahul-sharma",
        avatar: "CL",
        degree: "Computer Science",
        bio: "Leading campus community projects and student hackathon teams.",
      },
    ],
    perks: [
      {
        icon: "🤝",
        title: "Peer Collaboration",
        description: "Meet passionate peers and work on hands-on team initiatives.",
      },
      {
        icon: "⚡",
        title: "Weekly Workshops",
        description: "Skill-building sessions led by experienced students and seniors.",
      },
    ],
    projects: [
      {
        title: "Campus Community Portal",
        stack: ["Next.js", "Tailwind CSS"],
        status: "Active",
        description: "Building open tools for campus student life and activities.",
      },
    ],
    domainTracks: [
      {
        id: "general",
        name: "General Membership Track",
        description: "Attend weekly workshops, join study groups, and explore projects.",
        openSpots: 10,
      },
    ],
    faqs: [
      {
        question: "Who can join?",
        answer: "Any registered university student in good academic standing is welcome.",
      },
    ],
    community: {
      discordMembers: 75,
      githubRepos: 4,
      portalLink: "https://campusly.edu/clubs",
    },
  };

  // State
  const [isSaved, setIsSaved] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [calendarAdded, setCalendarAdded] = useState(false);
  const [discordJoined, setDiscordJoined] = useState(false);

  // Application form fields
  const [selectedDomain, setSelectedDomain] = useState(club.domainTracks[0]?.id || "general");
  const [experienceLevel, setExperienceLevel] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [studentYear, setStudentYear] = useState("2nd Year");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [statement, setStatement] = useState("");

  const activeTrackObj = club.domainTracks.find((d) => d.id === selectedDomain) || club.domainTracks[0];

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2200);
    }
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplying(false);
    setIsJoined(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AppHeader />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Top Navigation Bar: Breadcrumb + Action Controls */}
        <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-border/50">
          <Link
            href="/feed"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to For You Feed</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="h-8 px-3 rounded-lg border border-border/60 bg-card hover:bg-muted/50 flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Copy share link"
            >
              {shareCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-semibold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsSaved(!isSaved)}
              className={`h-8 px-3 rounded-lg border flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer ${
                isSaved
                  ? "text-red-500 border-red-500/30 bg-red-500/10"
                  : "border-border/60 bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-red-500" : ""}`} />
              <span>{isSaved ? "Saved" : "Save Club"}</span>
            </button>
          </div>
        </div>

        {/* =======================================================================
            MEMBERSHIP SUCCESS STATE (ONBOARDING & DIGITAL PASS)
        ======================================================================= */}
        {isJoined ? (
          <div className="max-w-2xl mx-auto py-8 animate-in zoom-in-95 duration-300">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 mb-2">
                ● Membership Confirmed
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Welcome to {club.name}!
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-md mx-auto">
                You are now an officially registered member of the {club.name} Fall Cohort.
              </p>
            </div>

            {/* Official Digital Membership Card Pass */}
            <div className="rounded-3xl border border-primary/40 bg-gradient-to-br from-card via-card to-primary/[0.04] p-6 sm:p-7 shadow-xl relative overflow-hidden mb-6">
              {/* Background ambient glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />

              {/* Pass Top Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-lg">
                    {club.iconEmoji}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">{club.name}</div>
                    <div className="text-[10px] text-muted-foreground">Official Campus Student Pass</div>
                  </div>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                  ACTIVE MEMBER
                </Badge>
              </div>

              {/* Pass Body Info */}
              <div className="grid sm:grid-cols-2 gap-4 py-5 border-b border-border/60 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block mb-0.5">
                    Member Name
                  </span>
                  <span className="font-bold text-foreground text-sm">{userName || "Campus Student"}</span>
                  <span className="text-[11px] text-muted-foreground block">{studentYear}</span>
                </div>

                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block mb-0.5">
                    Assigned Track
                  </span>
                  <span className="font-bold text-primary text-sm flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    {activeTrackObj?.name || "General Track"}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block mb-0.5">
                    First Orientation Session
                  </span>
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    {club.meetingTime}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block mb-0.5">
                    Meeting Location
                  </span>
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                    {club.meetingVenue}
                  </span>
                </div>
              </div>

              {/* Pass Footer: Member Code & Quick Verification */}
              <div className="pt-4 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">
                    PASS ID: #AIRS-2026-042
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified by Campusly</span>
                </div>
              </div>
            </div>

            {/* Actionable Next Steps */}
            <div className="space-y-3 mb-8">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider px-1">
                Your Next Steps as a Member
              </h3>

              {/* Discord Step */}
              <div className="p-4 rounded-2xl border border-border/70 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-lg shrink-0">
                    💬
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      Join the Club Discord Community
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Meet {club.community.discordMembers}+ members, get lab announcements, and join project channels.
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => setDiscordJoined(true)}
                  className={`rounded-xl text-xs font-semibold shrink-0 cursor-pointer ${
                    discordJoined
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white"
                  }`}
                >
                  {discordJoined ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Joined Discord</span>
                    </>
                  ) : (
                    <>
                      <span>Join Discord Channel</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </>
                  )}
                </Button>
              </div>

              {/* Add to Calendar Step */}
              <div className="p-4 rounded-2xl border border-border/70 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg shrink-0">
                    📅
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">
                      Add First Orientation to Calendar
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      {club.meetingTime} at {club.meetingVenue}.
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCalendarAdded(true)}
                  className="rounded-xl text-xs font-semibold shrink-0 cursor-pointer"
                >
                  {calendarAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">Added to iCal / GCal</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Add to Calendar</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Message Technical Lead Step */}
              {club.leadership[0] && (
                <div className="p-4 rounded-2xl border border-border/70 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-primary/20 overflow-hidden shrink-0 bg-muted/20">
                      <img
                        src={getAnimeAvatar(
                          club.leadership[1]?.slug || club.leadership[0]?.slug,
                          club.leadership[1]?.name || club.leadership[0]?.name
                        )}
                        alt={club.leadership[1]?.name || club.leadership[0]?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">
                        Say Hello to {club.leadership[1]?.name || club.leadership[0]?.name}
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        Ask about lab access, ongoing projects, or introduce yourself.
                      </p>
                    </div>
                  </div>

                  <Link href={`/messages/${club.leadership[1]?.slug || club.leadership[0]?.slug}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl text-xs font-semibold shrink-0 gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Send Direct Message</span>
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/feed" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto rounded-xl px-7 text-xs font-semibold shadow-xs cursor-pointer">
                  Return to For You Feed
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => setIsJoined(false)}
                className="w-full sm:w-auto rounded-xl px-5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Review Club Overview Page
              </Button>
            </div>
          </div>
        ) : (
          /* =======================================================================
              NORMAL CLUB DETAILS (2-COLUMN RESPONSIVE LAYOUT)
          ======================================================================= */
          <div>
            {/* High-Impact Hero Banner */}
            <div
              className={`w-full rounded-3xl bg-gradient-to-br ${club.gradient} p-6 sm:p-8 text-white relative overflow-hidden mb-8 border shadow-lg`}
            >
              {/* Subtle grid pattern background */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[size:20px_20px]" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex items-start gap-4">
                  {/* Visual Emblem Anchor */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl sm:text-4xl shrink-0 shadow-inner">
                    {club.iconEmoji}
                  </div>

                  <div>
                    {/* Top status badges */}
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                        {club.badge}
                      </span>
                      <span className="text-[11px] font-medium text-white/90 bg-black/40 px-2.5 py-0.5 rounded-full backdrop-blur-sm border border-white/10">
                        👥 {club.membersCount} Active Members
                      </span>
                    </div>

                    {/* Club Name */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                      {club.name}
                    </h1>

                    {/* Category */}
                    <div className="text-xs font-mono uppercase tracking-widest text-purple-200/90 mt-1">
                      {club.category}
                    </div>

                    {/* Tagline */}
                    <p className="text-xs sm:text-sm text-white/85 font-medium mt-2 max-w-2xl leading-relaxed">
                      {club.tagline}
                    </p>
                  </div>
                </div>

                {/* Direct CTA on Hero for quick action */}
                <div className="shrink-0 flex sm:flex-col items-end justify-between sm:justify-start gap-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{club.spotsRemaining} spots left</span>
                  </div>
                  <Button
                    onClick={() => setIsApplying(true)}
                    className="rounded-xl px-5 h-9 text-xs font-bold bg-white text-slate-950 hover:bg-white/90 shadow-md cursor-pointer gap-1.5"
                  >
                    <span>Apply to Join</span>
                    <Users className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* 2-Column Responsive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* =================================================================
                  LEFT COLUMN: Main Content & Story (Col span 8 on desktop)
              ================================================================= */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* About & Mission */}
                <section className="p-6 rounded-2xl border border-border/80 bg-card shadow-2xs">
                  <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    <span>About the Society</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed mb-4">
                    {club.about}
                  </p>
                  <div className="p-3.5 rounded-xl bg-primary/[0.04] border border-primary/20 text-xs text-foreground/90 font-medium flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-primary block text-[11px] uppercase tracking-wider mb-0.5">
                        Our Campus Mission
                      </span>
                      <span>{club.mission}</span>
                    </div>
                  </div>
                </section>

                {/* Membership Perks */}
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>What Members Get</span>
                    </h2>
                    <span className="text-xs text-muted-foreground">100% Free for Students</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3.5">
                    {club.perks.map((perk) => (
                      <div
                        key={perk.title}
                        className="p-4 rounded-xl border border-border/70 bg-card shadow-2xs hover:border-primary/40 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <span className="text-xl">{perk.icon}</span>
                          <h3 className="font-bold text-xs sm:text-sm text-foreground">
                            {perk.title}
                          </h3>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {perk.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Active Projects & Lab Initiatives */}
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-primary" />
                      <span>Active Projects & Initiatives</span>
                    </h2>
                    <span className="text-xs text-muted-foreground">Open Source on Campus</span>
                  </div>

                  <div className="space-y-3">
                    {club.projects.map((proj) => (
                      <div
                        key={proj.title}
                        className="p-4 rounded-xl border border-border/70 bg-card shadow-2xs hover:border-primary/40 transition-all group"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <h3 className="font-bold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors">
                            {proj.title}
                          </h3>
                          <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                            ● {proj.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                          {proj.description}
                        </p>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {proj.stack.map((tech) => (
                            <span
                              key={tech}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Upcoming Session / Workshop */}
                <section className="p-5 rounded-2xl border border-primary/30 bg-primary/[0.03] relative overflow-hidden">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 animate-pulse text-primary" />
                      Next Upcoming Session
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      Open to Prospective Members
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-foreground mb-1">
                    {club.nextSession.title}
                  </h3>
                  <p className="text-xs text-foreground/80 font-medium mb-3">
                    “{club.nextSession.topic}”
                  </p>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted-foreground pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span>{club.nextSession.date} · {club.nextSession.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>{club.nextSession.location}</span>
                    </div>
                  </div>
                </section>

                {/* Frequently Asked Questions */}
                <section>
                  <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-muted-foreground" />
                    <span>Frequently Asked Questions</span>
                  </h2>

                  <div className="space-y-2.5">
                    {club.faqs.map((faq, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-border/60 bg-card text-xs shadow-2xs"
                      >
                        <h4 className="font-bold text-foreground mb-1">
                          {faq.question}
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

              </div>

              {/* =================================================================
                  RIGHT SIDEBAR: Logistics, Membership Action & Leadership (Col 4)
              ================================================================= */}
              <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
                
                {/* Primary Membership Action Card */}
                <div className="p-5 rounded-2xl border-2 border-primary/30 bg-card shadow-lg">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {club.recruitingStatus}
                    </span>
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      {club.spotsRemaining} spots left
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground mb-1">
                    Join Fall Cohort 2026
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    {club.applicationDeadline}. No experience prerequisites required for general membership.
                  </p>

                  <Button
                    size="lg"
                    onClick={() => setIsApplying(true)}
                    className="w-full rounded-xl text-xs font-bold shadow-xs gap-2 cursor-pointer h-10 mb-3"
                  >
                    <span>Apply for Membership</span>
                    <Users className="w-4 h-4" />
                  </Button>

                  <div className="text-[11px] text-center text-muted-foreground flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Instant digital pass upon review</span>
                  </div>
                </div>

                {/* Meeting Logistics Card */}
                <div className="p-5 rounded-2xl border border-border/80 bg-card shadow-2xs space-y-3.5">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>Meeting Logistics</span>
                  </h3>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-start gap-2.5">
                      <Calendar className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-foreground block">
                          {club.meetingTime}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          Regular weekly lab night
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-foreground block">
                          {club.meetingVenue}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {club.venueDirections}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Executive Leadership & Direct Message Contact */}
                <div className="p-5 rounded-2xl border border-border/80 bg-card shadow-2xs">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>Executive Leadership</span>
                    <span className="text-[10px] text-muted-foreground font-normal">Active Leads</span>
                  </h3>

                  <div className="space-y-3">
                    {club.leadership.map((leader) => (
                      <div
                        key={leader.slug}
                        className="p-3 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between gap-2 hover:border-primary/40 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Link href={`/people/${leader.slug}`} className="shrink-0">
                            <div className="w-9 h-9 rounded-full overflow-hidden border border-border/70 hover:ring-2 hover:ring-primary/40 transition-all bg-muted/20">
                              <img
                                src={getAnimeAvatar(leader.slug, leader.name)}
                                alt={leader.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </Link>
                          <div className="min-w-0">
                            <Link
                              href={`/people/${leader.slug}`}
                              className="text-xs font-bold text-foreground hover:text-primary transition-colors block truncate"
                            >
                              {leader.name}
                            </Link>
                            <span className="text-[10px] text-muted-foreground block truncate">
                              {leader.role} · {leader.degree}
                            </span>
                          </div>
                        </div>

                        <Link href={`/messages/${leader.slug}`}>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-[11px] font-medium text-primary hover:bg-primary/10 rounded-lg gap-1 cursor-pointer shrink-0"
                            title={`Send direct message to ${leader.name}`}
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>Chat</span>
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Community & Social Links */}
                <div className="p-5 rounded-2xl border border-border/80 bg-card shadow-2xs space-y-3">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Community Channels
                  </h3>

                  <div className="space-y-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setIsApplying(true)}
                      className="w-full p-2.5 rounded-xl border border-border/60 bg-muted/20 hover:bg-accent hover:text-foreground text-muted-foreground flex items-center justify-between transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">💬</span>
                        <span className="font-medium">Club Discord Community</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-semibold">
                        {club.community.discordMembers} members
                      </span>
                    </button>

                    <div className="p-2.5 rounded-xl border border-border/60 bg-muted/20 flex items-center justify-between text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Code2 className="w-3.5 h-3.5 text-foreground" />
                        <span className="font-medium">Open Source GitHub</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-semibold">
                        {club.community.githubRepos} repos
                      </span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* =======================================================================
            ENHANCED APPLICATION MODAL (HIGH CONTEXT & POLISHED)
        ======================================================================= */}
        {isApplying && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-3xl border border-border/80 bg-card text-foreground shadow-2xl p-6 sm:p-7 relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xl shrink-0">
                    {club.iconEmoji}
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold tracking-tight">
                      Apply to {club.name}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Fall Cohort 2026 • {club.spotsRemaining} spots available
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsApplying(false)}
                  className="text-muted-foreground hover:text-foreground text-xs p-1 rounded-lg hover:bg-muted cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleApply} className="space-y-4 text-xs">
                
                {/* 1. Track Selection with Detailed Subtitles */}
                <div>
                  <label className="font-bold text-foreground mb-1.5 block">
                    1. Select Your Interest Track <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[11px] text-muted-foreground mb-2">
                    Pick where you want to focus. You can always contribute across multiple tracks later.
                  </p>
                  <div className="space-y-2">
                    {club.domainTracks.map((track) => {
                      const isSelected = selectedDomain === track.id;
                      return (
                        <button
                          key={track.id}
                          type="button"
                          onClick={() => setSelectedDomain(track.id)}
                          className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between gap-3 ${
                            isSelected
                              ? "border-primary bg-primary/[0.08] ring-1 ring-primary/30"
                              : "border-border/60 bg-muted/20 hover:bg-muted/40 hover:border-border"
                          }`}
                        >
                          <div>
                            <div className="font-bold text-foreground text-xs flex items-center gap-1.5">
                              <span>{track.name}</span>
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">
                                ({track.openSpots} spots)
                              </span>
                            </div>
                            <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                              {track.description}
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-primary stroke-[2.5] shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Experience Level */}
                <div>
                  <label className="font-bold text-foreground mb-1.5 block">
                    2. Your Current Experience Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "beginner", label: "Curious Beginner", hint: "Excited to learn" },
                      { id: "intermediate", label: "Intermediate", hint: "Built small projects" },
                      { id: "advanced", label: "Experienced", hint: "Shipped code / research" },
                    ].map((lvl) => {
                      const isSelected = experienceLevel === lvl.id;
                      return (
                        <button
                          key={lvl.id}
                          type="button"
                          onClick={() => setExperienceLevel(lvl.id as any)}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? "border-primary bg-primary/[0.08] ring-1 ring-primary/30 font-bold text-foreground"
                              : "border-border/60 bg-muted/20 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <div className="text-xs font-semibold">{lvl.label}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{lvl.hint}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Year of Study & Portfolio */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-foreground mb-1 block">
                      Year of Study
                    </label>
                    <select
                      value={studentYear}
                      onChange={(e) => setStudentYear(e.target.value)}
                      className="w-full h-9 px-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground"
                    >
                      <option value="1st Year">1st Year (Freshman)</option>
                      <option value="2nd Year">2nd Year (Sophomore)</option>
                      <option value="3rd Year">3rd Year (Junior)</option>
                      <option value="4th Year">4th Year (Senior)</option>
                      <option value="Graduate">Graduate / Masters</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-foreground mb-1 block">
                      GitHub or Portfolio URL <span className="text-muted-foreground font-normal">(Optional)</span>
                    </label>
                    <input
                      type="url"
                      value={portfolioLink}
                      onChange={(e) => setPortfolioLink(e.target.value)}
                      placeholder="github.com/username"
                      className="w-full h-9 px-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60"
                    />
                  </div>
                </div>

                {/* 4. Short Motivation */}
                <div>
                  <label className="font-bold text-foreground mb-1 block">
                    What are you looking forward to working on?
                  </label>
                  <textarea
                    value={statement}
                    onChange={(e) => setStatement(e.target.value)}
                    placeholder="e.g. Excited to work on autonomous agents, learn PyTorch on the GPU clusters, and compete in the upcoming campus hackathon."
                    rows={2}
                    className="w-full p-2.5 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60 resize-none"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-border/60">
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Free membership</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsApplying(false)}
                      className="rounded-xl text-xs cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      className="rounded-xl px-5 text-xs font-bold shadow-xs gap-1.5 cursor-pointer"
                    >
                      <span>Submit Application</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full py-5 text-center text-xs text-muted-foreground border-t border-border/40 bg-muted/20 mt-12">
        Campusly • Verified University Student Organization Network
      </footer>

    </div>
  );
}
