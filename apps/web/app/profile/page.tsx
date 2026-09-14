"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/AppHeader";
import { useAuth } from "@/lib/auth-context";
import { useCampusStore } from "@/lib/store";
import { getAnimeAvatar } from "@/lib/avatars";
import { authClient, type UserProfile } from "@/lib/auth";
import type { TicketItem } from "@repo/schemas";
import {
  User,
  ShieldCheck,
  Building2,
  Calendar,
  Ticket,
  Sparkles,
  Edit3,
  ExternalLink,
  ArrowRight,
  Check,
  Loader2,
  X,
  Mail,
  GraduationCap,
  QrCode,
} from "lucide-react";
import StudentConnectQRModal from "@/components/StudentConnectQRModal";

export default function ProfilePage() {
  const router = useRouter();
  const { user: sessionUser, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { setEditInterestsOpen } = useCampusStore();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Edit form state
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [department, setDepartment] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("2");

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace("/login?redirect=/profile");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [userProfile, userTickets] = await Promise.all([
        authClient.getMe(),
        authClient.getTickets().catch(() => [] as TicketItem[]),
      ]);
      setProfile(userProfile);
      setTickets(userTickets);
      setName(userProfile.name || "");
      setBio(userProfile.bio || "");
      setDepartment(userProfile.department || "School of Computer Science & Engineering");
      setYearOfStudy(String(userProfile.yearOfStudy || "2"));
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const updated = await authClient.updateProfile({
        name,
        bio,
        department,
        yearOfStudy: parseInt(yearOfStudy, 10) || 2,
      });
      setProfile(updated);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isAuthLoading || (isLoading && !profile)) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
        <AppHeader />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs font-medium">Loading your student profile...</p>
        </div>
      </div>
    );
  }

  const displayName = profile?.name || sessionUser?.name || "Student";
  const displayHandle = profile?.username || sessionUser?.username || "";
  const displayEmail = profile?.email || sessionUser?.email || "";
  const publicHandleSlug = displayHandle ? `@${displayHandle}` : profile?.id || "";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <AppHeader />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* Success Toast */}
        {saveSuccess && (
          <div className="mb-6 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>Profile information updated successfully!</span>
          </div>
        )}

        {/* Profile Card Hero */}
        <div className="rounded-3xl border border-border/80 bg-card overflow-hidden mb-8 shadow-sm">
          {/* Subtle Ambient Cover Banner */}
          <div className="h-32 sm:h-40 bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 relative p-4 sm:p-6 flex items-start justify-between border-b border-border/50">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black/40 text-muted-foreground backdrop-blur-md border border-white/10">
              <Building2 className="w-3.5 h-3.5 text-primary" />
              <span>{profile?.department || "School of Computer Science & Engineering"}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Active Campus Student</span>
            </div>
          </div>

          {/* Profile Identity & Quick CTAs */}
          <div className="px-5 sm:px-8 pb-6 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-5">
              
              {/* Avatar + Main Info */}
              <div className="flex items-end gap-4">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-card text-foreground font-extrabold text-2xl sm:text-3xl flex items-center justify-center border-4 border-card shadow-md overflow-hidden ring-1 ring-border/80">
                    <img
                      src={getAnimeAvatar(displayName, "Student")}
                      alt={displayName}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <span
                    className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-card"
                    title="Active"
                  />
                </div>

                <div className="pb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                      {displayName}
                    </h1>
                    {displayHandle && (
                      <span className="text-xs font-mono font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                        @{displayHandle}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/60">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      Verified
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium mt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-primary" />
                      Year {profile?.yearOfStudy || "2"} Student
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                      {displayEmail}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsQrModalOpen(true)}
                  className="rounded-xl px-3.5 text-xs font-semibold gap-1.5 cursor-pointer h-9 border-primary/30 bg-primary/5 text-primary hover:bg-primary/10"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>My Campus Pass</span>
                </Button>

                <Button
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="rounded-xl px-4 text-xs font-semibold gap-1.5 shadow-xs cursor-pointer h-9"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </Button>

                {publicHandleSlug && (
                  <Link href={`/people/${publicHandleSlug}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl px-3.5 text-xs font-semibold gap-1.5 cursor-pointer h-9"
                    >
                      <span>Public Profile</span>
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    </Button>
                  </Link>
                )}
              </div>

            </div>

            {/* Bio */}
            <div className="max-w-2xl text-xs sm:text-sm text-foreground/85 leading-relaxed bg-muted/30 border border-border/50 rounded-2xl p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">About Me</p>
              <p>
                {profile?.bio ||
                  "Student builder passionate about campus hackathons, engineering collaborative prototypes, and open-source initiatives."}
              </p>
            </div>

          </div>
        </div>

        {/* 3 Quick Stat Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          
          <Link
            href="/tickets"
            className="p-4 rounded-2xl border border-border/80 bg-card hover:border-primary/40 hover:shadow-sm transition-all group block"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground">My Event Tickets</span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Ticket className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">{tickets.length}</span>
              <span className="text-xs text-muted-foreground">registered</span>
            </div>
            <p className="text-[11px] text-primary flex items-center gap-1 mt-2 font-medium group-hover:underline">
              <span>View tickets</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </p>
          </Link>

          <div
            onClick={() => setEditInterestsOpen(true)}
            className="p-4 rounded-2xl border border-border/80 bg-card hover:border-primary/40 hover:shadow-sm transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground">Active Interests</span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">
                {profile?.interests?.length ?? 3}
              </span>
              <span className="text-xs text-muted-foreground">tags selected</span>
            </div>
            <p className="text-[11px] text-primary flex items-center gap-1 mt-2 font-medium group-hover:underline">
              <span>Customize preferences</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </p>
          </div>

          <Link
            href="/clubs"
            className="p-4 rounded-2xl border border-border/80 bg-card hover:border-primary/40 hover:shadow-sm transition-all group block"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground">Campus Clubs</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">Explore</span>
              <span className="text-xs text-muted-foreground">societies</span>
            </div>
            <p className="text-[11px] text-primary flex items-center gap-1 mt-2 font-medium group-hover:underline">
              <span>Browse clubs</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </p>
          </Link>

        </div>

        {/* Campus Interest Tags Section */}
        <div className="p-6 rounded-2xl border border-border/80 bg-card mb-8 shadow-xs">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-sm font-bold text-foreground">My Campus Interests & Matching Tags</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                These tags determine what hackathons, clubs, and peer recommendations appear on your feed.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditInterestsOpen(true)}
              className="h-8 text-xs rounded-xl font-semibold gap-1.5 cursor-pointer shrink-0"
            >
              <Sparkles className="w-3 h-3 text-primary" />
              <span>Edit Tags</span>
            </Button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {(profile?.interests && profile.interests.length > 0
              ? profile.interests
              : [
                  { id: "ai", name: "Artificial Intelligence" },
                  { id: "web", name: "Web Development" },
                  { id: "startups", name: "Startups" },
                ]
            ).map((interest) => (
              <span
                key={interest.id}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5"
              >
                <span>✨</span>
                <span>{interest.name}</span>
              </span>
            ))}
          </div>
        </div>

      </main>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/60">
              <h3 className="text-base font-bold text-foreground">Edit Student Profile</h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-muted/40 border border-border focus:outline-none focus:border-primary text-foreground"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1.5">Department / School</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. School of Computer Science & Engineering"
                  className="w-full h-9 px-3 rounded-xl bg-muted/40 border border-border focus:outline-none focus:border-primary text-foreground"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1.5">Year of Study</label>
                <select
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl bg-muted/40 border border-border focus:outline-none focus:border-primary text-foreground"
                >
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                  <option value="5">Postgraduate / Masters</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1.5">Bio / About Me</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="Tell campus peers what you build and what you're passionate about..."
                  className="w-full p-3 rounded-xl bg-muted/40 border border-border focus:outline-none focus:border-primary text-foreground resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSaving}
                  className="rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Connect QR Pass Modal */}
      <StudentConnectQRModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        user={{
          id: profile?.id || sessionUser?.id || "",
          name: displayName,
          username: displayHandle,
          avatar: (profile as any)?.image || (profile as any)?.avatar || null,
          department: profile?.department,
          yearOfStudy:
            typeof profile?.yearOfStudy === "number"
              ? profile.yearOfStudy
              : parseInt(String(profile?.yearOfStudy || "2"), 10) || null,
          interests: profile?.interests?.map((i) => i.name) || [],
        }}
      />

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-muted-foreground border-t border-border/40 mt-12 bg-muted/20">
        Campusly • Student Profile Hub
      </footer>
    </div>
  );
}
