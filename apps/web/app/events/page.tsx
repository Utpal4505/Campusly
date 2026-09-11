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
  Filter,
} from "lucide-react";

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
        
        {/* Hub Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-border/60">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lovely Professional University</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Campus Events & Hackathons
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
              Discover engineering sprints, robotics battles, design jams, and flagship summits happening across LPU campus.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-card border border-border/70 text-muted-foreground shadow-2xs">
              <strong className="text-foreground">{filteredEvents.length}</strong> upcoming events
            </span>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
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

        {/* Events Grid */}
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
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl border border-border/80 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Top Ambient Card Banner */}
                  <div className={`h-28 bg-gradient-to-r ${event.gradient} p-4 flex flex-col justify-between relative overflow-hidden border-b border-border/50`}>
                    <div className="flex items-center justify-between gap-2 relative z-10">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md ${event.categoryBadge}`}>
                        {event.category}
                      </span>

                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/10 flex items-center gap-1">
                        <Trophy className="w-3 h-3 text-amber-400" />
                        <span>{event.prizePool}</span>
                      </span>
                    </div>

                    <div className="relative z-10">
                      <p className="text-xs font-semibold text-white/80 line-clamp-1">
                        {event.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    {/* Date Block + Title */}
                    <div className="flex items-start gap-3.5 mb-3">
                      {/* Date Badge */}
                      <div className="w-12 h-13 rounded-xl bg-muted/40 border border-border/70 flex flex-col items-center justify-center shrink-0 text-center py-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary leading-none">
                          {event.monthDay.month}
                        </span>
                        <span className="text-lg font-black text-foreground leading-tight mt-0.5">
                          {event.monthDay.day}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <Link
                          href={`/events/${event.slug}`}
                          className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 hover:underline"
                        >
                          {event.title}
                        </Link>
                        <div className="text-xs text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                          <Zap className="w-3 h-3 text-primary shrink-0" />
                          <span className="truncate">Hosted by {event.host}</span>
                        </div>
                      </div>
                    </div>

                    {/* Venue & Time Badges */}
                    <div className="space-y-1.5 mb-3.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="font-semibold text-foreground truncate">{event.venue}</span>
                        <span className="text-[11px] text-muted-foreground truncate hidden sm:inline">
                          ({event.venueLandmark})
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span>{event.date} · {event.time}</span>
                      </div>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-foreground/80 leading-relaxed line-clamp-2 mb-4">
                      {event.about}
                    </p>

                    {/* Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {event.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium border border-border/40"
                        >
                          {tag}
                        </span>
                      ))}
                      {event.spotsRemaining <= 20 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold border border-rose-500/20">
                          {event.spotsRemaining} spots left
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Entry Fee & Action */}
                <div className="px-5 py-3.5 border-t border-border/50 bg-muted/10 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold block leading-none">
                      Registration
                    </span>
                    <span className="text-sm font-extrabold text-foreground">
                      {event.entryFee}
                    </span>
                  </div>

                  <Link href={`/events/${event.slug}`}>
                    <Button
                      size="sm"
                      className="rounded-xl text-xs font-semibold gap-1.5 shadow-xs cursor-pointer group-hover:bg-primary group-hover:text-primary-foreground"
                    >
                      <span>View & Register</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
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
