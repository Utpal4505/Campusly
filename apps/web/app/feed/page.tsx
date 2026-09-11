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
    actionLabel: "Join Club",
    actionDoneLabel: "Member Joined ✓",
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

  const handleAction = (id: string) => {
    setInteractedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Convert custom user posts into feed items
  const userCustomFeedItems: FeedItem[] = customPosts.map((post) => ({
    id: post.id,
    category: post.type === "events" ? "Hackathon" : "Teammate",
    type: post.type === "events" ? "hackathons" : "teammates",
    title: post.title,
    statusTag: "⚡ Posted Just Now",
    avatar: post.avatar,
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    meta: post.meta,
    description: post.description,
    tags: post.tags,
    actionLabel: post.actionLabel,
    actionDoneLabel: post.actionDoneLabel,
  }));

  const allFeedItems = [...userCustomFeedItems, ...defaultFeedData];

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
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* Welcome Banner */}
        <div className="mb-6 pb-6 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-500/20 mb-2">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                <span>Personalized Feed Active</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Good evening, {userName} 👋
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Here is what is happening on campus based on your interests.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditInterestsOpen(true)}
                className="h-8 text-xs font-medium rounded-lg gap-1.5 cursor-pointer"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>Edit Interests</span>
              </Button>
              <Button
                size="sm"
                onClick={() => setCreateModalOpen(true)}
                className="h-8 text-xs font-semibold rounded-lg gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>New Post</span>
              </Button>
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
                onClick={() => setEditInterestsOpen(true)}
                className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground border border-border/60 hover:border-primary/40 transition-colors cursor-pointer"
                title="Click to edit preferences"
              >
                <span>✨ {interest}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
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
              ⚡ Hackathons
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
              🏛 Clubs
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
              👤 Teammates
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
              🛠 Projects
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

        {/* Feed Cards List */}
        {filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map((item) => {
              const isDone = !!interactedMap[item.id];
              return (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-border/80 bg-card shadow-xs hover:border-primary/40 hover:shadow-xs transition-all duration-200 group"
              >
                {/* Header row: Category Badge + Natural Status Tag (NO PERCENTAGES) */}
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2">
                    {item.avatar ? (
                      <div className="relative">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                          {item.avatar}
                        </span>
                        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-card" />
                      </div>
                    ) : null}
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-md border ${item.badgeColor}`}>
                      {item.category}
                    </span>
                  </div>

                  {/* Clean natural status tag (replaces % match) */}
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/60">
                    {item.statusTag}
                  </span>
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

                {/* Footer: Tags & Interactive Actions */}
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

                  <div className="flex items-center gap-2">
                    {item.actionHref && (
                      <Link href={item.actionHref}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-3 rounded-lg text-xs font-medium"
                        >
                          Details
                        </Button>
                      </Link>
                    )}

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
