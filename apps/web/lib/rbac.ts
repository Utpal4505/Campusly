"use client";

export type UserRole = "STUDENT" | "CLUB_LEAD" | "DSW_ADMIN";

export interface RoleProfile {
  role: UserRole;
  displayName: string;
  badgeLabel: string;
  badgeColor: string;
  description: string;
  managedClubSlugs: string[];
  managedEventSlugs: string[];
  canManageClub: (clubSlug: string) => boolean;
  canManageEvent: (eventSlug: string) => boolean;
  canApproveDutyLeave: (eventSlug: string) => boolean;
  canReviewAuditions: (clubSlug: string) => boolean;
}

export const ROLE_PRESETS: Record<UserRole, RoleProfile> = {
  STUDENT: {
    role: "STUDENT",
    displayName: "Student Attendee",
    badgeLabel: "Student",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    description: "General campus attendee. Can register for events, view clubs, apply for auditions, and join squads.",
    managedClubSlugs: [],
    managedEventSlugs: [],
    canManageClub: () => false,
    canManageEvent: () => false,
    canApproveDutyLeave: () => false,
    canReviewAuditions: () => false,
  },
  CLUB_LEAD: {
    role: "CLUB_LEAD",
    displayName: "Club Executive (GDG & Coding Blocks)",
    badgeLabel: "Club Lead",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    description: "Verified student executive. Authorized to manage GDG LPU, Coding Blocks LPU, and the Smart India Hackathon.",
    managedClubSlugs: ["gdg-lpu", "coding-blocks-lpu"],
    managedEventSlugs: ["sih-lpu-internal-hackathon-2026", "gdg-devfest-lpu-2026"],
    canManageClub: (clubSlug: string) => {
      const clean = clubSlug.toLowerCase();
      return clean.includes("gdg") || clean.includes("coding-blocks") || clean === "gdg-lpu" || clean === "coding-blocks-lpu";
    },
    canManageEvent: (eventSlug: string) => {
      const clean = eventSlug.toLowerCase();
      return clean.includes("sih") || clean.includes("devfest");
    },
    canApproveDutyLeave: (eventSlug: string) => {
      const clean = eventSlug.toLowerCase();
      return clean.includes("sih") || clean.includes("devfest");
    },
    canReviewAuditions: (clubSlug: string) => {
      const clean = clubSlug.toLowerCase();
      return clean.includes("gdg") || clean.includes("coding-blocks");
    },
  },
  DSW_ADMIN: {
    role: "DSW_ADMIN",
    displayName: "DSW University Administrator",
    badgeLabel: "DSW Admin",
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    description: "Division of Student Welfare (DSW) official. Full university audit, attendance, and club governance permissions.",
    managedClubSlugs: ["*"],
    managedEventSlugs: ["*"],
    canManageClub: () => true,
    canManageEvent: () => true,
    canApproveDutyLeave: () => true,
    canReviewAuditions: () => true,
  },
};
