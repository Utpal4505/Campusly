"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AppHeader from "@/components/AppHeader";
import { useCampusStore } from "@/lib/store";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Search,
  SlidersHorizontal,
  Plus,
  Building2,
  Code2,
  CheckCheck,
  Flame,
  MessageSquare,
  Sparkles,
  Users,
  X,
  RotateCcw,
  Bookmark,
  Trophy,
} from "lucide-react";

interface FeedItem {
  id: string;
  category: "Hackathon" | "Club" | "Teammate" | "Project";
  type: "hackathons" | "clubs" | "teammates" | "projects";
  title: string;
  badgeColor: string;
  statusTag: string;
  avatar?: string;
  meta: string;
  description: string;
  tags: string[];
  actionLabel: string;
  actionDoneLabel: string;
  actionHref?: string;
}

const defaultFeedData: FeedItem[] = [
  {
    id: "genai-hack",
    category: "Hackathon",
    type: "hackathons",
    title: "GenAI Hackathon 2026",
    statusTag: "Tomorrow · 6:00 PM",
    badgeColor: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200/80 dark:border-blue-900/60",
    meta: "Oct 18–20 · Main Auditorium · 48h Sprint",
    description:
      "Build production-grade AI agents and tools. 3 campus teams are actively looking for frontend & UI teammates.",
    tags: ["LLMs", "FastAPI", "Prize: $5,000", "2 spots open"],
    actionLabel: "View Event & Register",
    actionDoneLabel: "Registered ✓",
    actionHref: "/events/genai-hackathon",
  },
  {
    id: "ai-club",
    category: "Club",
    type: "clubs",
    title: "AI & Robotics Society",
    statusTag: "Recruiting Members",
    badgeColor: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200/80 dark:border-purple-900/60",
    meta: "Meets Thu 6:00 PM · CS Hall 3 · 140+ Active Members",
    description:
      "Campus premier machine learning organization. Weekly paper discussions, GPU cluster access, and hack night labs.",
    tags: ["Weekly Workshops", "GPU Cluster Access", "Recruiting"],
    actionLabel: "View Club & Join",
    actionDoneLabel: "Member Joined ✓",
    actionHref: "/clubs/ai-robotics-society",
  },
  {
    id: "design-guild",
    category: "Club",
    type: "clubs",
    title: "Design & Build Guild",
    statusTag: "Recruiting Fall Cohort",
    badgeColor: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200/80 dark:border-amber-900/60",
    meta: "Meets Tue 5:30 PM · Design Studio B · 95+ Active Members",
    description:
      "Uniting UI/UX designers and frontend builders. Weekly Figma teardowns, design system workshops, and portfolio reviews.",
    tags: ["UI/UX", "Figma", "Design Systems", "Recruiting"],
    actionLabel: "View Club & Join",
    actionDoneLabel: "Member Joined ✓",
    actionHref: "/clubs/design-guild",
  },
  {
    id: "rahul-sharma",
    category: "Teammate",
    type: "teammates",
    title: "Rahul Sharma — AI / Backend",
    statusTag: "Seeking Frontend Peer",
    avatar: "RS",
    badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-900/60",
    meta: "3rd Year CS · FastAPI, PyTorch, LangChain",
    description:
      "“Building an autonomous research agent for GenAI Hackathon. Looking for a frontend/Next.js peer to team up!”",
    tags: ["PyTorch", "FastAPI", "LangChain", "Hackathon Teammate"],
    actionLabel: "Connect & Team Up",
    actionDoneLabel: "Invite Sent ✓",
    actionHref: "/people/rahul-sharma",
  },
  {
    id: "resume-analyzer",
    category: "Project",
    type: "projects",
    title: "AI Resume Analyzer",
    statusTag: "1 Spot Open",
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
  const { userName, interests, customPosts, setCreateModalOpen, setEditInterestsOpen } = useCampusStore();
  const [activeTab, setActiveTab] = useState<"all" | "hackathons" | "clubs" | "teammates" | "projects">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [interactedMap, setInteractedMap] = useState<Record<string, boolean>>({});

  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});

  const handleAction = (id: string) => {
    setInteractedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSave = (id: string) => {
    setSavedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Convert custom user posts into feed items
  const userCustomFeedItems: FeedItem[] = customPosts.map((post) => {
    let category: "Hackathon" | "Club" | "Teammate" | "Project" = "Teammate";
    let type: "hackathons" | "clubs" | "teammates" | "projects" = "teammates";
    let badgeColor = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";

    if (post.type === "events") {
      category = "Hackathon";
      type = "hackathons";
      badgeColor = "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200/80 dark:border-blue-900/60";
    } else if (post.type === "clubs") {
      category = "Club";
      type = "clubs";
      badgeColor = "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200/80 dark:border-purple-900/60";
    } else if (post.type === "projects") {
      category = "Project";
      type = "projects";
      badgeColor = "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200/80 dark:border-amber-900/60";
    }

    return {
      id: post.id,
      category,
      type,
      title: post.title,
      statusTag: "⚡ Posted Just Now",
      avatar: post.avatar,
      badgeColor,
      meta: post.meta,
      description: post.description,
      tags: post.tags,
      actionLabel: post.actionLabel,
      actionDoneLabel: post.actionDoneLabel,
      actionHref: post.actionHref,
    };
  });

  const allFeedItems = [...userCustomFeedItems, ...defaultFeedData];

  const hackathonsCount = allFeedItems.filter((i) => i.type === "hackathons").length;
  const clubsCount = allFeedItems.filter((i) => i.type === "clubs").length;
  const teammatesCount = allFeedItems.filter((i) => i.type === "teammates").length;
  const projectsCount = allFeedItems.filter((i) => i.type === "projects").length;

  const filteredItems = allFeedItems.filter((item) => {
    const matchesTab = activeTab === "all" || item.type === activeTab;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AppHeader />

      {/* Main Feed Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* Streamlined Clean Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Good evening, {userName} 👋
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {allFeedItems.length} opportunities matched
              </span>
              <span className="text-border">•</span>
              <span>Curated for your campus profile</span>
            </p>
          </div>

          {/* Clean Integrated Tag Trigger */}
          <button
            type="button"
            onClick={() => setEditInterestsOpen(true)}
            className="h-8 px-3 rounded-xl border border-border/70 bg-card hover:bg-muted/50 flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-all cursor-pointer self-start sm:self-auto shadow-2xs group shrink-0"
            title="Edit your interest tags"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary group-hover:rotate-12 transition-transform" />
            <span className="font-semibold text-foreground text-xs">
              {(interests.length > 0 ? interests : ["AI", "Web Dev", "Startups"]).slice(0, 3).join(", ")}
              {interests.length > 3 && ` +${interests.length - 3}`}
            </span>
            <span className="text-[11px] text-muted-foreground underline underline-offset-2 pl-0.5">
              Edit
            </span>
          </button>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-border/50">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer shrink-0 ${
                activeTab === "all"
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              All Matches ({allFeedItems.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("hackathons")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer shrink-0 ${
                activeTab === "hackathons"
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              ⚡ Hackathons ({hackathonsCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("clubs")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer shrink-0 ${
                activeTab === "clubs"
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              🏛 Clubs ({clubsCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("teammates")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer shrink-0 ${
                activeTab === "teammates"
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              👤 Teammates ({teammatesCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("projects")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer shrink-0 ${
                activeTab === "projects"
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              🛠 Projects ({projectsCount})
            </button>
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search feed, skills, clubs..."
              className="w-full h-8 pl-8 pr-7 text-xs bg-muted/40 rounded-lg border border-border/60 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Organizer Club Registration Banner when on clubs tab */}
        {activeTab === "clubs" && (
          <div className="mb-4 p-3.5 rounded-2xl border border-purple-500/30 bg-purple-500/[0.04] flex items-center justify-between gap-3 text-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="text-base">🏛️</span>
              <span className="text-muted-foreground">
                Leading a student organization or club? Recruit members on Campusly.
              </span>
            </div>
            <Link href="/clubs/register">
              <Button size="sm" variant="outline" className="h-7 text-xs font-semibold rounded-lg shrink-0 gap-1 cursor-pointer">
                <span>Register Club</span>
                <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        )}

        {/* Feed Cards List */}
        {filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map((item) => {
              const isDone = !!interactedMap[item.id];
              const isSaved = !!savedMap[item.id];

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl border border-border/80 bg-card shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-start gap-3.5 sm:gap-4">
                    {/* Visual Anchor */}
                    {item.category === "Hackathon" ? (
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] uppercase font-bold tracking-wider leading-none">OCT</span>
                        <span className="text-base font-extrabold leading-none mt-1">18</span>
                      </div>
                    ) : item.category === "Club" ? (
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl shrink-0">
                        {item.id === "ai-club" ? "🤖" : item.id === "design-guild" ? "🎨" : "🏛️"}
                      </div>
                    ) : item.category === "Teammate" ? (
                      <div className="relative w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-sm font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                        {item.avatar || "RS"}
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card" title="Active student" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl shrink-0">
                        🚀
                      </div>
                    )}

                    {/* Card Content Area */}
                    <div className="flex-1 min-w-0">
                      {/* Category Badge + Status Tag + Bookmark */}
                      <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-md border ${item.badgeColor}`}>
                            {item.category}
                          </span>
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/60">
                            {item.statusTag}
                          </span>
                        </div>

                        {/* Save / Bookmark Toggle */}
                        <button
                          type="button"
                          onClick={() => toggleSave(item.id)}
                          className="text-muted-foreground hover:text-primary transition-colors p-1 rounded-md hover:bg-muted/60 cursor-pointer"
                          title={isSaved ? "Saved" : "Save opportunity"}
                        >
                          <Bookmark className={`w-4 h-4 ${isSaved ? "fill-primary text-primary" : ""}`} />
                        </button>
                      </div>

                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {item.actionHref ? (
                          <Link href={item.actionHref} className="hover:underline">
                            {item.title}
                          </Link>
                        ) : (
                          item.title
                        )}
                      </h3>

                      {/* Meta details */}
                      <p className="text-xs text-muted-foreground font-medium mb-2.5">
                        {item.meta}
                      </p>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed mb-4">
                        {item.description}
                      </p>

                      {/* Footer: Semantic Tags & Single Decisive CTA */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3.5 border-t border-border/50">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {item.tags.map((tag) => {
                            const isPrize = tag.toLowerCase().includes("prize");
                            const isOpenSpot = tag.toLowerCase().includes("spot") || tag.toLowerCase().includes("recruiting");
                            return (
                              <span
                                key={tag}
                                className={`text-[11px] px-2 py-0.5 rounded-md font-medium inline-flex items-center gap-1 ${
                                  isPrize
                                    ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
                                    : isOpenSpot
                                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                                    : "bg-muted text-muted-foreground border border-border/40"
                                }`}
                              >
                                {isPrize && <Trophy className="w-3 h-3 text-amber-500" />}
                                {isOpenSpot && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                                {tag}
                              </span>
                            );
                          })}
                        </div>

                        {/* Single Decisive CTA Button */}
                        <div className="shrink-0 flex items-center justify-end">
                          {item.actionHref && !isDone ? (
                            <Link href={item.actionHref}>
                              <Button
                                size="sm"
                                className="h-8 px-4 rounded-lg text-xs font-semibold gap-1.5 shadow-xs cursor-pointer"
                              >
                                <span>{item.actionLabel}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Button>
                            </Link>
                          ) : (
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
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
      ) : (
        <div className="py-12 px-6 rounded-2xl border border-dashed border-border bg-card text-center max-w-md mx-auto my-6 animate-in fade-in">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3 text-muted-foreground">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-1">
            No campus opportunities found
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            {searchQuery
              ? `No results matching "${searchQuery}". Try a different keyword or reset filters.`
              : "No posts in this category yet. Be the first to share an opportunity!"}
          </p>
          <div className="flex items-center justify-center gap-2">
            {searchQuery && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="h-8 text-xs rounded-lg gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear Search
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => setCreateModalOpen(true)}
              className="h-8 text-xs rounded-lg gap-1.5 font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Post
            </Button>
          </div>
        </div>
      )}

      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-muted-foreground border-t border-border/40 mt-12 bg-muted/20">
        Campusly • Curated campus network feed
      </footer>

    </div>
  );
}
