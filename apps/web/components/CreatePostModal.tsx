"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCampusStore, CustomPost } from "@/lib/store";
import {
  X,
  Sparkles,
  Users,
  Calendar,
  Zap,
  Plus,
  Building2,
  ShieldCheck,
} from "lucide-react";

export default function CreatePostModal() {
  const router = useRouter();
  const pathname = usePathname();
  const { isCreateModalOpen, setCreateModalOpen, addCustomPost, userName } = useCampusStore();

  const [postType, setPostType] = useState<"teammate" | "event">("teammate");

  // Determine if inside a specific club page
  const isClubPage = pathname?.startsWith("/clubs/") ?? false;
  const clubSlugFromUrl = isClubPage ? pathname.replace("/clubs/", "").split("/")[0] : "";

  const CLUB_HOST_NAMES: Record<string, string> = {
    "ai-robotics-society": "AI & Robotics Society",
    "design-guild": "Design Guild LPU",
    "cybersecurity": "CyberSecurity & Ethical Hacking Lab",
  };

  const detectedClubName =
    clubSlugFromUrl && CLUB_HOST_NAMES[clubSlugFromUrl]
      ? CLUB_HOST_NAMES[clubSlugFromUrl]
      : "AI & Robotics Society";

  // Teammate post fields
  const [projectTitle, setProjectTitle] = useState("");
  const [roleNeeded, setRoleNeeded] = useState("");
  const [pitch, setPitch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["AI", "Web Dev"]);

  // Event post fields (with Club Host organization)
  const [hostClub, setHostClub] = useState(detectedClubName);
  const [eventTitle, setEventTitle] = useState("");
  const [eventTiming, setEventTiming] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventDesc, setEventDesc] = useState("");

  // If opened from a club page, automatically pre-fill host and switch to event tab
  useEffect(() => {
    if (clubSlugFromUrl && CLUB_HOST_NAMES[clubSlugFromUrl]) {
      setHostClub(CLUB_HOST_NAMES[clubSlugFromUrl]);
      setPostType("event");
    }
  }, [clubSlugFromUrl]);

  const tagOptions = ["AI", "Web Dev", "Design", "Startups", "Mobile", "Hackathon", "Open Source"];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();

    if (postType === "teammate") {
      if (!projectTitle.trim() || !pitch.trim()) return;

      const newPost: CustomPost = {
        id: `post-${Date.now()}`,
        type: "teammates",
        category: "Teammate Request",
        title: `${userName} — ${projectTitle}`,
        author: userName,
        avatar: userName.charAt(0).toUpperCase(),
        meta: `Posted by ${userName} · Looking for ${roleNeeded || "Collaborators"}`,
        description: pitch,
        tags: selectedTags.length > 0 ? selectedTags : ["Teammate Request"],
        createdAt: "Just now",
        actionLabel: "Connect & Team Up",
        actionDoneLabel: "Invite Sent ✓",
      };

      addCustomPost(newPost);
    } else if (postType === "event") {
      if (!eventTitle.trim() || !eventDesc.trim()) return;

      const newPost: CustomPost = {
        id: `event-${Date.now()}`,
        type: "events",
        category: "Campus Event",
        title: eventTitle,
        author: hostClub,
        avatar: hostClub.substring(0, 2).toUpperCase(),
        meta: `🏛️ Hosted by ${hostClub} · ${eventTiming || "This Weekend"} · ${eventVenue || "Campus Grounds"}`,
        description: eventDesc,
        tags: selectedTags.length > 0 ? selectedTags : ["Event", "Workshop"],
        createdAt: "Just now",
        actionLabel: "Register for Event",
        actionDoneLabel: "Registered ✓",
        actionHref: "/events",
      };

      addCustomPost(newPost);
    }

    setCreateModalOpen(false);

    // Reset form
    setProjectTitle("");
    setRoleNeeded("");
    setPitch("");
    setEventTitle("");
    setEventTiming("");
    setEventVenue("");
    setEventDesc("");

    if (pathname !== "/feed") {
      router.push("/feed");
    }
  };

  if (!isCreateModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-border/80 bg-card text-foreground shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Create on Campusly</h2>
              <p className="text-[11px] text-muted-foreground">Broadcast opportunities to active students across campus</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCreateModalOpen(false)}
            className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Post Type Selector Tabs (Focused 2-Tab Hierarchy) */}
        <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl border border-border/50 text-xs mb-5">
          <button
            type="button"
            onClick={() => setPostType("teammate")}
            className={`flex-1 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              postType === "teammate"
                ? "bg-card text-foreground font-semibold shadow-xs border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-500" />
            <span>Peer Teammate</span>
          </button>

          <button
            type="button"
            onClick={() => setPostType("event")}
            className={`flex-1 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              postType === "event"
                ? "bg-card text-foreground font-semibold shadow-xs border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-500" />
            <span>Club Event</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handlePublish} className="space-y-4">
          
          {postType === "teammate" ? (
            <>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Project or Hackathon Name
                </label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. GenAI Hackathon 2026, Campus Food Bot"
                  required
                  className="w-full h-9 px-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Role / Skills You Need
                </label>
                <input
                  type="text"
                  value={roleNeeded}
                  onChange={(e) => setRoleNeeded(e.target.value)}
                  placeholder="e.g. Frontend Engineer, UI/UX Designer, Python builder"
                  className="w-full h-9 px-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Your Pitch / Details
                </label>
                <textarea
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  placeholder="Briefly describe what you're building and what kind of teammate you want to team up with..."
                  rows={3}
                  required
                  className="w-full p-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground resize-none"
                />
              </div>
            </>
          ) : (
            <>
              {/* Host Organization Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-primary" />
                    <span>Host Club / Organization</span>
                  </label>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Organization</span>
                  </span>
                </div>

                <div className="relative">
                  <select
                    value={hostClub}
                    onChange={(e) => setHostClub(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground font-medium cursor-pointer"
                  >
                    <option value="AI & Robotics Society">AI & Robotics Society (You are Lead Organizer)</option>
                    <option value="Design Guild LPU">Design Guild LPU</option>
                    <option value="CyberSecurity & Ethical Hacking Lab">CyberSecurity & Ethical Hacking Lab</option>
                    <option value="Independent Student Sprint">Independent Student Sprint (Approved Organizer)</option>
                  </select>
                </div>

                {isClubPage && clubSlugFromUrl && (
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                    <span>✓ Context pre-filled from club portal:</span>
                    <strong>{detectedClubName}</strong>
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Event Title
                </label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Prompt Engineering Hands-on Lab"
                  required
                  className="w-full h-9 px-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Date & Time
                  </label>
                  <input
                    type="text"
                    value={eventTiming}
                    onChange={(e) => setEventTiming(e.target.value)}
                    placeholder="e.g. Saturday · 4:00 PM"
                    className="w-full h-9 px-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">
                    Venue / Campus Location
                  </label>
                  <input
                    type="text"
                    value={eventVenue}
                    onChange={(e) => setEventVenue(e.target.value)}
                    placeholder="e.g. Block 32, Room 401"
                    className="w-full h-9 px-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Event Description & Attendee Takeaways
                </label>
                <textarea
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  placeholder="What will attendees learn? What should they bring? Who is welcome?"
                  rows={3}
                  required
                  className="w-full p-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground resize-none"
                />
              </div>
            </>
          )}

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold text-foreground mb-1.5 block">
              Tags
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {tagOptions.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-0.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3 border-t border-border/50 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCreateModalOpen(false)}
              className="h-9 px-4 rounded-xl text-xs font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-9 px-5 rounded-xl text-xs font-semibold shadow-xs gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Publish {postType === "event" ? "Club Event" : "Teammate Request"}</span>
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
}
