"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  Calendar,
  Users,
  Code2,
  Check,
  Flame,
} from "lucide-react";

const feedItems = [
  {
    id: "hackathon",
    category: "Hackathon",
    icon: <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />,
    badgeColor: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200/80 dark:border-blue-900/60",
    title: "GenAI Hackathon 2026",
    match: 96,
    timing: "Oct 18–20 · Main Auditorium",
    note: "2 teammate spots open in registered teams",
    tags: ["LLMs", "FastAPI", "Prize Pool $5k"],
    action: "View Event",
  },
  {
    id: "club",
    category: "Student Club",
    icon: <Users className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />,
    badgeColor: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200/80 dark:border-purple-900/60",
    title: "AI & Robotics Society",
    match: 91,
    timing: "Meets Thu 6 PM · CS Hall 3",
    note: "140+ active members · Fall cohort recruiting",
    tags: ["Weekly Labs", "Paper Readings"],
    action: "Join Club",
  },
  {
    id: "teammate",
    category: "Teammate Match",
    avatar: "RS",
    badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-900/60",
    title: "Rahul Sharma",
    match: 89,
    timing: "3rd Year · CS & Data Science",
    note: "Building for GenAI Hackathon. Looking for a Frontend/Next.js peer.",
    tags: ["PyTorch", "LangChain", "FastAPI"],
    action: "Connect",
  },
];

export default function Hero() {
  return (
    <section className="py-12 md:py-16 border-b border-border/50 bg-gradient-to-b from-muted/30 via-background to-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/70 bg-card text-xs font-medium text-muted-foreground shadow-2xs mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Verified student network · Fall 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-[2.65rem] font-bold tracking-tight text-foreground leading-[1.15] mb-4">
              Find your people.
              <br />
              <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text">
                Find your opportunities.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 max-w-md">
              Campusly connects you with student clubs, hackathon teammates, and campus initiatives tailored to your skills and interests — all in one centralized feed.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Link href="/onboarding">
                <Button className="h-10 px-5 rounded-xl text-sm font-semibold shadow-xs gap-1.5">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/explore">
                <Button
                  variant="outline"
                  className="h-10 px-4.5 rounded-xl text-sm font-medium border-border/80 bg-card hover:bg-muted/50 text-foreground"
                >
                  Explore Campus Feed
                </Button>
              </Link>
            </div>

            {/* Micro value proof strip */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium pt-4 border-t border-border/60 w-full">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Verified .edu peers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Skill matching</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Zero spam</span>
              </div>
            </div>
          </div>

          {/* Right Column: Realistic Product Preview ("For You" Feed) */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border/80 bg-card shadow-[0_12px_36px_-6px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.02)] overflow-hidden">
              
              {/* Window Header */}
              <div className="px-4 py-3 border-b border-border/60 bg-muted/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 inline-block" />
                  </div>
                  <span className="text-xs font-semibold text-foreground/90 ml-1.5">
                    For You • Campus Feed
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground bg-card px-2 py-0.5 rounded-md border border-border/60 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  <span>3 new recommendations</span>
                </div>
              </div>

              {/* Segmented Filter Control */}
              <div className="p-2 border-b border-border/40 bg-muted/20">
                <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/40 text-xs">
                  <span className="px-3 py-1 rounded-lg bg-card text-foreground font-semibold shadow-2xs border border-border/60 cursor-pointer">
                    All Matches
                  </span>
                  <span className="px-3 py-1 rounded-lg text-muted-foreground hover:text-foreground font-medium transition-colors cursor-pointer">
                    Hackathons (3)
                  </span>
                  <span className="px-3 py-1 rounded-lg text-muted-foreground hover:text-foreground font-medium transition-colors cursor-pointer">
                    Clubs (2)
                  </span>
                  <span className="px-3 py-1 rounded-lg text-muted-foreground hover:text-foreground font-medium transition-colors cursor-pointer">
                    Teammates (4)
                  </span>
                </div>
              </div>

              {/* Spacious Feed Cards */}
              <div className="p-3.5 space-y-2.5 bg-muted/10">
                {feedItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-border/70 bg-card hover:border-primary/40 hover:shadow-xs transition-all duration-200 group"
                  >
                    {/* Top row: Category + Match Pill */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {item.avatar ? (
                          <div className="relative">
                            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center">
                              {item.avatar}
                            </span>
                            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-card" />
                          </div>
                        ) : null}
                        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md border ${item.badgeColor}`}>
                          {item.icon}
                          {item.category}
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60">
                        <Flame className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        {item.match}% match
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>

                    {/* Metadata & Note */}
                    <p className="text-xs text-muted-foreground mb-1">
                      {item.timing}
                    </p>
                    <p className="text-xs text-foreground/80 font-medium mb-2.5">
                      {item.note}
                    </p>

                    {/* Bottom Row: Tags + Ghost Action Button */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/40">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <span className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 cursor-pointer">
                        {item.action}
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Feed Footer */}
              <div className="px-4 py-2.5 border-t border-border/40 bg-muted/20 text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
                <Sparkles className="w-3 h-3 text-primary/60" />
                <span>Ranked in real-time by your campus profile preferences</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
