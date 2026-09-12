"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/AppHeader";
import { useAuth } from "@/lib/auth-context";
import { useCampusStore } from "@/lib/store";
import { getAnimeAvatar } from "@/lib/avatars";
import { authClient } from "@/lib/auth";
import type { FeedItem as BackendFeedItem, FeedResponse } from "@repo/schemas";
import {
  Calendar,
  ArrowRight,
  Search,
  Plus,
  CheckCheck,
  Sparkles,
  X,
  RotateCcw,
  Bookmark,
  Trophy,
  Loader2,
  AlertCircle,
  Flame,
  Users,
  UserPlus,
  FolderGit2,
  Share2,
  Check,
  SlidersHorizontal,
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
  month?: string;
  day?: string;
  attribution?: string;
}

function mapBackendItemToFeedItem(raw: BackendFeedItem): FeedItem {
  if (raw.type === "event") {
    const eventDate = raw.metadata?.date ? new Date(raw.metadata.date) : null;
    const dateMonth = eventDate
      ? eventDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase()
      : "OCT";
    const dateDay = eventDate ? String(eventDate.getDate()) : "20";

    const metaParts = [
      raw.metadata?.location || "Main Campus Auditorium",
      raw.metadata?.registrationCount !== undefined
        ? `${raw.metadata.registrationCount} registered`
        : "Registration open",
    ].filter(Boolean);

    const isPaid = (raw.metadata as any)?.isPaid;
    const prize = (raw.metadata as any)?.prize || (raw.metadata as any)?.prizePool;
    const statusTag = prize
      ? `₹${prize} Prize Pool`
      : isPaid
      ? "Paid Event Pass"
      : "Free Entry · Open Registration";

    return {
      id: raw.id,
      category: "Hackathon",
      type: "hackathons",
      title: raw.title,
      badgeColor:
        "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200/80 dark:border-blue-900/60",
      statusTag,
      meta: metaParts.join(" · "),
      description: raw.description || "Campus student event.",
      tags: raw.interests ? raw.interests.map((i) => i.name) : [],
      actionLabel: "View Event & Register",
      actionDoneLabel: "Registered ✓",
      actionHref: `/events/${raw.id}`,
      month: dateMonth,
      day: dateDay,
      attribution:
        raw.matchedInterests && raw.matchedInterests.length > 0
          ? `Matched: ${raw.matchedInterests.slice(0, 2).join(" · ")}`
          : undefined,
    };
  } else {
    // Club
    const memberCount = raw.metadata?.memberCount ?? 0;
    const metaParts = [
      raw.metadata?.creatorName
        ? `Led by ${raw.metadata.creatorName}`
        : "Official Campus Club",
      "Weekly Sprints & Workshops",
    ].filter(Boolean);

    return {
      id: raw.id,
      category: "Club",
      type: "clubs",
      title: raw.title,
      badgeColor:
        "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200/80 dark:border-purple-900/60",
      statusTag:
        memberCount > 0 ? `${memberCount} Active Members` : "Recruiting Members",
      meta: metaParts.join(" · "),
      description: raw.description || "Campus student organization.",
      tags: raw.interests ? raw.interests.map((i) => i.name) : [],
      actionLabel: "View Club & Join",
      actionDoneLabel: "Member Joined ✓",
      actionHref: `/clubs/${raw.id}`,
      attribution:
        raw.matchedInterests && raw.matchedInterests.length > 0
          ? `Matched: ${raw.matchedInterests.slice(0, 2).join(" · ")}`
          : undefined,
    };
  }
}

export default function FeedPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const {
    userName,
    interests,
    customPosts,
    setCreateModalOpen,
    setEditInterestsOpen,
  } = useCampusStore();

  const [backendFeedItems, setBackendFeedItems] = useState<FeedItem[]>([]);
  const [hasPersonalizedResults, setHasPersonalizedResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<
    "all" | "hackathons" | "clubs" | "teammates" | "projects"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [interactedMap, setInteractedMap] = useState<Record<string, boolean>>({});
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace("/login?redirect=/feed");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  const fetchFeed = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const store = useCampusStore.getState();
      const res: FeedResponse = await authClient.getFeed(
        store.interestIds,
        store.interests
      );
      const mapped = res.items.map(mapBackendItemToFeedItem);
      setBackendFeedItems(mapped);
      setHasPersonalizedResults(res.hasPersonalizedResults);
    } catch (err: any) {
      setError(
        err?.message || "Failed to load feed opportunities. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();

    const handlePreferencesUpdated = () => {
      fetchFeed();
    };

    if (typeof window !== "undefined") {
      window.addEventListener(
        "campusly:preferences-updated",
        handlePreferencesUpdated
      );
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "campusly:preferences-updated",
          handlePreferencesUpdated
        );
      }
    };
  }, [fetchFeed, isAuthenticated]);

  const handleAction = (id: string) => {
    setInteractedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSave = (id: string) => {
    setSavedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleShare = (item: FeedItem) => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}${item.actionHref || "/feed"}`;
      navigator.clipboard.writeText(url);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  // Convert custom user posts into feed items
  const userCustomFeedItems: FeedItem[] = customPosts.map((post) => {
    let category: "Hackathon" | "Club" | "Teammate" | "Project" = "Teammate";
    let type: "hackathons" | "clubs" | "teammates" | "projects" = "teammates";
    let badgeColor =
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";

    if (post.type === "events") {
      category = "Hackathon";
      type = "hackathons";
      badgeColor =
        "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200/80 dark:border-blue-900/60";
    } else if (post.type === "clubs") {
      category = "Club";
      type = "clubs";
      badgeColor =
        "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200/80 dark:border-purple-900/60";
    } else if (post.type === "projects") {
      category = "Project";
      type = "projects";
      badgeColor =
        "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200/80 dark:border-amber-900/60";
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

  const allFeedItems = [...userCustomFeedItems, ...backendFeedItems];

  const hackathonsCount = allFeedItems.filter(
    (i) => i.type === "hackathons"
  ).length;
  const clubsCount = allFeedItems.filter((i) => i.type === "clubs").length;
  const teammatesCount = allFeedItems.filter(
    (i) => i.type === "teammates"
  ).length;
  const projectsCount = allFeedItems.filter(
    (i) => i.type === "projects"
  ).length;

  const filteredItems = allFeedItems.filter((item) => {
    const matchesTab = activeTab === "all" || item.type === activeTab;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  if (isAuthLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
        <AppHeader />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs font-medium">Checking authorization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AppHeader />

      {/* Main Feed Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* Streamlined Clean Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Good evening, {userName} 👋
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {allFeedItems.length} Opportunities
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {hasPersonalizedResults
                ? "Personalized based on your campus interests in "
                : "Discovering verified campus hackathons, clubs, and peers"}
              {hasPersonalizedResults && (
                <span className="text-foreground/90 font-medium">
                  {(interests.length > 0 ? interests : ["Artificial Intelligence", "Web Development", "Startups"])
                    .slice(0, 3)
                    .join(", ")}
                </span>
              )}
            </p>
          </div>

          {/* Clean Integrated Tag Trigger */}
          <button
            type="button"
            onClick={() => setEditInterestsOpen(true)}
            className="h-9 px-3.5 rounded-xl border border-border/70 bg-card hover:bg-muted/60 flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-all cursor-pointer self-start sm:self-auto shadow-2xs group shrink-0"
            title="Edit your interest tags"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary group-hover:rotate-12 transition-transform" />
            <span className="font-semibold text-foreground text-xs">
              Preferences
            </span>
            <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground font-mono">
              {(interests.length > 0 ? interests.length : 3)} Tags
            </span>
          </button>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-border/50">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                activeTab === "all"
                  ? "bg-foreground text-background shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>All Matches</span>
              <span className="text-[11px] opacity-75 font-mono">({allFeedItems.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("hackathons")}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                activeTab === "hackathons"
                  ? "bg-foreground text-background shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-blue-500" />
              <span>Hackathons</span>
              <span className="text-[11px] opacity-75 font-mono">({hackathonsCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("clubs")}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                activeTab === "clubs"
                  ? "bg-foreground text-background shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium"
              }`}
            >
              <Users className="w-3.5 h-3.5 text-purple-500" />
              <span>Clubs</span>
              <span className="text-[11px] opacity-75 font-mono">({clubsCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("teammates")}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                activeTab === "teammates"
                  ? "bg-foreground text-background shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-500" />
              <span>Teammates</span>
              {teammatesCount > 0 ? (
                <span className="text-[11px] opacity-75 font-mono">({teammatesCount})</span>
              ) : (
                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-md">
                  Squads
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("projects")}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                activeTab === "projects"
                  ? "bg-foreground text-background shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium"
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5 text-amber-500" />
              <span>Projects</span>
              {projectsCount > 0 ? (
                <span className="text-[11px] opacity-75 font-mono">({projectsCount})</span>
              ) : (
                <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded-md">
                  Build
                </span>
              )}
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
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs font-semibold rounded-lg shrink-0 gap-1 cursor-pointer"
              >
                <span>Register Club</span>
                <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/25 text-destructive text-xs font-medium flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={fetchFeed}
              className="h-7 text-xs font-semibold cursor-pointer"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-4 py-8">
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs font-medium">
                Curating personalized campus opportunities...
              </span>
            </div>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map((item) => {
              const isDone = !!interactedMap[item.id];
              const isSaved = !!savedMap[item.id];

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl border border-border/80 bg-card shadow-xs hover:border-primary/40 hover:shadow-md hover:bg-card/95 transition-all duration-200 group"
                >
                  <div className="flex items-start gap-4">
                    {/* Visual Anchor */}
                    {item.category === "Hackathon" ? (
                      <div className="w-13 h-13 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex flex-col items-center justify-center shrink-0 shadow-inner">
                        <span className="text-[10px] uppercase font-extrabold tracking-wider leading-none">
                          {item.month || "OCT"}
                        </span>
                        <span className="text-lg font-black leading-none mt-1 text-foreground">
                          {item.day || "20"}
                        </span>
                      </div>
                    ) : item.category === "Club" ? (
                      <div className="w-13 h-13 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                        {item.title.toLowerCase().includes("ai") ||
                        item.title.toLowerCase().includes("robot")
                          ? "🤖"
                          : item.title.toLowerCase().includes("design")
                          ? "🎨"
                          : item.title.toLowerCase().includes("ecell") ||
                            item.title.toLowerCase().includes("startup")
                          ? "🚀"
                          : "🏛️"}
                      </div>
                    ) : item.category === "Teammate" ? (
                      <div className="relative w-13 h-13 rounded-2xl border border-emerald-500/25 overflow-hidden shrink-0 bg-muted/20">
                        <img
                          src={getAnimeAvatar(
                            item.actionHref?.replace("/people/", "") || item.id,
                            item.title
                          )}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <span
                          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card"
                          title="Active student"
                        />
                      </div>
                    ) : (
                      <div className="w-13 h-13 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                        🚀
                      </div>
                    )}

                    {/* Card Content Area */}
                    <div className="flex-1 min-w-0">
                      {/* Category Badge + Status Tag + Attribution + Actions */}
                      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-md border ${item.badgeColor}`}
                          >
                            {item.category}
                          </span>
                          <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/60">
                            {item.statusTag}
                          </span>
                          {item.attribution && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md">
                              <Sparkles className="w-3 h-3" />
                              <span>{item.attribution}</span>
                            </span>
                          )}
                        </div>

                        {/* Save & Share Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleShare(item)}
                            className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted/60 cursor-pointer"
                            title="Share opportunity link"
                          >
                            {copiedId === item.id ? (
                              <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" />
                                <span>Copied</span>
                              </span>
                            ) : (
                              <Share2 className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleSave(item.id)}
                            className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-muted/60 cursor-pointer"
                            title={isSaved ? "Saved" : "Save opportunity"}
                          >
                            <Bookmark
                              className={`w-3.5 h-3.5 ${
                                isSaved ? "fill-primary text-primary" : ""
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {item.actionHref ? (
                          <Link
                            href={item.actionHref}
                            className="hover:underline"
                          >
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
                            const isPrize = tag
                              .toLowerCase()
                              .includes("prize");
                            const isOpenSpot =
                              tag.toLowerCase().includes("spot") ||
                              tag.toLowerCase().includes("recruiting");
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
                                {isPrize && (
                                  <Trophy className="w-3 h-3 text-amber-500" />
                                )}
                                {isOpenSpot && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                )}
                                {tag}
                              </span>
                            );
                          })}
                        </div>

                        {/* Decisive CTA Button */}
                        <div className="shrink-0 flex items-center justify-end">
                          {item.actionHref && !isDone ? (
                            <Link href={item.actionHref}>
                              <Button
                                size="sm"
                                className="h-8.5 px-4 rounded-xl text-xs font-semibold gap-1.5 shadow-xs cursor-pointer"
                              >
                                <span>{item.actionLabel}</span>
                                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                              </Button>
                            </Link>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleAction(item.id)}
                              className={`h-8.5 px-4 rounded-xl text-xs font-semibold gap-1.5 transition-all cursor-pointer ${
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
                                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
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
        ) : activeTab === "teammates" ? (
          <div className="py-12 px-6 rounded-3xl border border-dashed border-emerald-500/30 bg-emerald-500/[0.03] text-center max-w-lg mx-auto my-6 animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-1">
              Looking for Hackathon & Project Teammates?
            </h3>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              Connect with verified student builders in the People directory or post your squad requirements on Campusly to recruit engineers and designers.
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Link href="/people">
                <Button size="sm" variant="outline" className="h-8.5 text-xs rounded-xl font-semibold gap-1.5 cursor-pointer">
                  <Users className="w-3.5 h-3.5" />
                  <span>Explore People Directory</span>
                </Button>
              </Link>
              <Button size="sm" onClick={() => setCreateModalOpen(true, "teammate")} className="h-8.5 text-xs rounded-xl font-semibold gap-1.5 cursor-pointer">
                <UserPlus className="w-3.5 h-3.5" />
                <span>Find Teammates</span>
              </Button>
            </div>
          </div>
        ) : activeTab === "projects" ? (
          <div className="py-12 px-6 rounded-3xl border border-dashed border-amber-500/30 bg-amber-500/[0.03] text-center max-w-lg mx-auto my-6 animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-1">
              Campus Project Showcases
            </h3>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              Showcase what you are building, demo open-source campus tools, and find student feedback or contributors.
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Button size="sm" onClick={() => setCreateModalOpen(true, "project")} className="h-8.5 text-xs rounded-xl font-semibold gap-1.5 cursor-pointer">
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>Share Project</span>
              </Button>
            </div>
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
                : hasPersonalizedResults
                ? "No matching opportunities in this category right now. Check back soon or create a post!"
                : "No campus posts in this category yet. Be the first to share an opportunity!"}
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
