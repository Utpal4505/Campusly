"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { useCampusStore } from "@/lib/store";
import { getAnimeAvatar } from "@/lib/avatars";
import {
  Sparkles,
  Users,
  Calendar,
  MessageSquare,
  Plus,
  SlidersHorizontal,
} from "lucide-react";

export default function AppHeader() {
  const pathname = usePathname();
  const { userName, setCreateModalOpen, setEditInterestsOpen } = useCampusStore();

  const navLinks = [
    { href: "/feed", label: "For You", icon: Sparkles },
    { href: "/events/genai-hackathon", label: "Events", icon: Calendar },
    { href: "/people", label: "People", icon: Users },
    { href: "/messages/rahul-sharma", label: "Messages", icon: MessageSquare, badge: "1" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/95 backdrop-blur-md">
        <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          
          {/* Zone 1: Left Brand Anchor */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/feed" className="flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground text-background font-bold text-xs shadow-xs transition-transform group-hover:scale-105">
                C
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-foreground leading-none">
                  Campusly
                </span>
                <span className="text-[10px] text-muted-foreground font-medium leading-tight mt-0.5 hidden sm:inline-block">
                  Student Network
                </span>
              </div>
            </Link>
          </div>

          {/* Zone 2: Center Segmented Navigation (Linear/Vercel Style) */}
          <nav className="hidden md:flex items-center p-1 rounded-xl bg-muted/40 border border-border/60 text-xs">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/feed" && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-lg font-medium transition-all relative flex items-center gap-1.5 ${
                    isActive
                      ? "bg-card text-foreground font-semibold shadow-xs border border-border/80"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-primary text-primary-foreground">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Right Unified 32px Action Group */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Quick Create Button */}
            <Button
              size="sm"
              onClick={() => setCreateModalOpen(true)}
              className="h-8 px-3 rounded-lg text-xs font-semibold shadow-xs gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post</span>
            </Button>

            {/* Quick Preferences Trigger */}
            <button
              type="button"
              onClick={() => setEditInterestsOpen(true)}
              className="w-8 h-8 rounded-lg border border-border/60 bg-card hover:bg-muted/60 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer hidden sm:flex"
              title="Edit personalized feed interests"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>

            {/* Dark / Light Theme Toggle */}
            <ThemeToggle />

            <div className="w-px h-4 bg-border/60 mx-0.5 hidden sm:block" />

            {/* User Profile Pill */}
            <button
              type="button"
              onClick={() => setEditInterestsOpen(true)}
              className="h-8 pl-1 pr-2.5 rounded-lg border border-border/60 bg-card hover:bg-muted/60 flex items-center gap-2 transition-colors cursor-pointer"
              title="User Profile & Interests"
            >
              <div className="w-6 h-6 rounded-md overflow-hidden border border-border/70 flex items-center justify-center bg-muted/20">
                <img
                  src={getAnimeAvatar(userName, "Utpal")}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-semibold text-foreground hidden sm:inline-block">
                {userName}
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Hidden on desktop & message chat) */}
      {!pathname.startsWith("/messages") && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border/70 bg-background/95 backdrop-blur-md px-3 py-2 flex items-center justify-around shadow-lg">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/feed" && pathname.startsWith(link.href));
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center py-0.5 px-3 rounded-xl text-[11px] font-medium transition-colors relative ${
                  isActive
                    ? "text-foreground font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="relative">
                  <Icon className="w-4 h-4 mb-0.5" />
                  {link.badge && (
                    <span className="absolute -top-1 -right-2 px-1 rounded-full text-[8px] font-bold bg-primary text-primary-foreground">
                      {link.badge}
                    </span>
                  )}
                </div>
                <span>{link.label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setEditInterestsOpen(true)}
            className="flex flex-col items-center justify-center py-0.5 px-3 rounded-xl text-[11px] font-medium transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 mb-0.5" />
            <span>Preferences</span>
          </button>
        </nav>
      )}
    </>
  );
}
