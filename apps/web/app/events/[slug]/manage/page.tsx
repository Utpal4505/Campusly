"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AppHeader from "@/components/AppHeader";
import RoleGuard from "@/components/RoleGuard";
import { useAuth } from "@/lib/auth-context";
import TicketScannerModal from "@/components/TicketScannerModal";
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Search,
  Download,
  Printer,
  QrCode,
  Users,
  AlertCircle,
  FileSpreadsheet,
  Check,
  UserCheck,
  ExternalLink,
  ChevronRight,
  Loader2,
  Ticket,
} from "lucide-react";

interface AttendeeRecord {
  id: string;
  ticketNumber: string;
  name: string;
  email: string;
  regNo: string;
  section: string;
  branch: string;
  status: "CHECKED_IN" | "CONFIRMED";
  checkInTime: string | null;
  paymentStatus: string;
  amount: number;
  dutyLeaveStatus: "APPROVED" | "PENDING_GATE_CHECKIN";
}

interface EventAttendanceData {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  capacity: number;
  totalRegistrations: number;
  checkedInCount: number;
  attendancePercentage: number;
  attendees: AttendeeRecord[];
}

export default function EventManagePage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = (params.slug as string) || "";
  const slug = rawSlug.toLowerCase();
  const { canManageEvent } = useAuth();

  const [attendance, setAttendance] = useState<EventAttendanceData | null>(null);
  const [activeTab, setActiveTab] = useState<"roster" | "dutyleave" | "manual">("roster");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "CHECKED_IN" | "CONFIRMED">("ALL");

  const [isLoading, setIsLoading] = useState(true);
  const [manualQuery, setManualQuery] = useState("");
  const [manualResult, setManualResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isManualChecking, setIsManualChecking] = useState(false);

  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const apiOrigin = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // Fetch Attendance Data
  const fetchAttendance = () => {
    setIsLoading(true);
    fetch(`${apiOrigin}/tickets/event/${slug}/attendance`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.attendees) {
          setAttendance(data);
        }
      })
      .catch((err) => console.error("Failed to fetch event attendance:", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchAttendance();
  }, [slug]);

  // Handle Manual Check-in
  const handleManualCheckin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualQuery.trim()) return;

    setIsManualChecking(true);
    setManualResult(null);

    try {
      const res = await fetch(`${apiOrigin}/tickets/event/${slug}/manual-checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: manualQuery }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setManualResult({
          success: true,
          message: `Check-in confirmed for ${data.attendeeName} (${data.ticketNumber})! Duty Leave status marked as APPROVED.`,
        });
        setManualQuery("");
        fetchAttendance();
      } else {
        throw new Error(data.message || "Attendee not found");
      }
    } catch (err: any) {
      setManualResult({
        success: false,
        message: err.message || "Unable to check in attendee.",
      });
    } finally {
      setIsManualChecking(false);
    }
  };

  // Export Official LPU Duty Leave CSV
  const handleExportCSV = () => {
    if (!attendance) return;

    const checkedInOnly = attendance.attendees.filter((a) => a.status === "CHECKED_IN");
    const targetList = checkedInOnly.length > 0 ? checkedInOnly : attendance.attendees;

    const headers = [
      "S.No.",
      "Student Name",
      "Registration Number",
      "Roll / Section",
      "Branch / School",
      "Official Gate Pass ID",
      "Check-in Timestamp",
      "Attendance Status",
      "Duty Leave Status",
    ];

    const rows = targetList.map((a, idx) => [
      idx + 1,
      `"${a.name}"`,
      a.regNo,
      a.section,
      `"${a.branch}"`,
      a.ticketNumber,
      a.checkInTime ? new Date(a.checkInTime).toLocaleString("en-IN") : "Not Checked In",
      a.status,
      a.status === "CHECKED_IN" ? "DUTY LEAVE APPROVED" : "PENDING GATE SCAN",
    ]);

    const titleRow = `"LOVELY PROFESSIONAL UNIVERSITY - DIVISION OF STUDENT WELFARE (DSW)"`;
    const subRow = `"Event: ${attendance.eventTitle} | Venue: ${attendance.eventLocation} | Date: ${new Date(attendance.eventDate).toLocaleDateString()}"`;
    const countRow = `"Total Checked-in Attendees: ${targetList.length} of ${attendance.totalRegistrations}"`;

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [titleRow, subRow, countRow, "", headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `LPU_Duty_Leave_${attendance.eventTitle.replace(/[^a-zA-Z0-9]/g, "_")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const filteredAttendees = (attendance?.attendees || []).filter((a) => {
    if (filterStatus !== "ALL" && a.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.name.toLowerCase().includes(q) ||
        a.regNo.toLowerCase().includes(q) ||
        a.ticketNumber.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.section.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const eventTitle = attendance?.eventTitle || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-20 print:bg-white print:text-black print:pb-0">
      <div className="print:hidden">
        <AppHeader />
      </div>

      <RoleGuard
        isAuthorized={canManageEvent(slug)}
        requiredRoleName="Event Coordinator / DSW Official"
        backHref={`/events/${slug}`}
        resourceTitle={eventTitle}
      >
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between gap-3 mb-6 print:hidden">
          <Link
            href={`/events/${slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Public Event Page</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setIsScannerOpen(true)}
              className="h-8 px-3 rounded-xl text-xs font-bold gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-xs"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Launch Gate Scanner</span>
            </Button>
          </div>
        </div>

        {/* Console Header Banner */}
        <div className="relative rounded-3xl border border-border/80 bg-card overflow-hidden p-6 sm:p-8 mb-8 shadow-xs print:border-none print:shadow-none print:p-0 print:mb-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Live Attendance Console
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  DSW Duty Leave (DL) Approved
                </span>
              </div>

              <h1 className="text-xl sm:text-3xl font-black tracking-tight text-foreground leading-tight">
                {eventTitle}
              </h1>

              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>{attendance?.eventLocation || "Baldev Raj Mittal Unipolis / Block 34"}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span>
                    {attendance?.eventDate
                      ? new Date(attendance.eventDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Campus Flagship"}
                  </span>
                </span>
              </p>
            </div>

            {/* Live Stats Row */}
            <div className="grid grid-cols-3 gap-2.5 w-full lg:w-auto text-center print:hidden">
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 min-w-[90px]">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Registered
                </span>
                <span className="text-xl font-black text-foreground">
                  {attendance?.totalRegistrations || 0}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 min-w-[90px]">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Checked In
                </span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {attendance?.checkedInCount || 0}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 min-w-[90px]">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                  Turnout Rate
                </span>
                <span className="text-xl font-black text-primary">
                  {attendance?.attendancePercentage || 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 pt-5 border-t border-border/60 print:hidden">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-muted-foreground">
                Gate Entrance Progress ({attendance?.checkedInCount || 0} of {attendance?.totalRegistrations || 0} attendees verified)
              </span>
              <span className="text-foreground font-bold">
                {attendance?.attendancePercentage || 0}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-primary rounded-full transition-all duration-500"
                style={{ width: `${attendance?.attendancePercentage || 0}%` }}
              />
            </div>
          </div>

          {/* Tab Selection */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto no-scrollbar print:hidden">
            <button
              type="button"
              onClick={() => setActiveTab("roster")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                activeTab === "roster"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Gate Roster</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === "roster"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}>
                {attendance?.attendees.length || 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("dutyleave")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                activeTab === "dutyleave"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-500" />
              <span>Duty Leave (DL) Sheet</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">
                Official
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("manual")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                activeTab === "manual"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Manual Check-in</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Live Gate Roster */}
        {activeTab === "roster" && (
          <div className="space-y-4 print:hidden">
            
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-card border border-border/80">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search attendee by name, reg number, section, or pass code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 rounded-xl border border-border/60 bg-muted/20 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {(["ALL", "CHECKED_IN", "CONFIRMED"] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setFilterStatus(st)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      filterStatus === st
                        ? "bg-muted font-bold text-foreground ring-1 ring-border"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    {st === "ALL" ? "All Passholders" : st === "CHECKED_IN" ? "Present (Checked In)" : "Pending Gate"}
                  </button>
                ))}
              </div>
            </div>

            {/* Roster Table */}
            <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border/70 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                      <th className="py-3 px-4">Attendee</th>
                      <th className="py-3 px-3">Reg. Number</th>
                      <th className="py-3 px-3">Section & Branch</th>
                      <th className="py-3 px-3">Gate Pass ID</th>
                      <th className="py-3 px-3">Gate Status</th>
                      <th className="py-3 px-4 text-right">Duty Leave</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredAttendees.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-muted-foreground">
                          No attendees matching search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredAttendees.map((att) => (
                        <tr key={att.id} className="hover:bg-muted/20 transition-colors">
                          <td className="py-3 px-4">
                            <p className="font-bold text-foreground text-xs">{att.name}</p>
                            <p className="text-[11px] text-muted-foreground">{att.email}</p>
                          </td>
                          <td className="py-3 px-3 font-mono font-semibold text-foreground">
                            {att.regNo}
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-semibold text-foreground block">{att.section}</span>
                            <span className="text-[10px] text-muted-foreground">{att.branch}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-mono text-[11px] font-bold text-primary px-2 py-0.5 rounded bg-primary/5 border border-primary/20">
                              {att.ticketNumber}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            {att.status === "CHECKED_IN" ? (
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>CHECKED IN</span>
                              </div>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground border border-border/70">
                                CONFIRMED
                              </span>
                            )}
                            {att.checkInTime && (
                              <span className="text-[10px] text-muted-foreground block mt-0.5">
                                {new Date(att.checkInTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {att.status === "CHECKED_IN" ? (
                              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                DL APPROVED ✓
                              </span>
                            ) : (
                              <span className="text-[10px] text-muted-foreground">
                                Pending Scan
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: LPU Official Duty Leave (DL) Sheet */}
        {activeTab === "dutyleave" && (
          <div className="space-y-6">
            
            {/* Action Bar */}
            <div className="p-4 rounded-2xl bg-card border border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 print:hidden shadow-xs">
              <div>
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Division of Student Welfare (DSW) Attendance Export
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Generate standardized university Duty Leave attendance sheets for faculty and UMS approval.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePrint}
                  className="h-8 px-3 rounded-xl text-xs gap-1.5 cursor-pointer flex-1 sm:flex-initial"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Sheet</span>
                </Button>

                <Button
                  size="sm"
                  onClick={handleExportCSV}
                  className="h-8 px-3 rounded-xl text-xs font-semibold gap-1.5 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 flex-1 sm:flex-initial"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV (.csv)</span>
                </Button>
              </div>
            </div>

            {/* Official University Printable Sheet Template */}
            <div className="p-8 sm:p-10 rounded-3xl border border-border/80 bg-card shadow-lg print:border-none print:shadow-none print:p-0 space-y-6">
              
              {/* Header */}
              <div className="text-center pb-6 border-b-2 border-border text-foreground">
                <h2 className="text-base sm:text-lg font-black uppercase tracking-wider">
                  Lovely Professional University
                </h2>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-primary">
                  Division of Student Welfare (DSW) — Official Event Attendance Sheet
                </h3>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Verified Gate Attendance & Duty Leave Recommendation Record
                </p>
              </div>

              {/* Event Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-muted/30 border border-border/60 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Event Title</span>
                  <p className="font-bold text-foreground mt-0.5">{eventTitle}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Venue Location</span>
                  <p className="font-bold text-foreground mt-0.5">{attendance?.eventLocation || "Block 34 / Unipolis"}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Event Date</span>
                  <p className="font-bold text-foreground mt-0.5">
                    {attendance?.eventDate ? new Date(attendance.eventDate).toLocaleDateString("en-IN") : "Current Session"}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">Verified Present</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {attendance?.checkedInCount || 0} Students
                  </p>
                </div>
              </div>

              {/* Attendance Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-border/80 border-collapse">
                  <thead>
                    <tr className="bg-muted/60 border-b border-border/80 text-[10px] font-bold uppercase text-foreground">
                      <th className="py-2.5 px-3 border-r border-border/80 w-12 text-center">S.No.</th>
                      <th className="py-2.5 px-3 border-r border-border/80">Student Name</th>
                      <th className="py-2.5 px-3 border-r border-border/80">Registration No.</th>
                      <th className="py-2.5 px-3 border-r border-border/80">Roll / Section</th>
                      <th className="py-2.5 px-3 border-r border-border/80">Branch</th>
                      <th className="py-2.5 px-3 border-r border-border/80">Gate Pass Serial</th>
                      <th className="py-2.5 px-3 border-r border-border/80">Check-in Time</th>
                      <th className="py-2.5 px-3 text-center">DL Recommendation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {(attendance?.attendees || []).map((a, idx) => (
                      <tr key={a.id} className="text-[11px]">
                        <td className="py-2 px-3 border-r border-border/80 text-center font-mono">{idx + 1}</td>
                        <td className="py-2 px-3 border-r border-border/80 font-bold">{a.name}</td>
                        <td className="py-2 px-3 border-r border-border/80 font-mono font-semibold">{a.regNo}</td>
                        <td className="py-2 px-3 border-r border-border/80">{a.section}</td>
                        <td className="py-2 px-3 border-r border-border/80">{a.branch}</td>
                        <td className="py-2 px-3 border-r border-border/80 font-mono text-[10px]">{a.ticketNumber}</td>
                        <td className="py-2 px-3 border-r border-border/80">
                          {a.checkInTime ? new Date(a.checkInTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                        </td>
                        <td className="py-2 px-3 text-center font-bold text-[10px]">
                          {a.status === "CHECKED_IN" ? (
                            <span className="text-emerald-600 dark:text-emerald-400">RECOMMENDED (PRESENT)</span>
                          ) : (
                            <span className="text-muted-foreground">ABSENT</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* University Sign-off Stamp Block */}
              <div className="pt-8 grid grid-cols-3 gap-6 text-center text-xs">
                <div className="border-t border-border pt-3">
                  <p className="font-bold text-foreground">Student Event Coordinator</p>
                  <p className="text-[10px] text-muted-foreground">Signature & Date</p>
                </div>

                <div className="border-t border-border pt-3">
                  <p className="font-bold text-foreground">Faculty Event Advisor</p>
                  <p className="text-[10px] text-muted-foreground">Signature & Date</p>
                </div>

                <div className="border-t border-border pt-3">
                  <p className="font-bold text-foreground">Dean / DSW Verification</p>
                  <p className="text-[10px] text-muted-foreground">Official Seal Stamp</p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab 3: Manual Check-in Console */}
        {activeTab === "manual" && (
          <div className="max-w-xl mx-auto space-y-6 print:hidden">
            <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-4 shadow-xs">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Manual Gate Entrance Check-in
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Use this override when an attendee's mobile battery is dead or camera scanning is unavailable.
                </p>
              </div>

              <form onSubmit={handleManualCheckin} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Enter Ticket Serial (`CPLY-...`), Registration Number, or Student Email
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={manualQuery}
                      onChange={(e) => setManualQuery(e.target.value)}
                      placeholder="e.g. CPLY-9A4B21 or 12204581 or email"
                      className="flex-1 h-9 px-3 rounded-xl border border-border/80 bg-background text-foreground font-mono text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <Button
                      type="submit"
                      disabled={isManualChecking}
                      className="rounded-xl text-xs font-bold px-4 bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                    >
                      {isManualChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify & Check In"}
                    </Button>
                  </div>
                </div>

                {manualResult && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 animate-in fade-in-0 ${
                      manualResult.success
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        : "border-destructive/30 bg-destructive/10 text-destructive"
                    }`}
                  >
                    {manualResult.success ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-destructive" />
                    )}
                    <span className="leading-relaxed">{manualResult.message}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

      </main>
      </RoleGuard>

      {/* Gate Ticket Camera Scanner Modal */}
      <TicketScannerModal
        isOpen={isScannerOpen}
        onClose={() => {
          setIsScannerOpen(false);
          fetchAttendance();
        }}
        eventId={slug}
        eventTitle={eventTitle}
      />

    </div>
  );
}
