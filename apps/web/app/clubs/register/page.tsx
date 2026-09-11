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
  ArrowRight,
  Bookmark,
  Radio,
  MessageSquare,
  Wand2,
} from "lucide-react";

const CLUB_EMOJIS = ["🤖", "🎨", "🚀", "💻", "⚡", "🌐", "🛡️", "🧬", "📐", "♟️"];

export default function RegisterClubPage() {
  const router = useRouter();
  const { addCustomPost, userName } = useCampusStore();

  const [clubName, setClubName] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🌐");
  const [category, setCategory] = useState("Technical & Engineering");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [venue, setVenue] = useState("");
  const [leadName, setLeadName] = useState(userName || "Student Lead");
  const [cohortSpots, setCohortSpots] = useState("10");
  const [communityLink, setCommunityLink] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["Web3", "Open Source", "Recruiting"]);

  const tagOptions = [
    "Technical",
    "AI",
    "Web Dev",
    "Design",
    "Startups",
    "Open Source",
    "Hardware",
    "Web3",
    "Recruiting",
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // 1-Click Demo Auto-fill
  const handleAutoFill = () => {
    setClubName("Blockchain & Web3 Society");
    setSelectedEmoji("🌐");
    setCategory("Technical & Engineering");
    setTagline("Empowering student builders to ship decentralized apps, smart contracts, and zero-knowledge tools.");
    setDescription(
      "The Blockchain & Web3 Society is campus's hub for decentralized systems and open protocol engineering. We host weekly Solidity/Rust lab sprints, organize hackathon squads for ETHGlobal, and provide grant mentorship for campus startup founders."
    );
    setMeetingTime("Every Wednesday · 6:00 PM");
    setVenue("CS Hall 3 · Lab 204");
    setCohortSpots("12");
    setCommunityLink("discord.gg/campus-web3");
    setSelectedTags(["Web3", "Open Source", "Startups", "Recruiting"]);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubName.trim()) return;

    const slug = clubName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const finalTags = [
      ...selectedTags,
      cohortSpots ? `${cohortSpots} spots open` : "Recruiting",
    ];

    const newClubPost: CustomPost = {
      id: `club-${Date.now()}`,
      type: "clubs",
      category: "Student Club",
      title: clubName,
      author: leadName,
      avatar: selectedEmoji,
      meta: `${meetingTime || "Every Wednesday · 6:00 PM"} · ${venue || "Innovation Hub"} · Lead: ${leadName}`,
      description: tagline ? `${tagline} ${description}` : description || "Campus student club actively recruiting new cohort members.",
      tags: finalTags,
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

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* Top Breadcrumb & Demo Auto-fill Button */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <Link
            href="/feed"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to For You Feed</span>
          </Link>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAutoFill}
            className="h-8 text-xs font-medium rounded-lg gap-1.5 cursor-pointer border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-500/10"
            title="Populate demo data for hackathon presentation"
          >
            <Wand2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Fill Demo Club Data</span>
          </Button>
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
            List your student organization on Campusly to recruit cohort members, announce weekly meetups, and find project collaborators across campus.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Structured Registration Form */}
          <form onSubmit={handleRegister} className="lg:col-span-7 space-y-6">
            
            {/* Section 1: Club Identity & Branding */}
            <div className="p-5 rounded-2xl border border-border/80 bg-card shadow-xs space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>1. Club Identity & Crest</span>
              </h2>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Official Club / Organization Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  placeholder="e.g. Blockchain & Web3 Society"
                  className="w-full h-10 px-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60 transition-colors"
                />
              </div>

              {/* Club Emblem / Emoji Picker */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">
                  Select Club Crest / Icon
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {CLUB_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center text-base transition-all cursor-pointer ${
                        selectedEmoji === emoji
                          ? "border-primary bg-primary/10 ring-2 ring-primary/30 scale-110"
                          : "border-border/60 bg-muted/30 hover:bg-muted/60 text-foreground"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
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
                    className="w-full h-10 px-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60"
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
                  className="w-full h-10 px-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

            {/* Section 2: Meeting Logistics & Community */}
            <div className="p-5 rounded-2xl border border-border/80 bg-card shadow-xs space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>2. Meeting Logistics & Community</span>
              </h2>

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
                    className="w-full h-10 px-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Primary Campus Venue
                  </label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g. Block 32, CS Hall 3"
                    className="w-full h-10 px-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Discord or WhatsApp Community URL <span className="text-muted-foreground font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={communityLink}
                  onChange={(e) => setCommunityLink(e.target.value)}
                  placeholder="e.g. discord.gg/campus-web3"
                  className="w-full h-10 px-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

            {/* Section 3: Recruitment & Description */}
            <div className="p-5 rounded-2xl border border-border/80 bg-card shadow-xs space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary" />
                <span>3. Recruitment Cohort Details</span>
              </h2>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Cohort Spots Available
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={cohortSpots}
                  onChange={(e) => setCohortSpots(e.target.value)}
                  placeholder="10"
                  className="w-32 h-10 px-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Full Club Description & Who Should Apply
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your club's core projects, weekly lab activities, what perks members receive, and who should apply..."
                  className="w-full p-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60 resize-none leading-relaxed"
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
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                className="w-full rounded-xl text-xs font-bold gap-2 shadow-xs cursor-pointer h-11"
              >
                <Building2 className="w-4 h-4" />
                <span>Publish Club to Live Campus Feed</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

          </form>

          {/* Right Column: Live Feed Card Preview (Sticky) */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
              <span>Live Feed Preview</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold lowercase">● updates real-time</span>
            </div>

            {/* Exactly matches our redesigned feed card layout */}
            <div className="p-5 rounded-2xl border border-purple-500/30 bg-card shadow-md transition-all group">
              <div className="flex items-start gap-3.5">
                {/* Visual Anchor Emblem */}
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl shrink-0">
                  {selectedEmoji}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-md border bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200/80 dark:border-purple-900/60">
                        Club
                      </span>
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                        ⚡ New Club Registered
                      </span>
                    </div>

                    <span className="text-muted-foreground p-1">
                      <Bookmark className="w-4 h-4" />
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-foreground mb-1">
                    {clubName || "Your Club Name"}
                  </h3>

                  {/* Meta details */}
                  <p className="text-xs text-muted-foreground font-medium mb-2">
                    {meetingTime || "Every Wednesday · 6:00 PM"} · {venue || "Campus Hub"}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-foreground/85 leading-relaxed mb-3 line-clamp-3">
                    {tagline || description || "Club tagline and mission will display here for student discovery across campus."}
                  </p>

                  {/* Semantic Tags & Single Primary CTA */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {selectedTags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                      {cohortSpots && (
                        <span className="text-[11px] px-2 py-0.5 rounded-md font-medium inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          {cohortSpots} spots open
                        </span>
                      )}
                    </div>

                    <div className="shrink-0">
                      <Button size="sm" className="h-8 px-3.5 text-xs font-semibold gap-1.5 shadow-xs">
                        <span>View Club & Join</span>
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Tip */}
            <div className="p-4 rounded-2xl border border-border/70 bg-muted/20 text-xs text-muted-foreground space-y-1.5">
              <div className="font-semibold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Verified Campus Broadcasting</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Upon publishing, your organization is immediately syndicated into the personalized <strong>For You</strong> feed of students subscribed to matching skill and interest tags.
              </p>
            </div>
          </div>

        </div>

      </main>

      <footer className="w-full py-5 text-center text-xs text-muted-foreground border-t border-border/40 bg-muted/20 mt-12">
        Campusly • Verified University Student Organization Network
      </footer>

    </div>
  );
}
