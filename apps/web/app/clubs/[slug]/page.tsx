"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AppHeader from "@/components/AppHeader";
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
} from "lucide-react";

interface ClubData {
  name: string;
  badge: string;
  category: string;
  tagline: string;
  members: string;
  meetingTime: string;
  meetingVenue: string;
  recruitingStatus: string;
  about: string;
  gradient: string;
  leadership: {
    role: string;
    name: string;
    slug: string;
    avatar: string;
    degree: string;
  }[];
  perks: {
    icon: string;
    title: string;
    description: string;
  }[];
  projects: string[];
  domains: string[];
}

const clubsData: Record<string, ClubData> = {
  "ai-robotics-society": {
    name: "AI & Robotics Society",
    badge: "Premier Technical Organization",
    category: "AI · Robotics · Machine Learning",
    tagline: "Advancing machine learning research, agentic architectures, and hardware autonomy on campus.",
    members: "140+ active members",
    meetingTime: "Every Thursday · 6:00 PM",
    meetingVenue: "CS Hall 3 · Innovation Wing",
    recruitingStatus: "Fall Cohort Recruiting (12 spots open)",
    gradient: "from-purple-900 via-indigo-900 to-slate-950",
    about:
      "The AI & Robotics Society is the premier student-led research and engineering community on campus. We host weekly paper discussions, provide members with access to dedicated high-performance GPU compute, organize campus hackathons, and build autonomous robotics prototypes for national competitions.",
    leadership: [
      {
        role: "President",
        name: "Priya Verma",
        slug: "priya-verma",
        avatar: "PV",
        degree: "Data Science & AI · 3rd Year",
      },
      {
        role: "Technical Lead",
        name: "Rahul Sharma",
        slug: "rahul-sharma",
        avatar: "RS",
        degree: "CSE · 2nd Year",
      },
    ],
    perks: [
      {
        icon: "⚡",
        title: "GPU Compute Cluster Access",
        description: "Dedicated A100 GPU compute access for training and benchmarking deep learning models.",
      },
      {
        icon: "📚",
        title: "Weekly Research Reading Groups",
        description: "Discussions breaking down the latest NeurIPS, ICML, and CVPR papers.",
      },
      {
        icon: "🏆",
        title: "Sponsored Hackathon Teams",
        description: "Travel stipends and entry fee coverage for flagship national hackathons.",
      },
      {
        icon: "🤝",
        title: "Alumni & Lab Mentorship",
        description: "1-on-1 guidance from campus alumni working at top tech firms and research labs.",
      },
    ],
    projects: [
      "Autonomous Rover Navigation (ROS2 + OpenCV)",
      "Campus LLM Academic Advisory Assistant",
      "Low-power Edge Vision Sensor for Smart Library",
    ],
    domains: ["Machine Learning & LLMs", "Robotics & Embedded Systems", "Full-Stack AI Apps", "Research & Papers"],
  },
  "design-guild": {
    name: "Design & Build Guild",
    badge: "Product & UI/UX Society",
    category: "UI/UX · Product Design · Frontend",
    tagline: "Uniting designers, design engineers, and creative builders to craft intuitive student products.",
    members: "95+ active members",
    meetingTime: "Every Tuesday · 5:30 PM",
    meetingVenue: "Design Studio B · Art & Media Hub",
    recruitingStatus: "Recruiting Fall Cohort",
    gradient: "from-amber-900 via-orange-900 to-slate-950",
    about:
      "Design & Build Guild bridges the gap between aesthetic product design and production frontend code. Members participate in weekly Figma teardowns, collaborate with engineering teams on hackathon prototypes, and learn modern web ergonomics.",
    leadership: [
      {
        role: "President",
        name: "Ananya Singh",
        slug: "ananya-singh",
        avatar: "AS",
        degree: "Design & CS · 3rd Year",
      },
      {
        role: "Systems Lead",
        name: "Dev Kapoor",
        slug: "dev-kapoor",
        avatar: "DK",
        degree: "Software Engineering · 2nd Year",
      },
    ],
    perks: [
      {
        icon: "🎨",
        title: "Figma Enterprise Workspace",
        description: "Free shared workspace with premium design system components and templates.",
      },
      {
        icon: "🚀",
        title: "Campus Startup Pairing",
        description: "Match with student founders needing UI/UX design and frontend engineering.",
      },
      {
        icon: "💼",
        title: "Portfolio Reviews",
        description: "Bi-weekly design critiques and case study polish with senior product designers.",
      },
      {
        icon: "✨",
        title: "Interactive Web Workshops",
        description: "Hands-on sessions on Tailwind CSS, Framer Motion, and micro-interactions.",
      },
    ],
    projects: [
      "Campusly Universal UI Design System",
      "Student Dining Experience Mobile Prototype",
      "Interactive Campus Map & Accessibility Guide",
    ],
    domains: ["Product UI/UX Design", "Design Systems & Tokens", "Frontend Prototyping", "User Research"],
  },
};

export default function ClubDetailPage() {
  const params = useParams();
  const rawSlug = (params?.slug as string) || "ai-robotics-society";
  const slug = rawSlug.toLowerCase();

  const club: ClubData = clubsData[slug] || {
    name: rawSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    badge: "Official Campus Student Club",
    category: "Technology · Innovation · Community",
    tagline: "Student organization empowering builders, creators, and community leaders.",
    members: "60+ active members",
    meetingTime: "Every Wednesday · 5:00 PM",
    meetingVenue: "Student Activity Center",
    recruitingStatus: "Actively Recruiting Members",
    gradient: "from-blue-900 via-indigo-900 to-slate-950",
    about:
      "A student-run campus organization dedicated to peer learning, community projects, and hosting regular workshops for all experience levels.",
    leadership: [
      {
        role: "Club Lead",
        name: "Campus Leader",
        slug: "rahul-sharma",
        avatar: "CL",
        degree: "Computer Science",
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
    projects: ["Campus Community Portal", "Annual Student Showcase"],
    domains: ["General Membership", "Technical Core", "Events & Outreach"],
  };

  const [isSaved, setIsSaved] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(club.domains[0] || "General Membership");
  const [studentYear, setStudentYear] = useState("2nd Year");
  const [statement, setStatement] = useState("");

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplying(false);
    setIsJoined(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <AppHeader />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6">
        
        {/* Top Breadcrumb & Bookmark */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/feed"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to For You Feed</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsSaved(!isSaved)}
            className={`h-8 px-3 rounded-lg border border-border/60 bg-card flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer ${
              isSaved ? "text-red-500 border-red-200 bg-red-500/5" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-red-500" : ""}`} />
            <span>{isSaved ? "Saved" : "Save Club"}</span>
          </button>
        </div>

        {/* Membership Success State */}
        {isJoined ? (
          <div className="py-12 px-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/[0.03] text-center max-w-lg mx-auto shadow-sm animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
              You&apos;re a Club Member!
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Your registration with <span className="font-semibold text-foreground">{club.name}</span> has been confirmed.
            </p>

            <div className="p-4 rounded-2xl border border-border/70 bg-card text-left mb-6 space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-border/50">
                <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Membership #AIRS-2026-042
                </span>
                <Badge variant="secondary" className="text-[10px] text-emerald-700 bg-emerald-50 border-emerald-200">
                  Confirmed
                </Badge>
              </div>
              <h3 className="font-bold text-base text-foreground">
                {club.name}
              </h3>
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary/70" />
                  <span>Orientation: {club.meetingTime}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary/70" />
                  <span>{club.meetingVenue}</span>
                </div>
                <div className="flex items-center gap-1.5 text-foreground/80 font-medium pt-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Track: {selectedDomain}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/feed" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto rounded-xl px-6 font-semibold text-xs shadow-xs">
                  Back to Feed
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => setIsJoined(false)}
                className="w-full sm:w-auto rounded-xl px-5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
              >
                View Club Details
              </Button>
            </div>
          </div>
        ) : (
          /* Normal Club Detail View */
          <div>
            {/* Visual Hero Banner */}
            <div className={`w-full h-48 sm:h-64 rounded-2xl bg-gradient-to-tr ${club.gradient} p-6 flex flex-col justify-between text-white relative overflow-hidden mb-6 shadow-sm`}>
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[size:16px_16px]" />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20">
                  <Building2 className="w-3.5 h-3.5 text-purple-300" />
                  {club.badge}
                </span>
                <span className="text-xs font-medium text-white/90 bg-black/30 px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {club.members}
                </span>
              </div>

              <div className="relative z-10">
                <span className="text-xs font-mono uppercase tracking-widest text-purple-200">
                  {club.category}
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mt-1">
                  {club.name}
                </h1>
                <p className="text-xs sm:text-sm text-white/85 font-medium mt-1 max-w-lg">
                  {club.tagline}
                </p>
              </div>
            </div>

            {/* Quick Meta Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60 mb-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{club.recruitingStatus}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary/70" />
                    <span className="text-foreground font-medium">{club.meetingTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary/70" />
                    <span>{club.meetingVenue}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setIsApplying(true)}
                className="rounded-xl px-6 font-semibold text-xs shadow-xs gap-1.5 cursor-pointer shrink-0"
              >
                <span>Apply to Join Club</span>
                <Users className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* About Section */}
            <section className="mb-8">
              <h2 className="text-base font-bold text-foreground mb-2.5">
                About the Society
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {club.about}
              </p>
            </section>

            {/* Student Leadership */}
            <section className="mb-8">
              <h2 className="text-base font-bold text-foreground mb-3">
                Executive Student Leadership
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {club.leadership.map((leader) => (
                  <Link
                    key={leader.slug}
                    href={`/people/${leader.slug}`}
                    className="p-3.5 rounded-xl border border-border/70 bg-card hover:border-primary/40 hover:shadow-2xs transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                        {leader.avatar}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                          <span>{leader.name}</span>
                          <span className="text-[10px] text-muted-foreground font-normal">({leader.role})</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {leader.degree}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-primary font-medium group-hover:translate-x-0.5 transition-transform">
                      Profile →
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Membership Perks */}
            <section className="mb-8">
              <h2 className="text-base font-bold text-foreground mb-3">
                What Members Get
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {club.perks.map((perk) => (
                  <div
                    key={perk.title}
                    className="p-4 rounded-xl border border-border/60 bg-card shadow-2xs"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-lg">{perk.icon}</span>
                      <h3 className="font-semibold text-xs sm:text-sm text-foreground">
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

            {/* Active Club Initiatives */}
            <section className="mb-10">
              <h2 className="text-base font-bold text-foreground mb-3">
                Active Projects & Initiatives
              </h2>
              <div className="space-y-2">
                {club.projects.map((proj) => (
                  <div
                    key={proj}
                    className="p-3 rounded-xl border border-border/60 bg-muted/20 flex items-center gap-2.5 text-xs text-foreground font-medium"
                  >
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <span>{proj}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Bottom Action Card */}
            <div className="sticky bottom-4 z-30 p-4 rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md shadow-lg flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-foreground">{club.name}</div>
                <div className="text-xs text-muted-foreground">{club.recruitingStatus}</div>
              </div>

              <Button
                size="lg"
                onClick={() => setIsApplying(true)}
                className="rounded-xl px-7 text-xs font-bold shadow-xs gap-2 cursor-pointer"
              >
                Apply for Membership
                <Users className="w-4 h-4" />
              </Button>
            </div>

          </div>
        )}

        {/* Application Modal Dialog */}
        {isApplying && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-2xl border border-border/80 bg-card text-foreground shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
              <h2 className="text-base font-bold tracking-tight mb-1">
                Apply to {club.name}
              </h2>
              <p className="text-xs text-muted-foreground mb-5">
                Join the fall cohort. No experience prerequisites required for general membership.
              </p>

              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1.5 block">
                    Choose Your Focus Track
                  </label>
                  <div className="space-y-1.5">
                    {club.domains.map((dom) => (
                      <button
                        key={dom}
                        type="button"
                        onClick={() => setSelectedDomain(dom)}
                        className={`w-full p-2.5 rounded-xl border text-xs font-medium text-left transition-all flex items-center justify-between cursor-pointer ${
                          selectedDomain === dom
                            ? "border-primary bg-primary/[0.06] text-foreground font-semibold ring-1 ring-primary/20"
                            : "border-border/60 bg-muted/30 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span>{dom}</span>
                        {selectedDomain === dom && <Check className="w-3.5 h-3.5 text-primary stroke-[2.5]" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
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
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Why do you want to join? (Optional)
                  </label>
                  <textarea
                    value={statement}
                    onChange={(e) => setStatement(e.target.value)}
                    placeholder="e.g. Interested in learning robotics and competing in campus hackathons."
                    rows={2}
                    className="w-full p-2.5 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/50">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsApplying(false)}
                    className="rounded-xl text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="rounded-xl px-5 text-xs font-semibold shadow-xs gap-1.5 cursor-pointer"
                  >
                    Submit Application
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-muted-foreground border-t border-border/40 bg-muted/20">
        Campusly • Verified student organization network
      </footer>

    </div>
  );
}
