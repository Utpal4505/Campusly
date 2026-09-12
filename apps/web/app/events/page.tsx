"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AppHeader from "@/components/AppHeader";
import { LPU_EVENTS_LIST, CampusEvent } from "@/lib/events-data";
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
} from "lucide-react";

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

export default function EventsDirectoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = ["All", "Hackathon", "Robotics", "Design", "Fest & Culture"];

  const filteredEvents = LPU_EVENTS_LIST.filter((event) => {
    const matchesCategory =
      selectedCategory === "All" || event.category === selectedCategory;
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
        {filteredEvents.length === 0 ? (
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
              return (
                <div
                  key={event.id}
                  className="rounded-3xl border border-border/80 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group relative shadow-xs"
                >
                  {/* Smooth Ambient Glow Header (Clean pastel in light mode, luminous in dark mode) */}
                  <div className={`absolute top-0 left-0 right-0 h-40 bg-gradient-to-b ${accent.wash} pointer-events-none`} />

                  <div className="p-5 sm:p-6 relative z-10 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Top Row: Category Pill + Prize / Spots Badge */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${accent.badge}`}>
                            {event.category}
                          </span>
                          {event.spotsRemaining <= 20 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                              {event.spotsRemaining} spots left
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60 flex items-center gap-1.5 shadow-2xs">
                          <Trophy className="w-3 h-3 text-amber-500" />
                          <span>{event.prizePool}</span>
                        </span>
                      </div>

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
