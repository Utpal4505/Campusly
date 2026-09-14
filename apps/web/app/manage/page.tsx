"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AppHeader from "@/components/AppHeader";
import { useAuth } from "@/lib/auth-context";
import { getClubLogo } from "@/lib/club-assets";
import { getEventCoverImage } from "@/lib/event-assets";
import {
  Building2,
  Calendar,
  Users,
  ShieldCheck,
  CheckCircle2,
  Plus,
  ArrowRight,
  ExternalLink,
  SlidersHorizontal,
  FileSpreadsheet,
  QrCode,
  Sparkles,
  BarChart3,
  Award,
} from "lucide-react";

interface ManagedClub {
  slug: string;
  name: string;
  role: string;
  memberCount: number;
  applicantsCount: number;
  recruitmentOpen: boolean;
}

interface ManagedEvent {
  slug: string;
  title: string;
  venue: string;
  date: string;
  registeredCount: number;
  checkedInCount: number;
  attendanceRate: number;
}

export default function OrganizerHubPage() {
  const { user } = useAuth();

  const [managedClubs, setManagedClubs] = useState<ManagedClub[]>([
    {
      slug: "gdg-lpu",
      name: "Google Developer Groups (GDG) LPU",
      role: "Lead Organizer",
      memberCount: 28,
      applicantsCount: 3,
      recruitmentOpen: true,
    },
    {
      slug: "coding-blocks-lpu",
      name: "Coding Blocks LPU",
      role: "President",
      memberCount: 34,
      applicantsCount: 1,
      recruitmentOpen: true,
    },
    {
      slug: "robotics-ai-club",
      name: "Robotics & AI Club LPU",
      role: "Technical Coordinator",
      memberCount: 22,
      applicantsCount: 1,
      recruitmentOpen: true,
    },
  ]);

  const [managedEvents, setManagedEvents] = useState<ManagedEvent[]>([
    {
      slug: "sih-lpu-internal-hackathon-2026",
      title: "Smart India Hackathon (SIH) 2026 — LPU Internal Round",
      venue: "Block 34, Shanti Devi Mittal Auditorium",
      date: "Sept 20, 2026",
      registeredCount: 184,
      checkedInCount: 142,
      attendanceRate: 77,
    },
    {
      slug: "gdg-devfest-lpu-2026",
      title: "GDG LPU DevFest 2026",
      venue: "Baldev Raj Mittal Unipolis",
      date: "Oct 12, 2026",
      registeredCount: 310,
      checkedInCount: 245,
      attendanceRate: 79,
    },
    {
      slug: "robowars-lpu-championship",
      title: "RoboWars LPU Championship 2026",
      venue: "Block 38, Robotics Arena",
      date: "Nov 05, 2026",
      registeredCount: 96,
      checkedInCount: 68,
      attendanceRate: 71,
    },
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-20">
      <AppHeader />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* Hub Banner */}
        <div className="relative rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/40 p-6 sm:p-8 mb-8 shadow-xs overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Campus Executive Console
                </span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Division of Student Welfare (DSW) Certified</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Organizer & Club Admin Hub
              </h1>
              <p className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed">
                Centralized command center to oversee student club auditions, member rosters, gate pass check-ins, and university Duty Leave (DL) sheets.
              </p>
            </div>

            {/* Hub Quick Actions */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <Link href="/clubs/register">
                <Button size="sm" variant="outline" className="rounded-xl text-xs gap-1.5 cursor-pointer">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register New Club</span>
                </Button>
              </Link>

              <Link href="/events">
                <Button size="sm" className="rounded-xl text-xs font-semibold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>View All Events</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-border/60">
            <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/50">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Managed Clubs
              </span>
              <span className="text-xl font-black text-foreground">
                {managedClubs.length} Active
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/50">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Pending Auditions
              </span>
              <span className="text-xl font-black text-amber-600 dark:text-amber-400">
                {managedClubs.reduce((acc, c) => acc + c.applicantsCount, 0)} Candidates
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/50">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Managed Events
              </span>
              <span className="text-xl font-black text-foreground">
                {managedEvents.length} Sessions
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/50">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Total Gate Check-ins
              </span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                {managedEvents.reduce((acc, e) => acc + e.checkedInCount, 0)} Attendees
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Clubs You Manage */}
        <section className="space-y-4 mb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              <h2 className="text-base font-bold text-foreground">
                Clubs You Manage & Coordinate
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">
              {managedClubs.length} verified student organizations
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {managedClubs.map((club) => (
              <div
                key={club.slug}
                className="p-5 rounded-3xl border border-border/80 bg-card hover:border-border transition-all flex flex-col justify-between space-y-4 shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl border border-border overflow-hidden bg-muted/30 shrink-0">
                      <img
                        src={getClubLogo(club.name, club.slug)}
                        alt={club.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-foreground truncate">
                        {club.name}
                      </h3>
                      <p className="text-[11px] text-primary font-semibold">
                        {club.role}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-muted/30 border border-border/60 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                        Team Roster
                      </span>
                      <span className="font-bold text-foreground">
                        {club.memberCount} Members
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                        Auditions
                      </span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">
                        {club.applicantsCount} Pending
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                  <Link href={`/clubs/${club.slug}`} className="text-[11px] font-semibold text-muted-foreground hover:text-foreground">
                    Public Page
                  </Link>

                  <Link href={`/clubs/${club.slug}/manage`}>
                    <Button size="sm" className="h-7 px-3 rounded-xl text-[11px] font-bold gap-1 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90">
                      <span>Lead Console</span>
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Events You Coordinate */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <h2 className="text-base font-bold text-foreground">
                Events Under Your Coordination
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">
              Duty Leave (DL) & Attendance Enabled
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {managedEvents.map((evt) => (
              <div
                key={evt.slug}
                className="p-5 rounded-3xl border border-border/80 bg-card hover:border-border transition-all flex flex-col justify-between space-y-4 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="outline" className="text-[10px] font-bold bg-muted/60">
                      {evt.date}
                    </Badge>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>DL Verified</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-foreground line-clamp-2 leading-tight mb-2">
                    {evt.title}
                  </h3>

                  <p className="text-[11px] text-muted-foreground mb-3 flex items-center gap-1">
                    <span className="truncate">{evt.venue}</span>
                  </p>

                  <div className="p-3 rounded-2xl bg-muted/30 border border-border/60 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-[11px]">Gate Attendance:</span>
                      <span className="font-bold text-foreground">
                        {evt.checkedInCount} / {evt.registeredCount} ({evt.attendanceRate}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${evt.attendanceRate}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                  <Link href={`/events/${evt.slug}`} className="text-[11px] font-semibold text-muted-foreground hover:text-foreground">
                    Public Event
                  </Link>

                  <Link href={`/events/${evt.slug}/manage`}>
                    <Button size="sm" className="h-7 px-3 rounded-xl text-[11px] font-bold gap-1 cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white">
                      <span>Attendance & DL</span>
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
