"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCampusStore, CustomPost, type CreateModalTabType } from "@/lib/store";
import { authClient } from "@/lib/auth";
import {
  X,
  Sparkles,
  Users,
  Calendar,
  Zap,
  Plus,
  Building2,
  ShieldCheck,
  Loader2,
  ArrowRight,
  FolderGit2,
  ExternalLink,
} from "lucide-react";

export default function CreatePostModal() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    isCreateModalOpen,
    setCreateModalOpen,
    addCustomPost,
    userName,
    createModalTab,
  } = useCampusStore();

  const [postType, setPostType] = useState<CreateModalTabType>("teammate");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  // Project showcase fields
  const [showcaseTitle, setShowcaseTitle] = useState("");
  const [showcaseTagline, setShowcaseTagline] = useState("");
  const [showcaseLink, setShowcaseLink] = useState("");
  const [showcaseDesc, setShowcaseDesc] = useState("");

  // Event post fields (with Club Host organization)
  const [hostClub, setHostClub] = useState(detectedClubName);
  const [eventTitle, setEventTitle] = useState("");
  const [eventTiming, setEventTiming] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventDesc, setEventDesc] = useState("");

  // Sync modal postType whenever modal opens or tab selection changes
  useEffect(() => {
    if (isCreateModalOpen) {
      if (clubSlugFromUrl && CLUB_HOST_NAMES[clubSlugFromUrl]) {
        setHostClub(CLUB_HOST_NAMES[clubSlugFromUrl]);
        setPostType("event");
      } else {
        setPostType(createModalTab || "teammate");
      }
    }
  }, [isCreateModalOpen, createModalTab, clubSlugFromUrl]);

  const tagOptions = ["AI", "Web Dev", "Design", "Startups", "Mobile", "Hackathon", "Open Source"];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (postType === "teammate") {
        if (!projectTitle.trim() || !pitch.trim()) {
          setIsSubmitting(false);
          return;
        }

        // Persist to real PostgreSQL Post table
        await authClient
          .createPost({
            title: `${userName} — ${projectTitle.trim()}`,
            content: `${roleNeeded ? `Role: ${roleNeeded}\n\n` : ""}${pitch.trim()}`,
          })
          .catch((err) => console.warn("Failed to persist post to DB:", err));

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
      } else if (postType === "project") {
        if (!showcaseTitle.trim() || !showcaseDesc.trim()) {
          setIsSubmitting(false);
          return;
        }

        // Persist to real PostgreSQL Post table
        await authClient
          .createPost({
            title: `🚀 Project: ${showcaseTitle.trim()}`,
            content: `${showcaseTagline ? `${showcaseTagline}\n\n` : ""}${showcaseDesc.trim()}${showcaseLink ? `\n\nDemo: ${showcaseLink}` : ""}`,
          })
          .catch((err) => console.warn("Failed to persist project to DB:", err));

        const newPost: CustomPost = {
          id: `proj-${Date.now()}`,
          type: "projects",
          category: "Project Showcase",
          title: showcaseTitle,
          author: userName,
          avatar: userName.charAt(0).toUpperCase(),
          meta: `🚀 Built by ${userName}${showcaseTagline ? ` · ${showcaseTagline}` : ""}`,
          description: showcaseDesc,
          tags: selectedTags.length > 0 ? selectedTags : ["Project", "Open Source"],
          createdAt: "Just now",
          actionLabel: showcaseLink ? "View Project Demo" : "Explore Project",
          actionDoneLabel: "Saved ✓",
          actionHref: showcaseLink || undefined,
        };

        addCustomPost(newPost);
      } else if (postType === "event") {
        if (!eventTitle.trim() || !eventDesc.trim()) {
          setIsSubmitting(false);
          return;
        }

        // Persist to real PostgreSQL Event table
        const realEvent = await authClient
          .createEvent({
            title: eventTitle.trim(),
            description: `🏛️ Hosted by ${hostClub}. ${eventDesc.trim()}`,
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            location: eventVenue.trim() || "Campus Grounds",
            interestNames: selectedTags,
          })
          .catch((err) => {
            console.warn("Failed to persist event to DB:", err);
            return null;
          });

        const newPost: CustomPost = {
          id: realEvent?.id || `event-${Date.now()}`,
          type: "events",
          category: "Campus Event",
          title: eventTitle,
          author: hostClub,
          avatar: hostClub.substring(0, 2).toUpperCase(),
          meta: `🏛️ Hosted by ${hostClub} · ${eventTiming || "Upcoming"} · ${eventVenue || "Campus Grounds"}`,
          description: eventDesc,
          tags: selectedTags.length > 0 ? selectedTags : ["Event", "Workshop"],
          createdAt: "Just now",
          actionLabel: "Register for Event",
          actionDoneLabel: "Registered ✓",
          actionHref: realEvent ? `/events/${realEvent.id}` : "/events",
        };

        addCustomPost(newPost);
      }

      // Notify feed to refresh from PostgreSQL
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("campusly:preferences-updated"));
      }

      setCreateModalOpen(false);

      // Reset form
      setProjectTitle("");
      setRoleNeeded("");
      setPitch("");
      setShowcaseTitle("");
      setShowcaseTagline("");
      setShowcaseLink("");
      setShowcaseDesc("");
      setEventTitle("");
      setEventTiming("");
      setEventVenue("");
      setEventDesc("");

      if (pathname !== "/feed") {
        router.push("/feed");
      }
    } catch (err: any) {
      setSubmitError(err?.message || "Failed to publish. Please try again.");
    } finally {
      setIsSubmitting(false);
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

        {/* Post Type Selector Tabs (3 Distinct Tabs: Teammate, Project, Event) */}
        <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl border border-border/50 text-xs mb-3">
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
            <span>Find Teammates</span>
          </button>

          <button
            type="button"
            onClick={() => setPostType("project")}
            className={`flex-1 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              postType === "project"
                ? "bg-card text-foreground font-semibold shadow-xs border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5 text-amber-500" />
            <span>Share Project</span>
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
            <Calendar className="w-3.5 h-3.5 text-purple-500" />
            <span>Club Event</span>
          </button>
        </div>

        <div className="flex items-center justify-between px-1 mb-4 text-[11px] text-muted-foreground">
          <span>Leading a student organization?</span>
          <button
            type="button"
            onClick={() => {
              setCreateModalOpen(false);
              router.push("/clubs/register");
            }}
            className="text-primary hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
          >
            <span>Register Club Page</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handlePublish} className="space-y-4">
          
          {postType === "teammate" ? (
            <>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Target Hackathon or Project Name
                </label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. GenAI Hackathon 2026, Campus Food Delivery Bot"
                  required
                  className="w-full h-9 px-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Role / Teammates Needed
                </label>
                <input
                  type="text"
                  value={roleNeeded}
                  onChange={(e) => setRoleNeeded(e.target.value)}
                  placeholder="e.g. Frontend / UI Designer, ML Engineer, Python Dev"
                  className="w-full h-9 px-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Team Pitch & Expectations
                </label>
                <textarea
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  placeholder="Describe your idea, what you bring to the table, and who you want on your squad..."
                  rows={3}
                  required
                  className="w-full p-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground resize-none"
                />
              </div>
            </>
          ) : postType === "project" ? (
            <>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Project Name
                </label>
                <input
                  type="text"
                  value={showcaseTitle}
                  onChange={(e) => setShowcaseTitle(e.target.value)}
                  placeholder="e.g. Campus Notes AI, Timetable PWA, Smart Attendance"
                  required
                  className="w-full h-9 px-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  One-Line Tagline
                </label>
                <input
                  type="text"
                  value={showcaseTagline}
                  onChange={(e) => setShowcaseTagline(e.target.value)}
                  placeholder="e.g. Instant AI summaries and quiz generation for engineering lecture notes"
                  className="w-full h-9 px-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block flex items-center justify-between">
                  <span>Live Demo or GitHub Repository</span>
                  <span className="text-[10px] text-muted-foreground font-normal">Optional</span>
                </label>
                <input
                  type="url"
                  value={showcaseLink}
                  onChange={(e) => setShowcaseLink(e.target.value)}
                  placeholder="https://github.com/username/project or https://myproject.dev"
                  className="w-full h-9 px-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">
                  Project Description & Key Features
                </label>
                <textarea
                  value={showcaseDesc}
                  onChange={(e) => setShowcaseDesc(e.target.value)}
                  placeholder="Explain what the project solves, what tech stack was used, and how students can check it out..."
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

          {submitError && (
            <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
              {submitError}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-3 border-t border-border/50 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              onClick={() => setCreateModalOpen(false)}
              className="h-9 px-4 rounded-xl text-xs font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="h-9 px-5 rounded-xl text-xs font-semibold shadow-xs gap-1.5 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    Publish {postType === "event" ? "Club Event" : postType === "project" ? "Project Showcase" : "Teammate Request"}
                  </span>
                </>
              )}
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
}
