"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/AppHeader";
import { getAnimeAvatar } from "@/lib/avatars";
import { authClient } from "@/lib/auth";
import type { UserCard } from "@repo/schemas";
import {
  ArrowLeft,
  Search,
  MessageSquare,
  UserCheck,
  UserPlus,
  Sparkles,
  Check,
  Loader2,
} from "lucide-react";

interface Peer {
  id: string;
  slug: string;
  name: string;
  avatar: string;
  role: string;
  bio: string;
  tags: string[];
}

export default function PeoplePage() {
  const [dbUsers, setDbUsers] = useState<UserCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [connectedMap, setConnectedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    authClient
      .getUsers()
      .then((users) => {
        if (!isMounted) return;
        setDbUsers(users);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn("Failed to fetch live campus students:", err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filterTags = [
    "All",
    "Artificial Intelligence",
    "Web Development",
    "Design",
    "Startups",
    "Robotics",
    "Open Source",
  ];

  const toggleConnect = (id: string) => {
    setConnectedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const peers: Peer[] = dbUsers.map((user) => {
    const slug = user.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const initials = user.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
    const tags =
      user.interests && user.interests.length > 0
        ? user.interests.map((i: { id: string; name: string }) => i.name)
        : ["Campus Student"];
    const role = [
      user.department || "LPU Student",
      user.yearOfStudy ? `Year ${user.yearOfStudy}` : null,
      tags.slice(0, 2).join(" · "),
    ]
      .filter(Boolean)
      .join(" · ");

    return {
      id: user.id,
      slug: slug || user.id,
      name: user.name,
      avatar: initials || "ST",
      role,
      bio:
        user.bio ||
        `“Passionate student interested in ${tags.slice(0, 3).join(", ")}. Looking to collaborate on campus projects!”`,
      tags,
    };
  });

  const filteredPeers = peers.filter((p) => {
    const matchesTag =
      selectedTag === "All" ||
      p.tags.some(
        (t) =>
          t.toLowerCase() === selectedTag.toLowerCase() ||
          t.toLowerCase().includes(selectedTag.toLowerCase())
      );
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTag && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <AppHeader />

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Find your people
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Connect with students who share your skills and project interests.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap mb-6 pb-4 border-b border-border/60">
          {filterTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedTag === tag
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, skill, or project idea..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground transition-colors"
          />
        </div>

        {/* Peer List */}
        <div className="space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            <span>Looking for teammates ({filteredPeers.length})</span>
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />}
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs font-medium">Discovering campus peers from database...</span>
            </div>
          ) : filteredPeers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-xs p-8 rounded-2xl border border-dashed border-border/80">
              No students found matching your filter criteria.
            </div>
          ) : (
            filteredPeers.map((peer) => {
            const isConnected = !!connectedMap[peer.id];
            return (
              <div
                key={peer.id}
                className="p-5 rounded-2xl border border-border/80 bg-card shadow-xs hover:border-primary/40 hover:shadow-xs transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <Link href={`/people/${peer.slug}`} className="shrink-0">
                      <div className="w-11 h-11 rounded-full overflow-hidden border border-border/80 hover:ring-2 hover:ring-primary/40 transition-all bg-muted/20">
                        <img
                          src={getAnimeAvatar(peer.slug, peer.name)}
                          alt={peer.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>
                    <div className="min-w-0">
                      <Link
                        href={`/people/${peer.slug}`}
                        className="text-sm font-bold text-foreground hover:underline"
                      >
                        {peer.name}
                      </Link>
                      <div className="text-xs text-muted-foreground font-medium">
                        {peer.role}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleConnect(peer.id)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                      isConnected
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                    }`}
                  >
                    {isConnected ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        Connected
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3 h-3" />
                        Connect
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-foreground/90 leading-relaxed mb-4 pl-1">
                  {peer.bio}
                </p>

                <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/50">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {peer.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/people/${peer.slug}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs font-medium rounded-lg"
                      >
                        View Profile
                      </Button>
                    </Link>
                    <Link href={`/messages/${peer.slug}`}>
                      <Button
                        size="sm"
                        className="h-7 px-3 text-xs font-semibold rounded-lg gap-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        Message
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          }))}
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-muted-foreground border-t border-border/40 bg-muted/20">
        Campusly • Student Teammate Discovery
      </footer>

    </div>
  );
}
