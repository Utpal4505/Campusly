"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FeedItem {
  type: "event" | "club" | "person" | "project";
  title: string;
  match: number;
  subtitle?: string;
  description?: string;
}

const feedData: FeedItem[] = [
  { type: "event", title: "GenAI Hackathon", match: 96 },
  { type: "club", title: "AI Club", match: 91 },
  { type: "person", title: "Rahul Sharma", match: 89, subtitle: "AI · Backend", description: "Looking for teammates" },
  { type: "project", title: "AI Resume Analyzer", match: 84, subtitle: "Project", description: "Looking for: Backend developer" },
];

const typeConfig: Record<FeedItem["type"], { label: string; variant: "default" | "secondary" | "destructive" | "outline"; emoji: string }> = {
  event: { label: "Event", variant: "default", emoji: "🎯" },
  club: { label: "Club", variant: "secondary", emoji: "🏛️" },
  person: { label: "Person", variant: "outline", emoji: "👤" },
  project: { label: "Project", variant: "secondary", emoji: "🚀" },
};

function MatchBar({ match }: { match: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-500"
          style={{ width: `${match}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
        {match}%
      </span>
    </div>
  );
}

export default function ProductPreview() {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <Badge variant="outline" className="mb-4 px-4 py-1 text-xs font-medium tracking-wide uppercase">
            Smart Matching
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Your personalized feed
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            AI-powered recommendations tailored to your interests, skills, and goals.
          </p>
        </div>

        {/* Feed cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mx-auto">
          {feedData.map((item) => {
            const config = typeConfig[item.type];
            return (
              <Card
                key={item.title}
                className="group relative p-6 flex flex-col justify-between min-h-[220px] rounded-2xl border border-border/60 bg-card shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden"
              >
                {/* Subtle gradient glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative z-10">
                  {/* Type badge + emoji */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg">{config.emoji}</span>
                    <Badge variant={config.variant} className="text-[11px] font-medium tracking-wide uppercase">
                      {config.label}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-lg leading-snug mb-1.5 group-hover:text-primary transition-colors duration-200">
                    {item.title}
                  </h3>

                  {/* Subtitle */}
                  {item.subtitle && (
                    <p className="text-sm text-muted-foreground font-medium mb-1">
                      {item.subtitle}
                    </p>
                  )}

                  {/* Description */}
                  {item.description && (
                    <p className="text-sm text-muted-foreground/80 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Match bar at bottom */}
                <div className="relative z-10 mt-5 pt-4 border-t border-border/40">
                  <MatchBar match={item.match} />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
