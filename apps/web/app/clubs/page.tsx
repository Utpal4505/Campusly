"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/AppHeader";
import { authClient } from "@/lib/auth";
import type { ClubCard as BackendClubCard } from "@repo/schemas";
import {
  Building2,
  Users,
  Search,
  Sparkles,
  ArrowRight,
  Plus,
  Loader2,
  X,
  RotateCcw,
  Check,
  ShieldCheck,
} from "lucide-react";
import ClubAvatar from "@/components/ClubAvatar";
import { getClubTheme } from "@/lib/avatars";
import { getClubCoverImage } from "@/lib/club-assets";


const CLUB_CATEGORIES = [
  "All",
  "Tech & AI",
  "Design & Creative",
  "Startups & E-Cell",
  "Security & Systems",
  "Media & Culture",
];

export default function ClubsDirectoryPage() {
  const [clubs, setClubs] = useState<BackendClubCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    let isMounted = true;
    authClient
      .getClubs()
      .then((data) => {
        if (isMounted) setClubs(data || []);
      })
      .catch((err) => {
        console.error("Failed to load clubs:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);


  const filteredClubs = clubs.filter((club) => {
    const nameMatch = club.name.toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = (club.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const tagsMatch = club.interests?.some((i) =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const matchesSearch = nameMatch || descMatch || tagsMatch;

    if (!matchesSearch) return false;
    if (activeCategory === "All") return true;

    const lowerName = club.name.toLowerCase();
    const tagNames = (club.interests || []).map((i) => i.name.toLowerCase()).join(" ");

    const clubTheme = getClubTheme(club.name, club.interests);
    if (activeCategory === "Tech & AI") {
      return (
        clubTheme.domain === "Tech & AI" ||
        clubTheme.domain === "Software & Coding" ||
        clubTheme.domain === "Quantum Computing"
      );
    }
    if (activeCategory === "Design & Creative") {
      return clubTheme.domain === "Design & Creative";
    }
    if (activeCategory === "Startups & E-Cell") {
      return (
        clubTheme.domain === "Startups & E-Cell" ||
        clubTheme.domain === "Blockchain & FinTech"
      );
    }
    if (activeCategory === "Security & Systems") {
      return clubTheme.domain === "Security & Systems";
    }
    if (activeCategory === "Media & Culture") {
      return (
        clubTheme.domain === "Media & Culture" ||
        clubTheme.domain === "Music & Audio" ||
        clubTheme.domain === "Gaming & Esports" ||
        clubTheme.domain === "Athletics & Sports"
      );
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <AppHeader />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Student Clubs & Societies
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                {clubs.length} Verified Organizations
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Discover student-led engineering societies, creative guilds, and hackathon squads across campus.
            </p>
          </div>

          <Link href="/clubs/register" className="shrink-0 self-start sm:self-auto">
            <Button
              size="sm"
              className="h-9 px-4 rounded-xl text-xs font-semibold gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register New Club</span>
            </Button>
          </Link>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {CLUB_CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? "bg-foreground text-background font-bold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clubs, tags, leads..."
              className="w-full h-8.5 pl-8 pr-7 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Clubs Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
            <Loader2 className="w-7 h-7 animate-spin text-primary" />
            <span className="text-xs font-medium">Loading verified campus clubs...</span>
          </div>
        ) : filteredClubs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClubs.map((club) => {
              const memberCount = club.memberCount ?? 0;
              const creatorName = club.creator?.name || "Campus Student Board";
              const coverImg = getClubCoverImage(club.name, club.id, club.coverImage);

              return (
                <div
                  key={club.id}
                  className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-xs hover:border-primary/40 hover:shadow-md hover:bg-card/95 transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Cover Banner */}
                    <div className="relative h-28 w-full overflow-hidden bg-muted/40">
                      <img
                        src={coverImg}
                        alt={club.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20">
                        <Users className="w-3 h-3 text-purple-300" />
                        <span>{memberCount > 0 ? `${memberCount} Members` : "Recruiting"}</span>
                      </span>
                    </div>

                    <div className="p-5 pt-0">
                      {/* Logo Emblem overlapping banner */}
                      <div className="-mt-7 mb-3 flex items-end justify-between">
                        <ClubAvatar
                          clubName={club.name}
                          clubId={club.id}
                          customAvatarUrl={club.logo}
                          interests={club.interests}
                          size="md"
                          className="ring-4 ring-card shadow-md"
                        />
                      </div>

                      {/* Club Title */}
                      <h3 className="text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
                        <Link href={`/clubs/${club.id}`} className="hover:underline">
                          {club.name}
                        </Link>
                      </h3>

                      {/* Organizer Meta */}
                      <p className="text-[11px] text-muted-foreground font-medium mb-2.5">
                        Led by <span className="text-foreground/80 font-semibold">{creatorName}</span>
                      </p>

                      {/* Description */}
                      <p className="text-xs text-foreground/80 leading-relaxed mb-4 line-clamp-2">
                        {club.description || "Student-led campus organization focused on collaborative innovation and skill development."}
                      </p>
                    </div>
                  </div>

                  <div>
                    {/* Tags */}
                    {club.interests && club.interests.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap mb-4 pt-3 border-t border-border/50">
                        {club.interests.slice(0, 3).map((interest) => (
                          <span
                            key={interest.id}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground border border-border/40"
                          >
                            {interest.name}
                          </span>
                        ))}
                        {club.interests.length > 3 && (
                          <span className="text-[10px] text-muted-foreground font-mono">
                            +{club.interests.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* CTA Button (Resilient styling - no hover blackout) */}
                    <Link href={`/clubs/${club.id}`} className="block">
                      <Button
                        size="sm"
                        className="w-full h-9 rounded-xl text-xs font-semibold gap-1.5 bg-secondary text-foreground hover:bg-foreground hover:text-background border border-border/80 hover:border-foreground/80 group-hover:border-foreground/30 transition-all duration-200 cursor-pointer shadow-xs group/btn"
                      >
                        <span>View Club & Join</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1 group-hover:translate-x-0.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 px-6 rounded-3xl border border-dashed border-border bg-card text-center max-w-md mx-auto my-8 animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3 text-muted-foreground">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-1">
              No student clubs found
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              {searchQuery
                ? `No clubs matching "${searchQuery}". Try a different keyword or reset filters.`
                : "No clubs in this category yet. Be the first to register a student society!"}
            </p>
            <div className="flex items-center justify-center gap-2">
              {searchQuery && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                  className="h-8 text-xs rounded-xl gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Search</span>
                </Button>
              )}
              <Link href="/clubs/register">
                <Button size="sm" className="h-8 text-xs rounded-xl font-semibold gap-1.5 cursor-pointer">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register Club</span>
                </Button>
              </Link>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-muted-foreground border-t border-border/40 mt-12 bg-muted/20">
        Campusly • Verified Campus Clubs Directory
      </footer>
    </div>
  );
}
