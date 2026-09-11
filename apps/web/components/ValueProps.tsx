"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Compass, Users2, CalendarCheck, ArrowRight, Check } from "lucide-react";

export default function ValueProps() {
  return (
    <section className="py-16 md:py-20 bg-background border-b border-border/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-lg mx-auto mb-12">
          <Badge variant="outline" className="mb-3 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            How Campusly Works
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3 flex items-center justify-center gap-2 flex-wrap">
            <span>Discover</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground/60 shrink-0" />
            <span>Connect</span>
            <ArrowRight className="w-4 h-4 text-muted-foreground/60 shrink-0" />
            <span>Participate</span>
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The direct path from wanting to build something to having a team, an event, and a confirmed plan.
          </p>
        </div>

        {/* 3 Step Cards with embedded Mini UI Previews */}
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          
          {/* Card 1: Discover */}
          <Card className="p-5 rounded-2xl border border-border/80 bg-card shadow-2xs hover:border-primary/40 hover:shadow-xs transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-200/80 dark:border-blue-900/60">
                  <Compass className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-muted-foreground/70 tracking-wider">
                  01 DISCOVER
                </span>
              </div>

              <h3 className="text-base font-bold text-foreground mb-1.5">
                Discover Opportunities
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                No more combing through 10 WhatsApp groups. Every club, hackathon, and workshop is tagged and ranked for you.
              </p>
            </div>

            {/* Mini Visual Snippet: Discovery Chips */}
            <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1.5 mt-2">
              <div className="flex items-center justify-between text-[11px] bg-card p-2 rounded-lg border border-border/60 shadow-2xs">
                <span className="font-medium text-foreground">⚡ GenAI Hackathon</span>
                <span className="text-muted-foreground text-[10px] font-medium">Tomorrow</span>
              </div>
              <div className="flex items-center justify-between text-[11px] bg-card p-2 rounded-lg border border-border/60 shadow-2xs">
                <span className="font-medium text-foreground">🏛️ AI & Robotics Society</span>
                <span className="text-muted-foreground text-[10px] font-medium">Weekly</span>
              </div>
              <div className="flex items-center justify-between text-[11px] bg-card p-2 rounded-lg border border-border/60 shadow-2xs">
                <span className="font-medium text-foreground">🚀 Resume Analyzer Collab</span>
                <span className="text-muted-foreground text-[10px] font-medium">Open Role</span>
              </div>
            </div>
          </Card>

          {/* Card 2: Connect */}
          <Card className="p-5 rounded-2xl border border-border/80 bg-card shadow-2xs hover:border-primary/40 hover:shadow-xs transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400 border border-purple-200/80 dark:border-purple-900/60">
                  <Users2 className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-muted-foreground/70 tracking-wider">
                  02 CONNECT
                </span>
              </div>

              <h3 className="text-base font-bold text-foreground mb-1.5">
                Connect with Teammates
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                Filter verified students by tech stack, batch, and hackathon interest. Send 1-tap collaboration requests.
              </p>
            </div>

            {/* Mini Visual Snippet: Teammate Match Card */}
            <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-2 mt-2">
              <div className="bg-card p-2.5 rounded-lg border border-border/60 shadow-2xs">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center">
                    RS
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-foreground leading-none">Rahul Sharma</div>
                    <div className="text-[9px] text-muted-foreground mt-0.5">3rd Year CS · FastAPI, PyTorch</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-border/40">
                  <span className="text-muted-foreground">Needs Frontend</span>
                  <span className="text-primary font-semibold hover:underline cursor-pointer">Invite Teammate →</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Card 3: Participate */}
          <Card className="p-5 rounded-2xl border border-border/80 bg-card shadow-2xs hover:border-primary/40 hover:shadow-xs transition-all duration-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-900/60">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-muted-foreground/70 tracking-wider">
                  03 PARTICIPATE
                </span>
              </div>

              <h3 className="text-base font-bold text-foreground mb-1.5">
                Participate & Build
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                RSVP directly through Campusly. Track team submissions, venue updates, and never miss calendar reminders.
              </p>
            </div>

            {/* Mini Visual Snippet: RSVP Pass */}
            <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-2 mt-2">
              <div className="bg-card p-2.5 rounded-lg border border-border/60 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-900/40">
                    <Check className="w-2.5 h-2.5" /> RSVP Confirmed
                  </span>
                  <span className="text-[9px] text-muted-foreground font-mono">#CAMPUS-26</span>
                </div>
                <div className="text-[11px] font-semibold text-foreground">GenAI Hackathon 2026</div>
                <div className="text-[9px] text-muted-foreground">Team: NeuralGuild (4/4 Members)</div>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </section>
  );
}
