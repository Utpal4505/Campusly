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
import type { FeedItem as BackendFeedItem, FeedResponse, TicketItem, UserCard } from "@repo/schemas";
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
  Ticket,
  Zap,
  Building2,
  Users,
  MessageSquare,
  MapPin,
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
      raw.metadata?.location ? `📍 ${raw.metadata.location}` : null,
      raw.metadata?.registrationCount !== undefined
        ? `${raw.metadata.registrationCount} registered`
        : null,
    ].filter(Boolean);

    return {
      id: raw.id,
      category: "Hackathon",
      type: "hackathons",
      title: raw.title,
      badgeColor:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      statusTag: raw.metadata?.date
        ? new Date(raw.metadata.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : "Upcoming Event",
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
          ? `Matched for ${raw.matchedInterests.slice(0, 2).join(", ")}`
          : undefined,
    };
  } else {
    // Club
    const memberCount = raw.metadata?.memberCount ?? 0;
    const metaParts = [
      raw.metadata?.creatorName
        ? `Led by ${raw.metadata.creatorName}`
        : "Official Campus Club",
      memberCount > 0 ? `${memberCount} Members` : "Recruiting Members",
    ].filter(Boolean);

    return {
      id: raw.id,
      category: "Club",
      type: "clubs",
      title: raw.title,
      badgeColor:
        "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      statusTag:
        memberCount > 0 ? `${memberCount} Members` : "Recruiting Members",
      meta: metaParts.join(" · "),
      description: raw.description || "Campus student organization.",
      tags: raw.interests ? raw.interests.map((i) => i.name) : [],
      actionLabel: "View Club & Join",
      actionDoneLabel: "Member Joined ✓",
      actionHref: `/clubs/${raw.id}`,
      attribution:
        raw.matchedInterests && raw.matchedInterests.length > 0
          ? `Matched for ${raw.matchedInterests.slice(0, 2).join(", ")}`
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

  // Sidebar dynamic data
  const [upcomingTicket, setUpcomingTicket] = useState<TicketItem | null>(null);
  const [suggestedPeers, setSuggestedPeers] = useState<UserCard[]>([]);

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

  // Fetch sidebar fast-pass and suggested peers
  useEffect(() => {
    let isMounted = true;
    authClient
      .getTickets()
      .then((tickets) => {
        if (isMounted && Array.isArray(tickets) && tickets.length > 0) {
          setUpcomingTicket(tickets[0] || null);
        }
      })
      .catch(() => {});

    authClient
      .getUsers()
      .then((users) => {
        if (isMounted && Array.isArray(users) && users.length > 0) {
          setSuggestedPeers(users.slice(0, 3));
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

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
    let badgeColor =
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";

    if (post.type === "events") {
      category = "Hackathon";
      type = "hackathons";
      badgeColor =
        "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    } else if (post.type === "clubs") {
      category = "Club";
      type = "clubs";
      badgeColor =
        "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
    } else if (post.type === "projects") {
      category = "Project";
      type = "projects";
      badgeColor =
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
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

      {/* Main Feed Container (Wide 7XL Viewport for Two-Column Studio) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Streamlined Clean Greeting Bar */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/60">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Good evening, {userName} 👋
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {allFeedItems.length} campus opportunities live
              </span>
              <span className="text-border">•</span>
              <span>
                {hasPersonalizedResults
                  ? "Personalized for your campus interests"
                  : "Discovering campus opportunities"}
              </span>
            </p>
          </div>

          {/* Action Row: Interest Pill + Create Post Button */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => setEditInterestsOpen(true)}
              className="h-8 px-3 rounded-xl border border-border/70 bg-card hover:bg-muted/50 flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-2xs group shrink-0"
              title="Edit your interest tags"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary group-hover:rotate-12 transition-transform" />
              <span className="font-semibold text-foreground text-xs">
                {(interests.length > 0 ? interests : ["Artificial Intelligence", "Web Development", "Startups"])
                  .slice(0, 3)
                  .join(", ")}
                {interests.length > 3 && ` +${interests.length - 3}`}
              </span>
              <span className="text-[11px] text-primary underline underline-offset-2 pl-0.5">
                Edit
              </span>
            </button>

            <Button
              size="sm"
              onClick={() => setCreateModalOpen(true)}
              className="h-8 px-3.5 text-xs font-bold rounded-xl gap-1.5 shadow-xs cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post</span>
            </Button>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === "all"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              All Matches ({allFeedItems.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("hackathons")}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer shrink-0 ${
                activeTab === "hackathons"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              ⚡ Hackathons ({hackathonsCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("clubs")}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer shrink-0 ${
                activeTab === "clubs"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              🏛 Clubs ({clubsCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("teammates")}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer shrink-0 ${
                activeTab === "teammates"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              👥 Teammates ({teammatesCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("projects")}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer shrink-0 ${
                activeTab === "projects"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              🛠 Projects ({projectsCount})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search opportunities, venues..."
              className="w-full h-8 pl-8 pr-7 text-xs bg-muted/40 rounded-xl border border-border/60 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60 transition-colors"
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

        {/* =================================================================
            OPTION A: TWO-COLUMN CAMPUS STUDIO (70% FEED / 30% STICKY SIDEBAR)
        ================================================================== */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Main Opportunity Feed (8 Columns) */}
          <div className="lg:col-span-8 space-y-4">
            
            {isLoading ? (
              <div className="space-y-4 py-8">
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
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
                      className="p-5 rounded-2xl border border-border/80 bg-card shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200 group"
                    >
                      {/* Top Row: Category + Single Attribution + Bookmark */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`inline-flex items-center text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-lg border ${item.badgeColor}`}
                          >
                            {item.category === "Hackathon"
                              ? "⚡ Hackathon"
                              : item.category === "Club"
                              ? "🏛️ Club"
                              : item.category === "Teammate"
                              ? "👥 Teammate"
                              : "🛠️ Project"}
                          </span>

                          {item.attribution && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                              <Sparkles className="w-3 h-3 text-primary shrink-0" />
                              <span>{item.attribution}</span>
                            </span>
                          )}
                        </div>

                        {/* Save / Bookmark Button */}
                        <button
                          type="button"
                          onClick={() => toggleSave(item.id)}
                          className="text-muted-foreground hover:text-primary transition-colors p-1 rounded-md hover:bg-muted/60 cursor-pointer"
                          title={isSaved ? "Saved" : "Save opportunity"}
                        >
                          <Bookmark
                            className={`w-4 h-4 ${
                              isSaved ? "fill-primary text-primary" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {/* Content Row: Visual Anchor + Title & Description */}
                      <div className="flex items-start gap-4">
                        
                        {/* Visual Anchor */}
                        {item.category === "Hackathon" ? (
                          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-600 dark:text-blue-400 flex flex-col items-center justify-center shrink-0">
                            <span className="text-[9px] uppercase font-extrabold tracking-wider leading-none">
                              {item.month || "OCT"}
                            </span>
                            <span className="text-base font-black leading-none mt-1">
                              {item.day || "20"}
                            </span>
                          </div>
                        ) : item.category === "Club" ? (
                          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl shrink-0">
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
                          <div className="relative w-12 h-12 rounded-xl border border-emerald-500/25 overflow-hidden shrink-0 bg-muted/20">
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
                          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl shrink-0">
                            🚀
                          </div>
                        )}

                        {/* Title, Meta, and Line-Clamped Description */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-foreground mb-0.5 group-hover:text-primary transition-colors">
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

                          {/* Clean Non-Redundant Meta Details */}
                          <p className="text-xs text-muted-foreground font-medium mb-2">
                            {item.meta}
                          </p>

                          {/* Typographically Balanced Description */}
                          <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed line-clamp-2 sm:line-clamp-3">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer: Tags & Decisive CTA */}
                      <div className="mt-4 pt-3.5 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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

                        {/* Action CTA Button */}
                        <div className="shrink-0 flex items-center justify-end">
                          {item.actionHref && !isDone ? (
                            <Link href={item.actionHref}>
                              <Button
                                size="sm"
                                className="h-8 px-4 rounded-xl text-xs font-bold gap-1.5 shadow-xs cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
                              >
                                <span>{item.actionLabel}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Button>
                            </Link>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleAction(item.id)}
                              className={`h-8 px-4 rounded-xl text-xs font-bold gap-1.5 transition-all cursor-pointer ${
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

          </div>

          {/* RIGHT COLUMN: Sticky Campus Studio Sidebar (4 Columns) */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-20">
            
            {/* Widget 1: Campus Activity Pulse */}
            <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Campus Pulse
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Live
                </span>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/50">
                  <span className="text-muted-foreground">Students in Block 32/34</span>
                  <span className="font-bold text-foreground">480+ Online</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/50">
                  <span className="text-muted-foreground">Upcoming Hackathons</span>
                  <span className="font-bold text-primary">{hackathonsCount} Events</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/50">
                  <span className="text-muted-foreground">Active Campus Clubs</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">{clubsCount} Clubs</span>
                </div>
              </div>
            </div>

            {/* Widget 2: Fast Ticket Pass Shortcut */}
            {upcomingTicket ? (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/[0.06] via-card to-card border border-primary/25 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Your Entrance Pass</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    CONFIRMED ✓
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-foreground line-clamp-1">
                    {upcomingTicket.event?.title || "Registered Campus Event"}
                  </h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span>
                      {upcomingTicket.event?.date
                        ? new Date(upcomingTicket.event.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "Upcoming"} · {upcomingTicket.event?.location || "Block 34"}
                    </span>
                  </p>
                </div>

                <div className="pt-2 border-t border-dashed border-border/70 flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] font-bold text-primary">
                    #{upcomingTicket.ticketNumber}
                  </span>
                  <Link
                    href={`/tickets/${upcomingTicket.id}`}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>View Pass</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-primary" />
                    <span>Digital Event Passes</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground">0 passes</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Register for campus hackathons to automatically receive verified QR entrance passes.
                </p>
                <Link href="/events" className="inline-block pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs font-semibold rounded-lg gap-1 cursor-pointer"
                  >
                    <span>Explore Events</span>
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            )}

            {/* Widget 3: Suggested Student Peers */}
            <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  <span>Student Peers</span>
                </span>
                <Link href="/people" className="text-[11px] font-semibold text-primary hover:underline">
                  View all →
                </Link>
              </div>

              <div className="space-y-3">
                {(suggestedPeers.length > 0
                  ? suggestedPeers
                  : [
                      {
                        id: "seed-student-1",
                        name: "Rahul Sharma",
                        username: "rahul_dev",
                        department: "CSE · AI & Agents",
                      },
                      {
                        id: "seed-student-2",
                        name: "Ananya Singh",
                        username: "ananya_singh",
                        department: "Design · UI/UX",
                      },
                      {
                        id: "seed-student-3",
                        name: "Dev Kapoor",
                        username: "dev_kapoor",
                        department: "Full-Stack · Web3",
                      },
                    ]
                ).map((peer: any) => (
                  <div key={peer.id} className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-border/80 shrink-0 bg-muted/20">
                        <img
                          src={getAnimeAvatar(peer.username || peer.id, peer.name)}
                          alt={peer.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-foreground truncate">
                          {peer.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">
                          @{peer.username || "student"} · {peer.department?.split("·")[0] || "CSE"}
                        </div>
                      </div>
                    </div>

                    <Link href={`/messages/${peer.username || peer.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2.5 text-[11px] font-semibold rounded-lg gap-1 cursor-pointer hover:border-primary/50 shrink-0"
                      >
                        <MessageSquare className="w-3 h-3 text-primary" />
                        <span>Chat</span>
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 4: Club Organizer Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/[0.05] via-card to-card border border-purple-500/25 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>Lead a Campus Club?</span>
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Recruit student builders, organize technical workshops, and host hackathons.
              </p>
              <Link href="/clubs/register" className="inline-block pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs font-semibold rounded-lg gap-1 border-purple-500/30 text-purple-600 dark:text-purple-300 hover:bg-purple-500/10 cursor-pointer"
                >
                  <span>Register Club</span>
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-muted-foreground border-t border-border/40 mt-12 bg-muted/20">
        Campusly • Curated campus network feed
      </footer>
    </div>
  );
}
