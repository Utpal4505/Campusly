"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AppHeader from "@/components/AppHeader";
import { getAnimeAvatar } from "@/lib/avatars";
import { getClubCoverImage, getClubLogo } from "@/lib/club-assets";
import {
  ArrowLeft,
  Users,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Search,
  SlidersHorizontal,
  Plus,
  ChevronRight,
  ExternalLink,
  Mail,
  Send,
  Check,
  X,
  AlertCircle,
  Settings,
  UserCheck,
  MessageSquare,
  Globe,
  Radio,
  FileSpreadsheet,
  Loader2,
  Phone,
  Building2,
  Code2,
} from "lucide-react";

interface AuditionApp {
  id: string;
  clubId: string;
  userId: string;
  studentName: string;
  email: string;
  regNo: string;
  branch: string;
  year: number;
  domain: string;
  portfolioUrl?: string;
  statement: string;
  status: "APPLIED" | "SHORTLISTED" | "INTERVIEW_SCHEDULED" | "ACCEPTED" | "REJECTED";
  interviewDetails?: {
    date?: string;
    time?: string;
    venue?: string;
    notes?: string;
  };
  appliedAt: string;
}

interface ClubMemberItem {
  id: string;
  userId: string;
  role: string;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    username?: string | null;
    department?: string | null;
    yearOfStudy?: number | null;
  };
}

export default function ClubManagePage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = (params.slug as string) || "";
  const slug = rawSlug.toLowerCase();

  const [activeTab, setActiveTab] = useState<"auditions" | "roster" | "settings">("auditions");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [domainFilter, setDomainFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [applications, setApplications] = useState<AuditionApp[]>([]);
  const [members, setMembers] = useState<ClubMemberItem[]>([]);
  const [settings, setSettings] = useState({
    recruitmentOpen: true,
    meetingSchedule: "Every Wednesday & Friday at 5:00 PM",
    meetingVenue: "Block 38, Lab 402 / Central Hub",
    whatsappLink: "https://chat.whatsapp.com/campusly-lpu",
    discordLink: "https://discord.gg/campusly-lpu",
    instagramLink: "https://instagram.com/campusly.lpu",
    githubLink: "https://github.com/campusly-lpu",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Interview Schedule Modal state
  const [interviewModalApp, setInterviewModalApp] = useState<AuditionApp | null>(null);
  const [interviewDate, setInterviewDate] = useState("2026-09-22");
  const [interviewTime, setInterviewTime] = useState("4:30 PM");
  const [interviewVenue, setInterviewVenue] = useState("Block 38, Lab 402");
  const [interviewNotes, setInterviewNotes] = useState("Please bring your laptop with project demonstrations.");

  const apiOrigin = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // Fetch club administrative data
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      fetch(`${apiOrigin}/clubs/${slug}/applications`).then((r) => r.json()).catch(() => []),
      fetch(`${apiOrigin}/clubs/${slug}/members`).then((r) => r.json()).catch(() => []),
      fetch(`${apiOrigin}/clubs/${slug}/settings`).then((r) => r.json()).catch(() => null),
    ])
      .then(([appsData, membersData, settingsData]) => {
        if (!isMounted) return;
        if (Array.isArray(appsData)) setApplications(appsData);
        if (Array.isArray(membersData)) setMembers(membersData);
        if (settingsData) {
          setSettings((prev) => ({
            ...prev,
            ...settingsData,
          }));
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Handle Application Status Transition
  const handleUpdateStatus = async (
    appId: string,
    newStatus: AuditionApp["status"],
    details?: AuditionApp["interviewDetails"]
  ) => {
    setActionLoading(appId);
    try {
      const res = await fetch(`${apiOrigin}/clubs/${slug}/applications/${appId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          interviewDetails: details,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setApplications((prev) =>
          prev.map((a) => (a.id === appId ? { ...a, ...updated } : a))
        );

        // If accepted, add to local members list if not already there
        if (newStatus === "ACCEPTED") {
          const app = applications.find((a) => a.id === appId);
          if (app) {
            setMembers((prev) => [
              ...prev,
              {
                id: `mem-${Date.now()}`,
                userId: app.userId,
                role: `core_${app.domain.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
                joinedAt: new Date().toISOString(),
                user: {
                  id: app.userId,
                  name: app.studentName,
                  email: app.email,
                  department: app.branch,
                  yearOfStudy: app.year,
                },
              },
            ]);
          }
        }
      }
    } catch (err) {
      console.error("Failed to update application:", err);
    } finally {
      setActionLoading(null);
      setInterviewModalApp(null);
    }
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewModalApp) return;
    handleUpdateStatus(interviewModalApp.id, "INTERVIEW_SCHEDULED", {
      date: interviewDate,
      time: interviewTime,
      venue: interviewVenue,
      notes: interviewNotes,
    });
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading("settings");
    try {
      const res = await fetch(`${apiOrigin}/clubs/${slug}/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 2500);
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Filtered Applications
  const filteredApps = applications.filter((app) => {
    if (statusFilter !== "ALL" && app.status !== statusFilter) return false;
    if (domainFilter !== "ALL" && !app.domain.toLowerCase().includes(domainFilter.toLowerCase())) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        app.studentName.toLowerCase().includes(q) ||
        app.regNo.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        app.branch.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const clubDisplayName = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-20">
      <AppHeader />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <Link
            href={`/clubs/${slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Public Club Page</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Organizer Verified</span>
            </span>
          </div>
        </div>

        {/* Club Admin Banner */}
        <div className="relative rounded-3xl border border-border/80 bg-card overflow-hidden p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-border/80 overflow-hidden bg-muted/30 shrink-0 shadow-md">
                <img
                  src={getClubLogo(clubDisplayName, slug)}
                  alt={clubDisplayName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                    {clubDisplayName}
                  </h1>
                  <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-muted/60">
                    Lead Console
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
                  Manage semester audition applications, member roles, meeting schedules, and university inductions.
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 w-full sm:w-auto text-center">
              <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 min-w-[85px]">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Candidates
                </span>
                <span className="text-lg font-black text-foreground">
                  {applications.length}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 min-w-[85px]">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Active Team
                </span>
                <span className="text-lg font-black text-foreground">
                  {members.length > 0 ? members.length : 14}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 min-w-[85px]">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Inductions
                </span>
                <span className={`text-xs font-bold mt-1 inline-block ${settings.recruitmentOpen ? "text-emerald-500" : "text-amber-500"}`}>
                  {settings.recruitmentOpen ? "ACTIVE" : "CLOSED"}
                </span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-8 pt-4 border-t border-border/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab("auditions")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                activeTab === "auditions"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Audition Pipeline</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === "auditions"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}>
                {applications.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("roster")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                activeTab === "roster"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Member Roster</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                activeTab === "settings"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Club Settings & Venue</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Auditions Review Pipeline */}
        {activeTab === "auditions" && (
          <div className="space-y-6">
            
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 rounded-2xl bg-card border border-border/80">
              
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search candidate by name, reg number, or branch..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 rounded-xl border border-border/60 bg-muted/20 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {[
                  { id: "ALL", label: "All" },
                  { id: "APPLIED", label: "New Applied" },
                  { id: "SHORTLISTED", label: "Shortlisted" },
                  { id: "INTERVIEW_SCHEDULED", label: "Interviews" },
                  { id: "ACCEPTED", label: "Selected" },
                  { id: "REJECTED", label: "Declined" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setStatusFilter(item.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 cursor-pointer ${
                      statusFilter === item.id
                        ? "bg-muted font-bold text-foreground ring-1 ring-border"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Domain Filter */}
              <select
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                className="h-8 px-2.5 rounded-xl border border-border/60 bg-muted/20 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="ALL">All Domains</option>
                <option value="Technical">Technical / Dev</option>
                <option value="UI/UX">UI/UX Design</option>
                <option value="Management">Management & PR</option>
                <option value="Media">Media / Video</option>
                <option value="Robotics">Robotics / Hardware</option>
              </select>
            </div>

            {/* Candidates List */}
            {filteredApps.length === 0 ? (
              <div className="py-16 text-center rounded-3xl border border-dashed border-border/80 bg-card/40">
                <Users className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                <h3 className="text-sm font-bold text-foreground">No candidate applications found</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                  Try adjusting your search query or status filter. Students can apply via the public club page.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredApps.map((app) => {
                  const isActioning = actionLoading === app.id;
                  const getStatusBadge = () => {
                    switch (app.status) {
                      case "APPLIED":
                        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">NEW APPLIED</span>;
                      case "SHORTLISTED":
                        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">SHORTLISTED</span>;
                      case "INTERVIEW_SCHEDULED":
                        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">INTERVIEW SCHEDULED</span>;
                      case "ACCEPTED":
                        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">SELECTED & ONBOARDED ✓</span>;
                      case "REJECTED":
                        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">DECLINED</span>;
                    }
                  };

                  return (
                    <div
                      key={app.id}
                      className="p-5 rounded-2xl border border-border/80 bg-card hover:border-border transition-all flex flex-col justify-between space-y-4 shadow-xs"
                    >
                      <div>
                        {/* Top Candidate Row */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-border bg-muted/30 shrink-0">
                              <img
                                src={getAnimeAvatar(app.studentName, "Utpal")}
                                alt={app.studentName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-foreground leading-tight">
                                {app.studentName}
                              </h4>
                              <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1.5 flex-wrap">
                                <span className="font-mono font-semibold text-foreground/90">{app.regNo}</span>
                                <span>•</span>
                                <span>{app.branch}</span>
                              </p>
                            </div>
                          </div>
                          {getStatusBadge()}
                        </div>

                        {/* Domain & Links */}
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                            {app.domain}
                          </span>
                          {app.portfolioUrl && (
                            <a
                              href={app.portfolioUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:underline transition-colors"
                            >
                              <span>Portfolio / Work</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        {/* Statement */}
                        <p className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border/60 leading-relaxed italic">
                          "{app.statement}"
                        </p>

                        {/* Interview Details callout if scheduled */}
                        {app.status === "INTERVIEW_SCHEDULED" && app.interviewDetails && (
                          <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs space-y-1">
                            <div className="font-bold flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Audition Interview Scheduled</span>
                            </div>
                            <p className="text-[11px]">
                              📅 {app.interviewDetails.date} at {app.interviewDetails.time} • 📍 {app.interviewDetails.venue}
                            </p>
                            {app.interviewDetails.notes && (
                              <p className="text-[10px] opacity-80 mt-0.5">
                                Notes: {app.interviewDetails.notes}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Bar */}
                      <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2 flex-wrap text-xs">
                        <div className="flex items-center gap-1.5">
                          {app.status !== "SHORTLISTED" && app.status !== "ACCEPTED" && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isActioning}
                              onClick={() => handleUpdateStatus(app.id, "SHORTLISTED")}
                              className="h-7 px-2.5 text-[11px] font-semibold rounded-lg cursor-pointer"
                            >
                              Shortlist
                            </Button>
                          )}

                          {app.status !== "ACCEPTED" && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isActioning}
                              onClick={() => setInterviewModalApp(app)}
                              className="h-7 px-2.5 text-[11px] font-semibold rounded-lg text-amber-600 hover:text-amber-700 hover:bg-amber-500/10 cursor-pointer"
                            >
                              Schedule Audition
                            </Button>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {app.status !== "ACCEPTED" && (
                            <Button
                              size="sm"
                              disabled={isActioning}
                              onClick={() => handleUpdateStatus(app.id, "ACCEPTED")}
                              className="h-7 px-2.5 text-[11px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                            >
                              Accept to Core
                            </Button>
                          )}

                          {app.status !== "REJECTED" && app.status !== "ACCEPTED" && (
                            <button
                              type="button"
                              disabled={isActioning}
                              onClick={() => handleUpdateStatus(app.id, "REJECTED")}
                              className="p-1 rounded-lg text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                              title="Decline application"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Member Roster & Roles */}
        {activeTab === "roster" && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-card border border-border/80 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Active Club Leadership & Core Members
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  View verified student leads, domain coordinators, and active members.
                </p>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-muted border border-border/60">
                {members.length > 0 ? `${members.length} Members` : "14 Core Leads"}
              </span>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card overflow-hidden divide-y divide-border/60 shadow-xs">
              {(members.length > 0 ? members : [
                {
                  id: "m-1",
                  userId: "u-lead-1",
                  role: "President & Tech Lead",
                  joinedAt: "2025-08-10",
                  user: { id: "u-1", name: "Utpal Sharma", email: "utpal.12204505@lpu.in", department: "B.Tech CSE '26", yearOfStudy: 3 },
                },
                {
                  id: "m-2",
                  userId: "u-lead-2",
                  role: "Vice President & Operations",
                  joinedAt: "2025-08-12",
                  user: { id: "u-2", name: "Arjun Mehta", email: "arjun.12201994@lpu.in", department: "B.Tech CSE '26", yearOfStudy: 3 },
                },
                {
                  id: "m-3",
                  userId: "u-lead-3",
                  role: "UI/UX Design Lead",
                  joinedAt: "2025-09-01",
                  user: { id: "u-3", name: "Ananya Patel", email: "ananya.12308192@lpu.in", department: "B.Des UI/UX '27", yearOfStudy: 2 },
                },
                {
                  id: "m-4",
                  userId: "u-lead-4",
                  role: "Cloud & DevSecOps Coordinator",
                  joinedAt: "2025-09-15",
                  user: { id: "u-4", name: "Rohan Verma", email: "rohan.12204581@lpu.in", department: "B.Tech CSE '26", yearOfStudy: 3 },
                },
              ]).map((mem) => (
                <div key={mem.id} className="p-4 flex items-center justify-between gap-4 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-border bg-muted/30 shrink-0">
                      <img
                        src={getAnimeAvatar(mem.user.name, "Student")}
                        alt={mem.user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">
                        {mem.user.name}
                      </h4>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <span>{mem.user.email}</span>
                        <span>•</span>
                        <span>{mem.user.department}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                      {mem.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Club Settings & Status */}
        {activeTab === "settings" && (
          <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
            <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-5 shadow-xs">
              
              <div className="border-b border-border/60 pb-3">
                <h3 className="text-sm font-bold text-foreground">Club Induction & Operational Settings</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Configure official campus meeting schedules, venue locations, and open/close auditions.
                </p>
              </div>

              {/* Recruitment Toggle */}
              <div className="p-4 rounded-2xl border border-border/70 bg-muted/30 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-foreground">Auditions & Inductions Status</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    When active, students will see the "Apply for Inductions" button on the club page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings((p) => ({ ...p, recruitmentOpen: !p.recruitmentOpen }))}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    settings.recruitmentOpen ? "bg-emerald-600" : "bg-muted-foreground/30"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                      settings.recruitmentOpen ? "left-6" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Venue & Schedule */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Regular Meeting Venue
                  </label>
                  <input
                    type="text"
                    value={settings.meetingVenue}
                    onChange={(e) => setSettings((p) => ({ ...p, meetingVenue: e.target.value }))}
                    placeholder="e.g. Block 38, Lab 402"
                    className="w-full h-9 px-3 rounded-xl border border-border/80 bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Regular Meeting Schedule
                  </label>
                  <input
                    type="text"
                    value={settings.meetingSchedule}
                    onChange={(e) => setSettings((p) => ({ ...p, meetingSchedule: e.target.value }))}
                    placeholder="e.g. Every Wednesday 5:00 PM"
                    className="w-full h-9 px-3 rounded-xl border border-border/80 bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Official Social Links */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-foreground block">
                  Official Community Channels
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-muted-foreground block mb-0.5">WhatsApp Community URL</span>
                    <input
                      type="url"
                      value={settings.whatsappLink}
                      onChange={(e) => setSettings((p) => ({ ...p, whatsappLink: e.target.value }))}
                      className="w-full h-8 px-3 rounded-xl border border-border/80 bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-muted-foreground block mb-0.5">Discord / Slack Server URL</span>
                    <input
                      type="url"
                      value={settings.discordLink}
                      onChange={(e) => setSettings((p) => ({ ...p, discordLink: e.target.value }))}
                      className="w-full h-8 px-3 rounded-xl border border-border/80 bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Save Confirmation Button */}
              <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                {settingsSaved && (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Settings successfully saved!</span>
                  </span>
                )}
                {!settingsSaved && <div />}

                <Button
                  type="submit"
                  size="sm"
                  disabled={actionLoading === "settings"}
                  className="rounded-xl text-xs font-semibold gap-1.5 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {actionLoading === "settings" ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Club Settings</span>
                  )}
                </Button>
              </div>

            </div>
          </form>
        )}

      </main>

      {/* Schedule Audition Interview Modal */}
      {interviewModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in-0">
          <div className="relative w-full max-w-md rounded-3xl border border-border/80 bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Schedule Audition Interview
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Candidate: <span className="font-semibold text-foreground">{interviewModalApp.studentName}</span> ({interviewModalApp.domain})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInterviewModalApp(null)}
                className="w-7 h-7 rounded-full border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Interview Date</label>
                  <input
                    type="date"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-xl border border-border/80 bg-background text-foreground text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">Time Slot</label>
                  <input
                    type="text"
                    required
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    placeholder="e.g. 4:30 PM"
                    className="w-full h-8 px-2.5 rounded-xl border border-border/80 bg-background text-foreground text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Venue Location</label>
                <input
                  type="text"
                  required
                  value={interviewVenue}
                  onChange={(e) => setInterviewVenue(e.target.value)}
                  placeholder="e.g. Block 38, Lab 402"
                  className="w-full h-8 px-2.5 rounded-xl border border-border/80 bg-background text-foreground text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-muted-foreground block mb-1">Instructions for Candidate</label>
                <textarea
                  rows={2}
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border/80 bg-background text-foreground text-xs resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setInterviewModalApp(null)}
                  className="rounded-xl text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white cursor-pointer"
                >
                  Send Interview Invite
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
