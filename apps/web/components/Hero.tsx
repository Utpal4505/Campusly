"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAnimeAvatar } from "@/lib/avatars";
import {
  ArrowRight,
  Sparkles,
  Calendar,
  Users,
  Code2,
  Check,
  Zap,
  ShieldCheck,
  Trophy,
} from "lucide-react";

interface HeroPreviewItem {
  id: string;
  type: "teammates" | "hackathons" | "clubs";
  category: string;
  icon?: React.ReactNode;
  badgeColor: string;
  title: string;
  timing: string;
  note: string;
  tags: string[];
  action: string;
  href: string;
  avatarSlug?: string;
  avatarName?: string;
}

const previewItems: HeroPreviewItem[] = [
  {
    id: "teammate",
    type: "teammates",
    category: "Teammate Match",
    avatarSlug: "rahul-sharma",
    avatarName: "Rahul Sharma",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
    title: "Rahul Sharma",
    timing: "3rd Year · CS & Data Science @ LPU",
    note: "“Building for GenAI Hackathon. Looking for a Frontend / Next.js peer to team up!”",
    tags: ["PyTorch", "LangChain", "FastAPI"],
    action: "Connect & Team Up",
    href: "/people/rahul-sharma",
  },
  {
    id: "hackathon",
    type: "hackathons",
    category: "Hackathon",
    icon: <Calendar className="w-3.5 h-3.5 text-blue-500" />,
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25",
    title: "GenAI Hackathon 2026",
    timing: "Oct 18–20 · Block 32 (School of CSE)",
    note: "₹50,000 in Prizes · 2 teammate spots open in registered squads",
    tags: ["LLMs", "FastAPI", "48h Sprint"],
    action: "View Event & Register",
    href: "/events/genai-hackathon",
  },
  {
    id: "club",
    type: "clubs",
    category: "Student Club",
    icon: <Users className="w-3.5 h-3.5 text-purple-500" />,
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25",
    title: "AI & Robotics Society",
    timing: "Meets Thu 6:00 PM · CS Hall 3",
    note: "140+ active members · Dedicated GPU cluster access · Fall cohort recruiting",
    tags: ["GPU Clusters", "RoboQuest", "Recruiting"],
    action: "View Club & Pass",
    href: "/clubs/ai-robotics-society",
  },
];

export default function Hero() {
  const [activeTab, setActiveTab] = useState<"all" | "teammates" | "hackathons" | "clubs">("all");

  const filteredItems = previewItems.filter(
    (item) => activeTab === "all" || item.type === activeTab
  );

  return (
    <section className="relative overflow-hidden py-14 sm:py-20 border-b border-border/50 bg-background">
      
      {/* Ambient Atmospheric Lighting & Dot Grid Overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-primary/15 via-primary/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: ICP-Focused Headline & Value Pitch */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            
            {/* Context Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/70 bg-card text-xs font-semibold text-muted-foreground shadow-2xs mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>The Builder Network • Lovely Professional University</span>
            </div>

            {/* High-Stakes Student Builder Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-black tracking-tight text-foreground leading-[1.12] mb-4">
              Stop building alone.
              <br />
              <span className="bg-gradient-to-r from-primary via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Find your squad. Win the hackathon.
              </span>
            </h1>

            {/* Subheadline: Solving the WhatsApp Chaos */}
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 max-w-md">
              Skip the noisy 1,000-member WhatsApp chat chaos. Match with verified campus peers by tech stack, join top student clubs, and build winning projects across LPU.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Link href="/onboarding">
                <Button className="h-10 px-5 rounded-xl text-xs font-bold shadow-xs gap-2 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90">
                  <span>Find Your Teammates Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/feed">
                <Button
                  variant="outline"
                  className="h-10 px-4.5 rounded-xl text-xs font-semibold border-border/80 bg-card hover:bg-muted/50 text-foreground cursor-pointer"
                >
                  Explore Campus Feed
                </Button>
              </Link>
            </div>

            {/* Student Proof Badges */}
            <div className="flex items-center gap-3.5 text-xs text-muted-foreground font-medium pt-4 border-t border-border/60 w-full flex-wrap">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Verified .edu Students</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>Stack & Skill Match</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>No WhatsApp Spam</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Real-Time Product Preview */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-border/80 bg-card shadow-xl overflow-hidden relative">
              
              {/* Subtle top glow line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

              {/* Window Header */}
              <div className="px-4 py-3 border-b border-border/60 bg-muted/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 inline-block" />
                  </div>
                  <span className="text-xs font-bold text-foreground/90 ml-1.5">
                    Campusly Live Match Feed
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>3 new matches right now</span>
                </div>
              </div>

              {/* Interactive Segmented Filter Tabs (Clickable Demo) */}
              <div className="p-2 border-b border-border/40 bg-muted/20">
                <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl border border-border/40 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab("all")}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      activeTab === "all"
                        ? "bg-card text-foreground shadow-2xs border border-border/60"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    All Matches
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("teammates")}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      activeTab === "teammates"
                        ? "bg-card text-foreground shadow-2xs border border-border/60"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Teammates (4)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("hackathons")}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      activeTab === "hackathons"
                        ? "bg-card text-foreground shadow-2xs border border-border/60"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Hackathons (3)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("clubs")}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      activeTab === "clubs"
                        ? "bg-card text-foreground shadow-2xs border border-border/60"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Clubs (2)
                  </button>
                </div>
              </div>

              {/* Feed Items Stream */}
              <div className="p-3.5 space-y-2.5 bg-muted/10">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl border border-border/70 bg-card hover:border-primary/40 hover:shadow-xs transition-all duration-200 group"
                  >
                    {/* Top Row: Category Badge + Status */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {item.avatarSlug ? (
                          <div className="relative shrink-0">
                            <div className="w-6 h-6 rounded-full overflow-hidden border border-border/70 bg-muted/20">
                              <img
                                src={getAnimeAvatar(item.avatarSlug, item.avatarName)}
                                alt={item.avatarName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-card" />
                          </div>
                        ) : null}
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${item.badgeColor}`}>
                          {item.icon}
                          {item.category}
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/60">
                        {item.type === "teammates" ? "Squad Open" : item.type === "hackathons" ? "Tomorrow" : "Active Club"}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-sm font-bold text-foreground mb-0.5 group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>

                    {/* Timing & Note */}
                    <p className="text-[11px] text-muted-foreground font-medium mb-1">
                      {item.timing}
                    </p>
                    <p className="text-xs text-foreground/85 leading-relaxed font-normal mb-2.5">
                      {item.note}
                    </p>

                    {/* Bottom Row: Tags + Clickable Link Action */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium border border-border/40"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={item.href}
                        className="text-xs font-bold text-primary hover:underline transition-colors flex items-center gap-1 shrink-0"
                      >
                        <span>{item.action}</span>
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Feed Footer */}
              <div className="px-4 py-2.5 border-t border-border/40 bg-muted/20 text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
                <Sparkles className="w-3 h-3 text-primary" />
                <span>Ranked in real-time by your campus tech stack preferences</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
