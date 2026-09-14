"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AppHeader from "@/components/AppHeader";
import { authClient } from "@/lib/auth";
import type { EventCard as BackendEventCard } from "@repo/schemas";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Search,
  Sparkles,
  Trophy,
  Users,
  Zap,
  Ticket,
  Loader2,
} from "lucide-react";
import { getEventCoverImage } from "@/lib/event-assets";

const ACCENT_STYLES: Record<string, {
  wash: string;
  badge: string;
  dateMonth: string;
}> = {
  blue: {
    wash: "from-blue-500/10 via-blue-500/2 to-transparent dark:from-blue-500/15 dark:via-blue-500/5 dark:to-transparent",
    badge: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-900/60",
    dateMonth: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  },
  emerald: {
    wash: "from-emerald-500/10 via-emerald-500/2 to-transparent dark:from-emerald-500/15 dark:via-emerald-500/5 dark:to-transparent",
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60",
    dateMonth: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  purple: {
    wash: "from-purple-500/10 via-purple-500/2 to-transparent dark:from-purple-500/15 dark:via-purple-500/5 dark:to-transparent",
    badge: "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-900/60",
    dateMonth: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
  },
  amber: {
    wash: "from-amber-500/10 via-amber-500/2 to-transparent dark:from-amber-500/15 dark:via-amber-500/5 dark:to-transparent",
    badge: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900/60",
    dateMonth: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  rose: {
    wash: "from-rose-500/10 via-rose-500/2 to-transparent dark:from-rose-500/15 dark:via-rose-500/5 dark:to-transparent",
    badge: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900/60",
    dateMonth: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  },
};

const ACCENT_KEYS = ["blue", "emerald", "purple", "amber", "rose"];

interface DisplayEvent {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  venue: string;
  host: string;
  coverImage?: string | null;
  date: string;
  monthDay: { month: string; day: string };
  time: string;
  tags: string[];
  spotsRemaining: number;
  prizePool: string;
  price: number;
  isFree: boolean;
  entryFee: string;
  category: string;
  accentColor: string;
}

export default function EventsDirectoryPage() {
  const [events, setEvents] = useState<DisplayEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    authClient
      .getEvents()
      .then((rawEvents) => {
        if (!isMounted) return;
        const mapped: DisplayEvent[] = rawEvents.map((event, index) => {
          const eventDate = new Date(event.date);
          const month = eventDate
            .toLocaleDateString("en-US", { month: "short" })
            .toUpperCase();
          const day = String(eventDate.getDate());
          const dateStr = eventDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          const timeStr = eventDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });
          const isHackathon = event.title.toLowerCase().includes("hackathon");
          const isEsports = event.title.toLowerCase().includes("esports");
          const prize = isHackathon ? "₹50,000" : isEsports ? "₹40,000" : "Free Entry";

          return {
            id: event.id,
            slug: event.id,
            title: event.title,
            subtitle: event.description || "Official campus student event.",
            venue: event.location || "LPU Campus",
            host: event.creator?.name || "Campus Event Board",
            coverImage: (event as any).coverImage || null,
            date: dateStr,
            monthDay: { month, day },
            time: timeStr,
            tags: event.interests.map((i) => i.name),
            spotsRemaining: Math.max(12, 120 - event.registrationCount),
            prizePool: prize,
            price: event.price ?? 0,
            isFree: (event.price ?? 0) === 0,
            entryFee: (event.price ?? 0) === 0 ? "Free Pass" : `₹${event.price}`,
            category: event.interests[0]?.name || "Campus Event",
            accentColor: ACCENT_KEYS[index % ACCENT_KEYS.length] || "blue",
          };
        });
        setEvents(mapped);
      })
      .catch((err) => {
        console.error("Failed to fetch events from API:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    "All",
    "Artificial Intelligence",
    "Web Development",
    "Design",
    "Gaming",
    "Competitive Programming",
    "Cybersecurity",
    "Music",
  ];

  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      selectedCategory === "All" ||
      event.category === selectedCategory ||
      event.tags.includes(selectedCategory);
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      event.title.toLowerCase().includes(query) ||
      event.venue.toLowerCase().includes(query) ||
      event.host.toLowerCase().includes(query) ||
      event.tags.some((tag) => tag.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <AppHeader />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* Hub Header & LPU Brand Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-border/60">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lovely Professional University • Campus Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Campus Events & Hackathons
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
              Discover 48-hour engineering sprints, autonomous robotics challenges, design jams, and university summits across LPU.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-card border border-border/70 text-muted-foreground shadow-2xs">
              <strong className="text-foreground">{filteredEvents.length}</strong> upcoming events
            </span>
          </div>
        </div>

        {/* Unified Toolbar: Categories & Instant Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`h-9 px-3.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-card text-muted-foreground hover:text-foreground border border-border/60 hover:bg-muted/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, venue, block..."
              className="w-full h-9 pl-9 pr-3 text-xs rounded-xl bg-card border border-border/70 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Events Grid (Calibrated for Light & Dark Mode) */}
        {isLoading ? (
          <div className="py-24 text-center">
            <div className="flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground font-medium">
                Loading campus events from database...
              </span>
            </div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-border/80 bg-card/40 my-8">
            <p className="text-sm font-semibold text-foreground mb-1">No campus events match your search</p>
            <p className="text-xs text-muted-foreground mb-4">Try selecting "All" or clearing the search query.</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="rounded-xl text-xs"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5 mb-12">
            {filteredEvents.map((event) => {
              const accent = ACCENT_STYLES[event.accentColor] || ACCENT_STYLES.blue!;
              const coverImg = getEventCoverImage(event.title, event.id, event.coverImage, event.category);

              return (
                <div
                  key={event.id}
                  className="rounded-3xl border border-border/80 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group relative shadow-xs"
                >
                  {/* Event Visual Cover Banner */}
                  <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-muted/40 shrink-0">
                    <img
                      src={coverImg}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-black/60" />

                    {/* Top Row floating badges on banner */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-xs ${accent.badge}`}>
                          {event.category}
                        </span>
                        {event.spotsRemaining <= 20 && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/90 text-white backdrop-blur-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            {event.spotsRemaining} spots left
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-black/70 text-amber-300 backdrop-blur-md border border-white/15 flex items-center gap-1.5 shadow-xs">
                        <Trophy className="w-3 h-3 text-amber-400" />
                        <span>{event.prizePool}</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 relative z-10 flex-1 flex flex-col justify-between pt-4">
                    <div>
                      {/* Anchor: Date Tile + Title + Host */}
                      <div className="flex items-start gap-3.5 mb-3.5">
                        {/* Modern Date Tile (Crisp in Light and Dark Mode) */}
                        <div className="w-12 h-14 rounded-2xl bg-card border border-border/80 shadow-xs flex flex-col items-center justify-center shrink-0 text-center overflow-hidden">
                          <div className={`w-full ${accent.dateMonth} text-[10px] font-black uppercase tracking-wider py-0.5 border-b border-border/50`}>
                            {event.monthDay.month}
                          </div>
                          <div className="text-lg font-black text-foreground leading-none pt-1">
                            {event.monthDay.day}
                          </div>
                        </div>

                        {/* Title & Host */}
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/events/${event.slug}`}
                            className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors hover:underline block leading-snug"
                          >
                            {event.title}
                          </Link>
                          <p className="text-xs text-muted-foreground font-medium mt-0.5 flex items-center gap-1">
                            <Zap className="w-3 h-3 text-primary shrink-0" />
                            <span className="truncate">Hosted by {event.host}</span>
                          </p>
                        </div>
                      </div>

                      {/* Subtitle / Value Pitch */}
                      <p className="text-xs text-foreground/85 leading-relaxed line-clamp-2 mb-3.5 font-normal">
                        {event.subtitle}
                      </p>

                      {/* Metadata Chips: Location + Timing */}
                      <div className="flex flex-wrap items-center gap-2 mb-3.5 text-xs">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/40 text-foreground font-medium border border-border/50 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/40 text-muted-foreground font-medium border border-border/50 text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span>{event.time.split("–")[0]?.trim() || event.time}</span>
                        </div>
                      </div>

                      {/* Semantic Tags */}
                      <div className="flex items-center gap-1.5 flex-wrap mb-4">
                        {event.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground font-medium border border-border/40"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Footer: Registration Price + Balanced Action */}
                    <div className="pt-3.5 border-t border-border/60 flex items-center justify-between gap-3 mt-auto">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                          Entry:
                        </span>
                        <span className="text-sm font-extrabold text-foreground">
                          {event.isFree ? (
                            <span className="text-emerald-600 dark:text-emerald-400">Free Pass</span>
                          ) : (
                            event.entryFee
                          )}
                        </span>
                      </div>

                      <Link href={`/events/${event.slug}`}>
                        <Button
                          size="sm"
                          className="rounded-xl px-4 text-xs font-semibold gap-1.5 shadow-xs cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-muted-foreground border-t border-border/40 bg-muted/10">
        Campusly • LPU Student Event Network
      </footer>
    </div>
  );
}
