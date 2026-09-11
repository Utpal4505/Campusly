"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { XCircle, CheckCircle2, BellOff, Sparkles } from "lucide-react";

export default function ProblemSection() {
  return (
    <section className="py-16 md:py-20 bg-muted/30 border-b border-border/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-xl mx-auto mb-10">
          <Badge variant="outline" className="mb-3 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            The Difference
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground max-w-lg mx-auto leading-snug">
            Built to replace fragmented campus communication
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          
          {/* Left: The Old Way */}
          <Card className="p-6 rounded-2xl border border-red-200/70 dark:border-red-950/60 bg-card shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 text-red-600 dark:text-red-400 font-semibold text-xs uppercase tracking-wider">
                <XCircle className="w-4 h-4" />
                <span>The Fragmented Reality</span>
              </div>
              
              <ul className="space-y-3.5 text-xs sm:text-sm text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 mt-0.5 shrink-0">•</span>
                  <span><strong>Endless WhatsApp noise:</strong> Scrambling across 15 muted groups and expired Instagram stories to find hackathon links.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 mt-0.5 shrink-0">•</span>
                  <span><strong>Teammate hunting friction:</strong> Posting "anyone know Python/backend?" into dead Discord channels with zero replies.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 mt-0.5 shrink-0">•</span>
                  <span><strong>Missed opportunities:</strong> Learning about a flagship hackathon or club recruitment the day after registration closed.</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-border/50 text-xs text-muted-foreground font-medium flex items-center gap-2">
              <BellOff className="w-4 h-4 text-muted-foreground/70" />
              <span>Result: Constant FOMO and low student participation</span>
            </div>
          </Card>

          {/* Right: The Campusly Way */}
          <Card className="p-6 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/60 bg-card shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 text-emerald-700 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>The Campusly Standard</span>
              </div>
              
              <ul className="space-y-3.5 text-xs sm:text-sm text-foreground/90">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0">✓</span>
                  <span><strong>One unified campus feed:</strong> Smart relevance ranking curates clubs, events, and initiatives for your major and interests.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0">✓</span>
                  <span><strong>Skill-based peer matching:</strong> Connect with vetted peers filtered by tech stack, graduation year, and building goals.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0">✓</span>
                  <span><strong>1-tap participation:</strong> Direct RSVPs, verified team roster creation, and automated calendar notifications.</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-border/50 text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Result: Direct connection with zero spam or lost announcements</span>
            </div>
          </Card>

        </div>
      </div>
    </section>
  );
}
