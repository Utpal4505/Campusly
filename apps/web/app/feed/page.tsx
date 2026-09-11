"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ThemeToggle from "@/components/ThemeToggle";
import { useCampusStore } from "@/lib/store";
import {
  Sparkles,
  Calendar,
  Users,
  Flame,
  ArrowRight,
  CheckCheck,
  Search,
  SlidersHorizontal,
  Bell,
  Code2,
  ExternalLink,
  MapPin,
  Clock,
  Check,
} from "lucide-react";

interface FeedItem {
  id: string;
  category: "Hackathon" | "Club" | "Teammate" | "Project";
  type: "hackathons" | "clubs" | "teammates" | "projects";
  title: string;
  match: number;
  badgeColor: string;
  avatar?: string;
  meta: string;
  description: string;
  tags: string[];
  actionLabel: string;
  actionDoneLabel: string;
}

const feedData: FeedItem[] = [
  {
    id: "genai-hack",
    category: "Hackathon",
    type: "hackathons",
    title: "GenAI Hackathon 2026",
    match: 96,
    badgeColor: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200/80 dark:border-blue-900/60",
    meta: "Oct 18–20 · Main Auditorium · 48h Sprint",
    description:
      "Build production-grade AI agents and tools. 3 campus teams are actively looking for frontend & UI teammates.",
    tags: ["LLMs", "FastAPI", "Prize: $5,000", "2 spots open"],
    actionLabel: "Register for Hackathon",
    actionDoneLabel: "Registered ✓",
  },
  {
    id: "ai-club",
    category: "Club",
    type: "clubs",
    title: "AI & Robotics Society",
    match: 91,
    badgeColor: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200/80 dark:border-purple-900/60",
    meta: "Meets Thu 6:00 PM · CS Hall 3 · 140+ Active Members",
    description:
      "Campus's premier machine learning organization. Weekly paper discussions, GPU cluster access, and hack night labs.",
    tags: ["Weekly Workshops", "GPU Cluster Access", "Recruiting"],
    actionLabel: "Join Club",
    actionDoneLabel: "Member Joined ✓",
  },
  {
    id: "rahul-sharma",
    category: "Teammate",
    type: "teammates",
    title: "Rahul Sharma — AI / Backend",
    match: 89,
    avatar: "RS",
    badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-900/60",
    meta: "3rd Year CS · FastAPI, PyTorch, LangChain",
    description:
      "“Building an autonomous research agent for GenAI Hackathon. Looking for a frontend/Next.js peer to team up!”",
    tags: ["PyTorch", "FastAPI", "LangChain", "Looking for Teammate"],
    actionLabel: "Connect & Team Up",
    actionDoneLabel: "Invite Sent ✓",
  },
  {
    id: "resume-analyzer",
    category: "Project",
    type: "projects",
    title: "AI Resume Analyzer",
    match: 84,
    badgeColor: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200/80 dark:border-amber-900/60",
    meta: "Open Source Campus Project · 3/4 Team Members Onboard",
    description:
      "Developing an open-source ATS scoring and career assistant for campus placements. Seeking 1 backend/API engineer.",
    tags: ["Next.js", "Python", "Open Source", "Placement Prep"],
    actionLabel: "Apply to Join Project",
    actionDoneLabel: "Application Sent ✓",
  },
];

export default function FeedPage() {
  const { interests, userName } = useCampusStore();
  const [activeTab, setActiveTab] = useState<"all" | "hackathons" | "clubs" | "teammates" | "projects">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [interactedMap, setInteractedMap] = useState<Record<string, boolean>>({});

  const handleAction = (id: string) => {
    setInteractedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredItems = feedData.filter((item) => {
    const matchesTab = activeTab === "all" || item.type === activeTab;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      
      {/* App Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-xs">
                C
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-foreground">
                  Campusly
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded-md bg-muted text-muted-foreground border border-border/60 font-mono">
                  For You
                </span>
              </div>
            </Link>

            <div className="hidden sm:flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Link href="/feed" className="px-2.5 py-1.5 rounded-md bg-muted text-foreground font-semibold">
                For You
              </Link>
              <Link href="/onboarding" className="px-2.5 py-1.5 rounded-md hover:text-foreground transition-colors">
                Preferences
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <div className="relative hidden md:block w-48">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search feed..."
                className="w-full h-8 pl-8 pr-3 text-xs bg-muted/50 rounded-lg border border-border/60 focus:outline-none focus:border-primary/50 text-foreground placeholder:text-muted-foreground/60"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center shadow-xs">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-foreground hidden sm:inline-block">
                {userName}
              </span>
            </div>
          </div>

        </div>
      </header>

      {/* Main Feed Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* Personalized Welcome Banner */}
        <div className="mb-8 pb-6 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-500/20 mb-2">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                <span>Personalized Feed Active</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Good morning, {userName} 👋
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Based on your interests in{" "}
                <span className="text-foreground font-medium">
                  {interests.join(", ") || "AI, Web Dev & Startups"}
                </span>
                .
              </p>
            </div>

            {/* Quick Edit Preferences Button */}
            <div className="flex items-center gap-2">
              <Link href="/onboarding">
                <Button variant="outline" size="sm" className="h-8 text-xs font-medium rounded-lg">
                  <SlidersHorizontal className="w-3 h-3 mr-1.5" />
                  Edit Interests
                </Button>
              </Link>
            </div>
          </div>

          {/* Active Interest Chips */}
          <div className="flex items-center gap-1.5 flex-wrap mt-4">
            <span className="text-xs text-muted-foreground font-medium mr-1">
              Your tags:
            </span>
            {(interests.length > 0 ? interests : ["AI", "Web Dev", "Startups"]).map((interest) => (
              <span
                key={interest}
                className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/5 text-primary border border-primary/20 flex items-center gap-1"
              >
                <span>✨ {interest}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Feed Filter Segmented Control */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/50 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-card text-foreground font-semibold shadow-xs border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Matches (4)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("hackathons")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === "hackathons"
                  ? "bg-card text-foreground font-semibold shadow-xs border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              ⚡ Hackathons (1)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("clubs")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === "clubs"
                  ? "bg-card text-foreground font-semibold shadow-xs border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              🏛 Clubs (1)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("teammates")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === "teammates"
                  ? "bg-card text-foreground font-semibold shadow-xs border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              👤 Teammates (1)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("projects")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === "projects"
                  ? "bg-card text-foreground font-semibold shadow-xs border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              🛠 Projects (1)
            </button>
          </div>

          <div className="text-xs text-muted-foreground font-medium">
            Showing {filteredItems.length} recommendations
          </div>
        </div>

        {/* The 4 Feed Cards */}
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const isDone = !!interactedMap[item.id];
            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-border/70 bg-card shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200"
              >
                {/* Header row: Category Badge + Match Percentage */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    {item.avatar ? (
                      <div className="relative">
                        <span className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                          {item.avatar}
                        </span>
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-card" />
                      </div>
                    ) : null}
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-md border ${item.badgeColor}`}>
                      {item.category}
                    </span>
                  </div>

                  {/* Match pill */}
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-900/60 shadow-2xs">
                    <Flame className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    {item.match}% Match
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-foreground mb-1.5">
                  {item.title}
                </h3>

                {/* Meta details */}
                <p className="text-xs text-muted-foreground font-medium mb-2.5">
                  {item.meta}
                </p>

                {/* Description */}
                <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Footer: Tags & Interactive CTA */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3.5 border-t border-border/50">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleAction(item.id)}
                    className={`h-8 px-4 rounded-lg text-xs font-semibold gap-1.5 transition-all cursor-pointer ${
                      isDone
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100"
                        : "shadow-xs"
                    }`}
                  >
                    {isDone ? (
                      <>
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{item.actionDoneLabel}</span>
                      </>
                    ) : (
                      <>
                        <span>{item.actionLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-muted-foreground border-t border-border/40 mt-12 bg-muted/20">
        Campusly • Verified Campus Opportunity Feed
      </footer>

    </div>
  );
}
