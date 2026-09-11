"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/AppHeader";
import {
  ArrowLeft,
  Search,
  MessageSquare,
  UserCheck,
  UserPlus,
  Sparkles,
  Check,
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

const peers: Peer[] = [
  {
    id: "1",
    slug: "rahul-sharma",
    name: "Rahul Sharma",
    avatar: "RS",
    role: "AI · Backend · Web Development",
    bio: "“Looking for teammates for hackathons and building agentic developer tools.”",
    tags: ["AI", "Backend", "FastAPI", "Python"],
  },
  {
    id: "2",
    slug: "ananya-singh",
    name: "Ananya Singh",
    avatar: "AS",
    role: "UI/UX · Design · Startups",
    bio: "“Interested in building student products and designing modern web experiences.”",
    tags: ["Design", "Figma", "React", "Startups"],
  },
  {
    id: "3",
    slug: "dev-kapoor",
    name: "Dev Kapoor",
    avatar: "DK",
    role: "Full Stack · Mobile · Open Source",
    bio: "“Working on campus utilities and cross-platform Flutter/React Native tools.”",
    tags: ["Web Dev", "Mobile", "TypeScript"],
  },
  {
    id: "4",
    slug: "priya-verma",
    name: "Priya Verma",
    avatar: "PV",
    role: "Data Science · PyTorch · ML Research",
    bio: "“Looking for research collaborators and hackathon partners for LLM projects.”",
    tags: ["AI", "Research", "PyTorch"],
  },
];

export default function PeoplePage() {
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [connectedMap, setConnectedMap] = useState<Record<string, boolean>>({});

  const filterTags = ["All", "AI", "Web Dev", "Design", "Startups", "Mobile"];

  const toggleConnect = (id: string) => {
    setConnectedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredPeers = peers.filter((p) => {
    const matchesTag = selectedTag === "All" || p.tags.includes(selectedTag);
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bio.toLowerCase().includes(searchQuery.toLowerCase());
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
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Looking for teammates ({filteredPeers.length})
          </div>

          {filteredPeers.map((peer) => {
            const isConnected = !!connectedMap[peer.id];
            return (
              <div
                key={peer.id}
                className="p-5 rounded-2xl border border-border/80 bg-card shadow-xs hover:border-primary/40 hover:shadow-xs transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                      {peer.avatar}
                    </div>
                    <div>
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
          })}
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-muted-foreground border-t border-border/40 bg-muted/20">
        Campusly • Student Teammate Discovery
      </footer>

    </div>
  );
}
