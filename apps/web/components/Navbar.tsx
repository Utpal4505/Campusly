"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-xs transition-transform group-hover:scale-105">
              C
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-foreground">
                Campusly
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-muted text-muted-foreground border border-border/60 hidden sm:inline-block">
                LPU
              </span>
            </div>
          </Link>
        </div>

        {/* Center Segmented Navigation Pills */}
        <div className="hidden md:flex items-center p-1 rounded-xl bg-muted/40 border border-border/60 text-xs">
          <Link
            href="/feed"
            className="px-3.5 py-1.5 rounded-lg font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
          >
            For You
          </Link>
          <Link
            href="/events"
            className="px-3.5 py-1.5 rounded-lg font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
          >
            Events
          </Link>
          <Link
            href="/people"
            className="px-3.5 py-1.5 rounded-lg font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
          >
            People
          </Link>
        </div>

        {/* Right 32px Action Group */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/onboarding">
            <Button size="sm" className="h-8 rounded-lg px-3.5 text-xs font-semibold shadow-xs cursor-pointer">
              Get Started
            </Button>
          </Link>
        </div>

      </div>
    </nav>
  );
}
