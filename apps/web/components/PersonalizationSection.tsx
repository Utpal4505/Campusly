"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import InterestChip from "@/components/ui/InterestChip"
import { Sparkles, TrendingUp, Zap } from "lucide-react"

const interests = [
  { label: "AI", preSelected: true },
  { label: "Web Development", preSelected: true },
  { label: "Startups", preSelected: false },
  { label: "Design", preSelected: true },
  { label: "Cybersecurity", preSelected: false },
  { label: "Robotics", preSelected: false },
  { label: "Open Source", preSelected: false },
  { label: "Data Science", preSelected: false },
]

const matchedItems = [
  {
    title: "AI Hackathon",
    description: "Build and pitch an AI-powered prototype in 36 hours",
    match: 95,
    tag: "Event",
    icon: <Zap className="w-4 h-4" />,
  },
  {
    title: "Design Sprint",
    description: "A weekend workshop on rapid UI/UX prototyping",
    match: 92,
    tag: "Workshop",
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    title: "Startup Mixer",
    description: "Network with founders and fellow student builders",
    match: 87,
    tag: "Meetup",
    icon: <Sparkles className="w-4 h-4" />,
  },
]

function getMatchColor(match: number) {
  if (match >= 90) return "text-emerald-600 dark:text-emerald-400"
  if (match >= 80) return "text-emerald-500 dark:text-emerald-500"
  return "text-emerald-400 dark:text-emerald-600"
}

function getMatchBg(match: number) {
  if (match >= 90) return "bg-emerald-50 dark:bg-emerald-950/40"
  if (match >= 80) return "bg-emerald-50/70 dark:bg-emerald-950/30"
  return "bg-emerald-50/50 dark:bg-emerald-950/20"
}

export default function PersonalizationSection() {
  return (
    <section className="py-20 md:py-28 bg-muted/50 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-xs tracking-wide uppercase px-3 py-1">
            Personalization
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Tell us what you&apos;re into
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
            Pick your interests and Campusly curates a feed that&apos;s{" "}
            <span className="text-foreground font-medium">uniquely yours</span>.
          </p>
        </div>

        {/* Interest chips - interactive demo feel */}
        <div className="flex flex-wrap gap-2.5 justify-center mb-10 max-w-2xl mx-auto">
          {interests.map(({ label, preSelected }) => (
            <InterestChip
              key={label}
              label={label}
              selected={preSelected}
            />
          ))}
        </div>

        {/* Divider with label */}
        <div className="flex items-center gap-4 max-w-md mx-auto mb-10">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary/60" />
            Your matches
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Matched event cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mx-auto max-w-4xl">
          {matchedItems.map((item) => (
            <Card
              key={item.title}
              className={`
                group relative p-5 flex flex-col gap-4
                border border-border/80
                bg-card hover:bg-card/80
                hover:shadow-lg hover:shadow-primary/5
                hover:-translate-y-0.5
                transition-all duration-300
              `}
            >
              {/* Top row: tag + match badge */}
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs font-medium gap-1">
                  {item.icon}
                  {item.tag}
                </Badge>
                <span
                  className={`
                    inline-flex items-center gap-1 text-sm font-semibold
                    px-2.5 py-0.5 rounded-full
                    ${getMatchBg(item.match)} ${getMatchColor(item.match)}
                  `}
                >
                  <Sparkles className="w-3 h-3" />
                  {item.match}%
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-foreground mb-1.5 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Match bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Match strength</span>
                  <span className={`font-medium ${getMatchColor(item.match)}`}>
                    {item.match >= 90 ? "Excellent" : item.match >= 80 ? "Great" : "Good"}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700"
                    style={{ width: `${item.match}%` }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
