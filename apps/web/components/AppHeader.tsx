"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { useCampusStore } from "@/lib/store";
import { getAnimeAvatar } from "@/lib/avatars";
import { useAuth } from "@/lib/auth-context";
import {
  Sparkles,
  Users,
  Calendar,
  Ticket,
  MessageSquare,
  Plus,
  SlidersHorizontal,
  LogOut,
  ChevronDown,
  User,
} from "lucide-react";

export default function AppHeader() {
  const pathname = usePathname();
  const { user, isAuthenticated, signOut } = useAuth();
  const {
    userName,
    setCreateModalOpen,
    setEditInterestsOpen,
  } = useCampusStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const displayName = user?.name || userName || "Student";
  const displayEmail = user?.email || "";

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const navLinks = [
    { href: "/feed", label: "For You", icon: Sparkles },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/tickets", label: "Tickets", icon: Ticket },
    { href: "/people", label: "People", icon: Users },
    { href: "/messages", label: "Messages", icon: MessageSquare, badge: "1" },
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
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all relative flex items-center gap-1.5 ${
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
            {isAuthenticated && (
              <Button
                size="sm"
                onClick={() => setCreateModalOpen(true)}
                className="h-8 px-3 rounded-lg text-xs font-semibold shadow-xs gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post</span>
              </Button>
            )}

            {/* Quick Preferences Trigger */}
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => setEditInterestsOpen(true)}
                className="w-8 h-8 rounded-lg border border-border/60 bg-card hover:bg-muted/60 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer hidden sm:flex"
                title="Edit personalized feed interests"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Dark / Light Theme Toggle */}
            <ThemeToggle />

            <div className="w-px h-4 bg-border/60 mx-0.5 hidden sm:block" />

            {/* User Profile / Auth State */}
            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="h-8 pl-1 pr-2 rounded-lg border border-border/60 bg-card hover:bg-muted/60 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="User Account Menu"
                >
                  <div className="w-6 h-6 rounded-md overflow-hidden border border-border/70 flex items-center justify-center bg-muted/20">
                    <img
                      src={getAnimeAvatar(displayName, "Utpal")}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-semibold text-foreground hidden sm:inline-block max-w-[90px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </button>

                {/* Dropdown Menu */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card p-1.5 shadow-xl z-50 animate-in fade-in-0 zoom-in-95">
                    <div className="px-2.5 py-2 border-b border-border/60 mb-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-semibold text-foreground truncate">{displayName}</p>
                        {user?.username && (
                          <span className="text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20 shrink-0">
                            @{user.username}
                          </span>
                        )}
                      </div>
                      {displayEmail && (
                        <p className="text-[11px] text-muted-foreground truncate">{displayEmail}</p>
                      )}
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="w-full px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted flex items-center gap-2 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-primary" />
                      <span>View Profile</span>
                    </Link>

                    <Link
                      href="/tickets"
                      onClick={() => setMenuOpen(false)}
                      className="w-full px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted flex items-center gap-2 transition-colors"
                    >
                      <Ticket className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>My Event Tickets</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        setEditInterestsOpen(true);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-muted flex items-center gap-2 transition-colors text-left cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Interests & Preferences</span>
                    </button>

                    <div className="h-px bg-border/60 my-1" />

                    <button
                      type="button"
                      onClick={async () => {
                        setMenuOpen(false);
                        await signOut();
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm" variant="outline" className="h-8 px-3 rounded-lg text-xs font-semibold">
                  Sign In
                </Button>
              </Link>
            )}

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
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => setEditInterestsOpen(true)}
              className="flex flex-col items-center justify-center py-0.5 px-3 rounded-xl text-[11px] font-medium transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 mb-0.5" />
              <span>Preferences</span>
            </button>
          )}
        </nav>
      )}
    </>
  );
}
