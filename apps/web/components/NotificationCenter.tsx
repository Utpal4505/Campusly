"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Check,
  CheckCheck,
  Calendar,
  Users,
  Award,
  Building2,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export interface CampusNotification {
  id: string;
  title: string;
  message: string;
  category: "ticket" | "squad" | "certificate" | "club" | "system";
  timestamp: string;
  read: boolean;
  href?: string;
  actionText?: string;
}

const INITIAL_NOTIFICATIONS: CampusNotification[] = [
  {
    id: "notif-1",
    title: "Pass Confirmed & Gate Pass Ready",
    message: "Your entrance pass for Smart India Hackathon LPU 2026 is confirmed. Gate check-in opens at Block 34 / Shanti Devi Mittal Auditorium.",
    category: "ticket",
    timestamp: "10m ago",
    read: false,
    href: "/tickets",
    actionText: "View Pass",
  },
  {
    id: "notif-2",
    title: "New Squad Join Request",
    message: "Aarav Sharma (B.Tech CSE '26) requested to join your 'NextGen AI' hackathon team as UI/UX Lead.",
    category: "squad",
    timestamp: "45m ago",
    read: false,
    href: "/events/sih-lpu-internal-hackathon-2026",
    actionText: "Review Request",
  },
  {
    id: "notif-3",
    title: "Participation Certificate Unlocked",
    message: "Your official participation credential for GDG LPU DevFest 2026 is verified and ready for download.",
    category: "certificate",
    timestamp: "2h ago",
    read: false,
    href: "/tickets",
    actionText: "View Certificate",
  },
  {
    id: "notif-4",
    title: "Club Recruitment Update",
    message: "Robotics & AI Club LPU scheduled technical round interviews in Block 38, Lab 402.",
    category: "club",
    timestamp: "Yesterday",
    read: true,
    href: "/clubs/robotics-ai-club",
    actionText: "Club Details",
  },
  {
    id: "notif-5",
    title: "Campusly v2.4 Feature Release",
    message: "Hackathon Squad Finder and Verifiable Gate Certificates are now live for all LPU students!",
    category: "system",
    timestamp: "2 days ago",
    read: true,
    href: "/feed",
    actionText: "Explore",
  },
];

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<CampusNotification[]>(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<"all" | "ticket" | "squad" | "certificate" | "club">("all");
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on outside click or ESC
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === "all") return true;
    return n.category === activeFilter;
  });

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getCategoryIcon = (category: CampusNotification["category"]) => {
    switch (category) {
      case "ticket":
        return <Calendar className="w-3.5 h-3.5 text-blue-500" />;
      case "squad":
        return <Users className="w-3.5 h-3.5 text-violet-500" />;
      case "certificate":
        return <Award className="w-3.5 h-3.5 text-amber-500" />;
      case "club":
        return <Building2 className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-primary" />;
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-8 h-8 rounded-lg border border-border/60 bg-card hover:bg-muted/60 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer relative ${
          isOpen ? "bg-muted/80 text-foreground ring-1 ring-border" : ""
        }`}
        title="Campus Notifications"
        aria-label="Campus Notifications"
      >
        <Bell className="w-3.5 h-3.5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white shadow-xs animate-in zoom-in-50">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-border/80 bg-card shadow-2xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border/70 flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">Notifications</span>
              {unreadCount > 0 ? (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {unreadCount} new
                </span>
              ) : (
                <span className="text-[10px] font-medium text-muted-foreground">
                  All caught up
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all as read</span>
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="px-3 py-2 border-b border-border/60 flex items-center gap-1 overflow-x-auto no-scrollbar bg-background/50">
            {[
              { id: "all", label: "All" },
              { id: "ticket", label: "Tickets" },
              { id: "squad", label: "Squads" },
              { id: "certificate", label: "Certs" },
              { id: "club", label: "Clubs" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all shrink-0 cursor-pointer ${
                  activeFilter === tab.id
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notification Items List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-border/50">
            {filteredNotifications.length === 0 ? (
              <div className="py-10 text-center px-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mx-auto mb-2 text-muted-foreground">
                  <Bell className="w-4 h-4 opacity-60" />
                </div>
                <p className="text-xs font-semibold text-foreground">No notifications</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  You have no notifications in this category right now.
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-3.5 hover:bg-muted/40 transition-colors flex items-start gap-3 cursor-pointer ${
                    !notif.read ? "bg-primary/[0.03]" : ""
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-muted/80 flex items-center justify-center shrink-0 mt-0.5 border border-border/60">
                    {getCategoryIcon(notif.category)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4
                        className={`text-xs truncate ${
                          !notif.read ? "font-bold text-foreground" : "font-medium text-foreground/80"
                        }`}
                      >
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                      {notif.message}
                    </p>

                    {notif.href && (
                      <div className="mt-2 flex items-center justify-between">
                        <Link
                          href={notif.href}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary hover:underline"
                        >
                          <span>{notif.actionText || "View"}</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>

                        {!notif.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-muted/20 border-t border-border/70 text-center">
            <span className="text-[10px] text-muted-foreground font-medium flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>Real-time LPU Campus Notification Stream</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
