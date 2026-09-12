"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl border border-border/80 bg-gradient-to-b from-muted/50 to-muted/20 p-8 sm:p-12 text-center shadow-sm relative overflow-hidden">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-background text-xs font-semibold text-foreground/80 mb-5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Built for students, by students</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
            Ready to find your campus crew?
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed">
            Join Campusly to connect with hackathon partners, join top student clubs, and discover projects happening around you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/login?mode=register">
              <Button size="lg" className="rounded-xl px-7 gap-2 shadow-sm font-medium">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="rounded-xl px-6 text-foreground hover:bg-muted/50">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
