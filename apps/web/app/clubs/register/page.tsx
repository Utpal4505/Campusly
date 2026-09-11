"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/AppHeader";
import { useCampusStore, CustomPost } from "@/lib/store";
import {
  ArrowLeft,
  Building2,
  Calendar,
  MapPin,
  Sparkles,
  Users,
  CheckCircle2,
  ShieldCheck,
  Plus,
} from "lucide-react";

export default function RegisterClubPage() {
  const router = useRouter();
  const { addCustomPost, userName } = useCampusStore();

  const [clubName, setClubName] = useState("");
  const [category, setCategory] = useState("Technical & Engineering");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [venue, setVenue] = useState("");
  const [leadName, setLeadName] = useState(userName || "Student Lead");
  const [perksText, setPerksText] = useState("Weekly Labs, Mentorship, Project Collaboration");
  const [selectedTags, setSelectedTags] = useState<string[]>(["Technical", "Recruiting"]);

  const tagOptions = [
    "Technical",
    "AI",
    "Web Dev",
    "Design",
    "Startups",
    "Open Source",
    "Hardware",
    "Recruiting",
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubName.trim() || !description.trim()) return;

    const slug = clubName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newClubPost: CustomPost = {
      id: `club-${Date.now()}`,
      type: "clubs",
      category: "Student Club",
      title: clubName,
      author: leadName,
      avatar: clubName.substring(0, 2).toUpperCase(),
      meta: `${meetingTime || "Weekly Meetups"} · ${venue || "Campus Hub"} · Lead: ${leadName}`,
      description: tagline ? `${tagline} ${description}` : description,
      tags: selectedTags.length > 0 ? selectedTags : ["Campus Club", "Recruiting"],
      createdAt: "Just now",
      actionLabel: "View Club & Join",
      actionDoneLabel: "Applied ✓",
      actionHref: `/clubs/${slug || "ai-robotics-society"}`,
    };

    addCustomPost(newClubPost);
    router.push("/feed");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <AppHeader />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/feed"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to For You Feed</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8 pb-6 border-b border-border/60">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-500/20 mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Campus Organization Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Register Your Campus Club
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            List your student club, society, or guild on Campusly to recruit members, announce weekly meetups, and find cross-discipline project collaborators.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Registration Form */}
          <form onSubmit={handleRegister} className="lg:col-span-7 space-y-4">
            
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Official Club / Organization Name
              </label>
              <input
                type="text"
                required
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                placeholder="e.g. Blockchain & Web3 Society, Campus UX Collective"
                className="w-full h-10 px-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Club Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground"
                >
                  <option value="Technical & Engineering">Technical & Engineering</option>
                  <option value="Design & Creative">Design & Creative</option>
                  <option value="Startups & Business">Startups & Business</option>
                  <option value="Robotics & Hardware">Robotics & Hardware</option>
                  <option value="Open Source & DevOps">Open Source & DevOps</option>
                  <option value="Cultural & Media">Cultural & Media</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  President / Lead Name
                </label>
                <input
                  type="text"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="Your Name / Title"
                  className="w-full h-10 px-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Short Mission Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Empowering student builders to ship Web3 and decentralized apps."
                className="w-full h-10 px-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Meeting Frequency & Timing
                </label>
                <input
                  type="text"
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  placeholder="e.g. Every Wednesday · 6:00 PM"
                  className="w-full h-10 px-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Primary Venue / Location
                </label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Block 32, CS Hall 3"
                  className="w-full h-10 px-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">
                Full Club Description & Recruitment Details
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your club's core projects, weekly activities, what perks members receive, and who should apply..."
                className="w-full p-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">
                Discovery Tags
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {tagOptions.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <Button
                type="submit"
                size="lg"
                className="w-full rounded-xl text-xs font-bold gap-2 shadow-xs cursor-pointer"
              >
                <Building2 className="w-4 h-4" />
                <span>Publish Club to Campus Feed</span>
              </Button>
            </div>

          </form>

          {/* Right Column: Live Feed Card Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Live Feed Preview
            </div>

            <div className="p-5 rounded-2xl border border-purple-500/30 bg-card shadow-sm space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-md border bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30">
                  <Building2 className="w-3.5 h-3.5" />
                  Club
                </span>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  ⚡ New Club Registered
                </span>
              </div>

              <h3 className="text-base font-bold text-foreground">
                {clubName || "Your Club Name"}
              </h3>

              <div className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                <span>{meetingTime || "Every Wednesday · 6:00 PM"}</span>
                <span>•</span>
                <span>{venue || "Innovation Hub"}</span>
              </div>

              <p className="text-xs text-foreground/80 leading-relaxed">
                {tagline || description || "Club tagline and mission will display here for student discovery."}
              </p>

              <div className="flex items-center gap-1.5 flex-wrap pt-2">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  Details
                </Button>
                <Button size="sm" className="h-8 px-4 text-xs font-semibold gap-1.5">
                  View Club & Join →
                </Button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 text-xs text-muted-foreground space-y-1">
              <div className="font-semibold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Student Organization</span>
              </div>
              <p className="text-[11px]">
                Upon publishing, all students subscribed to related tags will discover your club in their personalized "For You" feed.
              </p>
            </div>
          </div>

        </div>

      </main>

      <footer className="w-full py-4 text-center text-xs text-muted-foreground border-t border-border/40 bg-muted/20">
        Campusly • Student Organization Onboarding
      </footer>

    </div>
  );
}
