"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { useCampusStore } from "@/lib/store";
import {
  Sparkles,
  Users,
  Calendar,
  MessageSquare,
  Plus,
  Search,
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
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        
        {/* Brand & Nav */}
        <div className="flex items-center gap-6">
          <Link href="/feed" className="flex items-center gap-2 group shrink-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-xs transition-transform group-hover:scale-105">
              C
            </div>
            <span className="text-base font-bold tracking-tight text-foreground">
              Campusly
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/feed" && pathname.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-muted text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-primary text-primary-foreground">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <button
              type="button"
              onClick={() => setEditInterestsOpen(true)}
              className="px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer"
              title="Edit personalized feed interests"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Preferences</span>
            </button>
          </nav>
        </div>

        {/* Right Actions: + Post, Search, Theme, Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            className="h-8 px-3 rounded-lg text-xs font-semibold shadow-xs gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post</span>
          </Button>

          <ThemeToggle />

          {/* User Profile Avatar with dropdown/modal trigger */}
          <button
            type="button"
            onClick={() => setEditInterestsOpen(true)}
            className="flex items-center gap-1.5 pl-1 hover:opacity-80 transition-opacity cursor-pointer"
            title="Edit Interests / Profile"
          >
            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-border/80">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-semibold text-foreground hidden lg:inline-block">
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
                  ? "text-primary font-bold"
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
