"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AppHeader from "@/components/AppHeader";
import { getAnimeAvatar } from "@/lib/avatars";
import {
  ArrowLeft,
  MessageSquare,
  UserPlus,
  Check,
  Building2,
  Code2,
  Calendar,
  Sparkles,
  Zap,
  ExternalLink,
  ShieldCheck,
  Globe,
  Award,
  Users,
  CheckCircle2,
  Send,
  X,
} from "lucide-react";

interface ProjectShowcase {
  title: string;
  role: string;
  stack: string[];
  description: string;
  seekingHelp?: string;
}

interface ClubAffiliation {
  name: string;
  role: string;
  slug: string;
  avatar: string;
  badgeColor: string;
}

interface StudentData {
  name: string;
  avatar: string;
  degree: string;
  department: string;
  availability: string;
  about: string;
  interests: string[];
  skills: string[];
  lookingFor: string[];
  projects: ProjectShowcase[];
  affiliations: ClubAffiliation[];
  recentActivity: string[];
  socials: {
    github?: string;
    portfolio?: string;
    linkedin?: string;
  };
}

const students: Record<string, StudentData> = {
  "rahul-sharma": {
    name: "Rahul Sharma",
    avatar: "RS",
    degree: "B.Tech CSE · 2nd Year",
    department: "School of Computer Science & Engineering",
    availability: "Open to GenAI Hackathon Squad",
    about:
      "Building practical systems at the intersection of generative AI, developer tooling, and autonomous agents. Passionate about low-latency APIs and open-source campus engineering.",
    interests: ["Artificial Intelligence", "Backend Engineering", "Open Source", "Startups"],
    skills: ["Python", "FastAPI", "PyTorch", "LangChain", "Next.js", "PostgreSQL", "Docker"],
    lookingFor: ["Frontend / UI partner for GenAI Hackathon", "Research collaborators", "Early-stage founders"],
    projects: [
      {
        title: "AI Resume Analyzer",
        role: "Backend & ML Lead",
        stack: ["FastAPI", "Python", "LangChain", "Next.js"],
        description:
          "Developing an open-source ATS scoring and career advisory assistant for campus placements. Indexed over 100+ vetted engineering syllabi.",
        seekingHelp: "Seeking 1 Frontend / Next.js peer",
      },
      {
        title: "Autonomous Research Agent",
        role: "Lead Developer",
        stack: ["PyTorch", "LangGraph", "Claude API", "ChromaDB"],
        description:
          "Autonomous agent workflow indexing arXiv AI publications, generating audio podcast summaries, and benchmarking reasoning traces.",
      },
    ],
    affiliations: [
      {
        name: "AI & Robotics Society",
        role: "Technical Lead",
        slug: "ai-robotics-society",
        avatar: "🤖",
        badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
      },
    ],
    recentActivity: [
      "Released v0.2 of AI Resume Analyzer on campus GitHub",
      "Organized weekly research reading group on DeepSeek V3",
      "Registered for GenAI Hackathon 2026 (actively seeking frontend peer)",
    ],
    socials: {
      github: "github.com/rahul-sharma",
      portfolio: "rahulsharma.dev",
    },
  },
  "ananya-singh": {
    name: "Ananya Singh",
    avatar: "AS",
    degree: "Design & CS · 3rd Year",
    department: "School of Design & Creative Technologies",
    availability: "Seeking Full-Stack Developer Peer",
    about:
      "Product designer and design engineer focused on high-contrast accessibility, component design systems, and rapid prototype validation for student initiatives.",
    interests: ["UI/UX Design", "Design Systems", "Frontend Engineering", "Startups"],
    skills: ["Figma", "Tailwind CSS", "React", "User Research", "Motion Design", "Design Tokens"],
    lookingFor: ["Full-stack engineers", "Campus startup co-founders"],
    projects: [
      {
        title: "Campusly Universal UI Design System",
        role: "Lead Product Designer",
        stack: ["Figma", "Tailwind CSS", "WCAG 2.1", "React"],
        description:
          "Created a comprehensive, accessible design kit and token architecture powering student-built web prototypes across campus.",
      },
      {
        title: "Student Dining Experience Mobile Prototype",
        role: "Interaction Designer",
        stack: ["Figma", "User Research", "Wireframing"],
        description:
          "User-tested mobile workflow that reduced campus cafeteria queue times by estimating real-time crowd volumes.",
      },
    ],
    affiliations: [
      {
        name: "Design & Build Guild",
        role: "President",
        slug: "design-guild",
        avatar: "🎨",
        badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
      },
    ],
    recentActivity: [
      "Published Campusly v2 design token specifications",
      "Hosted Figma auto-layout and prototyping workshop (45 attendees)",
      "Forming cross-functional team for GenAI Hackathon",
    ],
    socials: {
      github: "github.com/ananya-singh",
      portfolio: "ananyasingh.design",
    },
  },
  "dev-kapoor": {
    name: "Dev Kapoor",
    avatar: "DK",
    degree: "Software Engineering · 2nd Year",
    department: "School of Software Engineering & Mobile Systems",
    availability: "Open to Hackathon Teams",
    about:
      "Full-stack engineer and open-source contributor. Enthusiastic about cross-platform mobile apps, offline-first architectures, and low-latency databases.",
    interests: ["Mobile Dev", "Web Dev", "Open Source", "Developer Tools"],
    skills: ["TypeScript", "React Native", "Flutter", "Node.js", "Supabase", "Git"],
    lookingFor: ["UI/UX designers", "Hackathon squad mates"],
    projects: [
      {
        title: "Campus Timetable PWA",
        role: "Solo Creator",
        stack: ["TypeScript", "PWA", "Tailwind CSS", "IndexedDB"],
        description:
          "Lightweight, offline-first schedule organizer actively used by 450+ campus students daily during exam weeks.",
      },
    ],
    affiliations: [
      {
        name: "Design & Build Guild",
        role: "Systems Lead",
        slug: "design-guild",
        avatar: "🎨",
        badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
      },
    ],
    recentActivity: [
      "Deployed Campus Timetable v1.4 with offline push notifications",
      "Joined Open Source Campus Sprint",
    ],
    socials: {
      github: "github.com/devkapoor",
    },
  },
  "priya-verma": {
    name: "Priya Verma",
    avatar: "PV",
    degree: "Data Science & AI · 3rd Year",
    department: "School of AI & Advanced Computing",
    availability: "Researching Multi-Modal Agents",
    about:
      "Machine learning researcher and student community organizer. Exploring reasoning-efficient LLMs, vision-language models, and academic advisory systems.",
    interests: ["AI Research", "Deep Learning", "PyTorch", "Data Science"],
    skills: ["Python", "PyTorch", "HuggingFace", "FastAPI", "Data Science", "Scikit-Learn"],
    lookingFor: ["ML Engineers", "Research mentors", "Robotics teammates"],
    projects: [
      {
        title: "Campus LLM Academic Advisory Assistant",
        role: "Research Lead",
        stack: ["PyTorch", "FastAPI", "ChromaDB", "Next.js"],
        description:
          "Open-source academic advisor indexing 80+ university degree roadmaps, providing automated prerequisites checking.",
      },
    ],
    affiliations: [
      {
        name: "AI & Robotics Society",
        role: "President",
        slug: "ai-robotics-society",
        avatar: "🤖",
        badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
      },
    ],
    recentActivity: [
      "Presented paper summary on Diffusion Models at weekly AI club night",
      "Mentored 20 freshmen in Python for scientific computing",
    ],
    socials: {
      github: "github.com/priyaverma",
      portfolio: "priyaverma.ai",
    },
  },
};

export default function StudentProfilePage() {
  const params = useParams();
  const rawSlug = (params?.slug as string) || "rahul-sharma";
  const slug = rawSlug.toLowerCase();

  const student: StudentData = students[slug] || {
    name: rawSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    avatar: rawSlug.substring(0, 2).toUpperCase(),
    degree: "Computer Science · 2nd Year",
    department: "School of Computing",
    availability: "Open to Campus Opportunities",
    about: "Student builder passionate about collaborative campus projects and hackathons.",
    interests: ["Technology", "AI", "Development"],
    skills: ["Python", "JavaScript", "React"],
    lookingFor: ["Teammates", "Events"],
    projects: [
      {
        title: "Campus Community Project",
        role: "Core Contributor",
        stack: ["Next.js", "Tailwind CSS"],
        description: "Open source campus utilities and team collaboration experiments.",
      },
    ],
    affiliations: [
      {
        name: "AI & Robotics Society",
        role: "Member",
        slug: "ai-robotics-society",
        avatar: "🤖",
        badgeColor: "bg-purple-500/10 text-purple-600 border-purple-500/30",
      },
    ],
    recentActivity: ["Joined Campusly", "Browsing hackathon opportunities"],
    socials: {
      github: "github.com",
    },
  };

  const [isConnected, setIsConnected] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [inviteProject, setInviteProject] = useState("GenAI Hackathon 2026");
  const [inviteRole, setInviteRole] = useState("Frontend / UI Peer");
  const [inviteNote, setInviteNote] = useState("");

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviteModalOpen(false);
    setInviteSent(true);
    setTimeout(() => setInviteSent(false), 4000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <AppHeader />

      {/* Main Container Aligned to max-w-5xl */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6">
        
        {/* Top Breadcrumb & Feedback Toast */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <Link
            href="/people"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to People</span>
          </Link>

          {inviteSent && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>Squad invitation sent to {student.name}!</span>
            </div>
          )}
        </div>

        {/* =======================================================================
            PROFILE COVER & IDENTITY HERO
        ======================================================================= */}
        <div className="rounded-3xl border border-border/80 bg-card overflow-hidden mb-8 shadow-sm">
          {/* Subtle Ambient Cover Banner */}
          <div className="h-28 sm:h-36 bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 relative p-4 sm:p-6 flex items-start justify-between border-b border-border/50">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-black/40 text-muted-foreground backdrop-blur-md border border-white/10">
              <Building2 className="w-3 h-3 text-primary" />
              <span>{student.department}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{student.availability}</span>
            </div>
          </div>

          {/* Profile Details & Quick CTAs */}
          <div className="px-5 sm:px-7 pb-6 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 sm:-mt-12 mb-4">
              
              {/* Avatar + Main Info */}
              <div className="flex items-end gap-3.5 sm:gap-4">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-card text-foreground font-extrabold text-2xl sm:text-3xl flex items-center justify-center border-4 border-card shadow-md overflow-hidden ring-1 ring-border/80">
                    <img
                      src={getAnimeAvatar(slug, student.name)}
                      alt={student.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <span
                    className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-card"
                    title="Active student on campus"
                  />
                </div>

                <div className="pb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                      {student.name}
                    </h1>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/60">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      Verified Student
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">
                    {student.degree}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                <Button
                  size="sm"
                  onClick={() => setIsInviteModalOpen(true)}
                  className="rounded-xl px-4 text-xs font-semibold gap-1.5 shadow-xs cursor-pointer h-9 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Invite to Team</span>
                </Button>

                <Link href={`/messages/${slug}`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl px-3.5 text-xs font-semibold gap-1.5 cursor-pointer h-9"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message</span>
                  </Button>
                </Link>

                <Button
                  size="sm"
                  variant={isConnected ? "outline" : "secondary"}
                  onClick={() => setIsConnected(!isConnected)}
                  className="rounded-xl px-3 text-xs font-semibold gap-1 cursor-pointer h-9"
                >
                  {isConnected ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Connected</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Connect</span>
                    </>
                  )}
                </Button>
              </div>

            </div>

            {/* Student Bio */}
            <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed max-w-3xl pt-2">
              {student.about}
            </p>
          </div>
        </div>

        {/* =======================================================================
            2-COLUMN RESPONSIVE LAYOUT (PORTFOLIO + SIDEBAR)
        ======================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Proof-of-Work & Projects (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Featured Campus Projects */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider">
                  <Code2 className="w-4 h-4 text-primary" />
                  <span>Featured Campus Projects</span>
                </h2>
                <span className="text-[11px] text-muted-foreground font-medium">
                  {student.projects.length} Active Initiatives
                </span>
              </div>

              <div className="space-y-3.5">
                {student.projects.map((proj) => (
                  <div
                    key={proj.title}
                    className="p-5 rounded-2xl border border-border/80 bg-card shadow-2xs hover:border-primary/40 transition-all group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                          {proj.title}
                        </h3>
                        <span className="text-[11px] text-muted-foreground font-medium">
                          Role: {proj.role}
                        </span>
                      </div>

                      {proj.seekingHelp && (
                        <span className="inline-flex items-center text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0 self-start sm:self-auto">
                          ● {proj.seekingHelp}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-foreground/85 leading-relaxed mb-3.5">
                      {proj.description}
                    </p>

                    <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-border/50">
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

            {/* Campus Leadership & Societies */}
            <section>
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wider mb-3">
                <Building2 className="w-4 h-4 text-primary" />
                <span>Campus Leadership & Clubs</span>
              </h2>

              <div className="grid sm:grid-cols-2 gap-3.5">
                {student.affiliations.map((org) => (
                  <Link
                    key={org.slug}
                    href={`/clubs/${org.slug}`}
                    className="p-4 rounded-2xl border border-border/80 bg-card hover:border-primary/40 hover:shadow-xs transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl shrink-0">
                        {org.avatar}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                          {org.name}
                        </h3>
                        <span className="text-[11px] text-muted-foreground block">
                          {org.role}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-primary font-semibold group-hover:translate-x-0.5 transition-transform shrink-0">
                      View →
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Recent Campus Activity */}
            <section className="p-5 rounded-2xl border border-border/80 bg-card shadow-2xs">
              <h2 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Recent Campus Activity & Milestones</span>
              </h2>
              <ul className="space-y-2.5 text-xs text-muted-foreground">
                {student.recentActivity.map((act, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                    <span className="text-foreground/90 leading-relaxed">{act}</span>
                  </li>
                ))}
              </ul>
            </section>

          </div>

          {/* RIGHT SIDEBAR: Collaboration & Skills (4 cols) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            
            {/* Collaboration Intent Card */}
            <div className="p-5 rounded-2xl border-2 border-primary/30 bg-card shadow-md space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Open for Collaboration</span>
              </div>

              <h3 className="text-sm font-bold text-foreground">
                Looking to Team Up
              </h3>

              <div className="space-y-1.5">
                {student.lookingFor.map((item) => (
                  <div
                    key={item}
                    className="p-2.5 rounded-xl border border-border/60 bg-muted/20 text-xs font-medium text-foreground flex items-center gap-2"
                  >
                    <Sparkles className="w-3 h-3 text-primary shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => setIsInviteModalOpen(true)}
                className="w-full rounded-xl text-xs font-bold gap-1.5 shadow-xs cursor-pointer h-9 mt-1"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Send Team Invitation</span>
              </Button>
            </div>

            {/* Verified Technical Skills */}
            <div className="p-5 rounded-2xl border border-border/80 bg-card shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Verified Skills & Stack
              </h3>

              <div className="flex items-center gap-1.5 flex-wrap">
                {student.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2.5 py-1 rounded-lg bg-muted text-foreground font-medium border border-border/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* General Interest Areas */}
            <div className="p-5 rounded-2xl border border-border/80 bg-card shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Primary Interests
              </h3>

              <div className="flex items-center gap-1.5 flex-wrap">
                {student.interests.map((interest) => (
                  <span
                    key={interest}
                    className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-medium border border-primary/20"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Links & Handles */}
            <div className="p-5 rounded-2xl border border-border/80 bg-card shadow-2xs space-y-2.5 text-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-1">
                Portfolios & Code
              </h3>

              {student.socials.github && (
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/20 text-muted-foreground">
                  <div className="flex items-center gap-2 font-medium">
                    <svg className="w-4 h-4 fill-current text-foreground shrink-0" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    <span>{student.socials.github}</span>
                  </div>
                  <ExternalLink className="w-3 h-3" />
                </div>
              )}

              {student.socials.portfolio && (
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 bg-muted/20 text-muted-foreground">
                  <div className="flex items-center gap-2 font-medium">
                    <Globe className="w-4 h-4 text-foreground" />
                    <span>{student.socials.portfolio}</span>
                  </div>
                  <ExternalLink className="w-3 h-3" />
                </div>
              )}
            </div>

          </div>

        </div>

        {/* =======================================================================
            INTERACTIVE "INVITE TO TEAM" MODAL
        ======================================================================= */}
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-3xl border border-border/80 bg-card text-foreground shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
              
              <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-border/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl border border-primary/25 overflow-hidden shrink-0">
                    <img
                      src={getAnimeAvatar(slug, student.name)}
                      alt={student.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-base font-bold tracking-tight">
                      Invite {student.name} to Team
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Send a collaborative hackathon squad or project invite.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground text-xs p-1 rounded-lg hover:bg-muted cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSendInvite} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-foreground mb-1 block">
                    Select Event or Initiative
                  </label>
                  <select
                    value={inviteProject}
                    onChange={(e) => setInviteProject(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground"
                  >
                    <option value="GenAI Hackathon 2026">GenAI Hackathon 2026 (Oct 18)</option>
                    <option value="Open Source Campus Sprint">Open Source Campus Sprint</option>
                    <option value="Campus Startup Initiative">Campus Startup Initiative</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-foreground mb-1 block">
                    Role You're Offering
                  </label>
                  <input
                    type="text"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    placeholder="e.g. Backend Engineer / AI Lead"
                    className="w-full h-9 px-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground mb-1 block">
                    Personal Pitch / Note
                  </label>
                  <textarea
                    rows={3}
                    value={inviteNote}
                    onChange={(e) => setInviteNote(e.target.value)}
                    placeholder={`Hey ${student.name}! Saw your work on the feed. Would love to team up for this sprint.`}
                    className="w-full p-2.5 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60 resize-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsInviteModalOpen(false)}
                    className="rounded-xl text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="rounded-xl px-4 text-xs font-bold shadow-xs gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Squad Invite</span>
                  </Button>
                </div>
              </form>

            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-muted-foreground border-t border-border/40 bg-muted/20 mt-12">
        Campusly • Verified Campus Student Directory
      </footer>

    </div>
  );
}
