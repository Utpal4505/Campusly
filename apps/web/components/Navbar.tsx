"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-xs transition-transform group-hover:scale-105">
              C
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-foreground">
                Campusly
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <Link
              href="/explore"
              className="px-2.5 py-1.5 rounded-md hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              Explore Feed
            </Link>
            <Link
              href="/hackathons"
              className="px-2.5 py-1.5 rounded-md hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              Hackathons
            </Link>
            <Link
              href="/clubs"
              className="px-2.5 py-1.5 rounded-md hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              Clubs
            </Link>
            <Link
              href="/organizers"
              className="px-2.5 py-1.5 rounded-md hover:text-foreground hover:bg-muted/60 transition-colors"
            >
              For Organizers
            </Link>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-md"
          >
            Log in
          </Link>
          <Link href="/onboarding">
            <Button size="sm" className="h-8 rounded-lg px-3.5 text-xs font-semibold shadow-xs">
              Get Started
            </Button>
          </Link>
        </div>

      </div>
    </nav>
  );
}
