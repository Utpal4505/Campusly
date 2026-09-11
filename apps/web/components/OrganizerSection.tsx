"use client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  CalendarPlus,
  Tags,
  Sparkles,
  Users,
  ArrowRight,
} from "lucide-react"

const steps = [
  {
    number: 1,
    title: "Create Your Event",
    description:
      "Set up your event in minutes — add details, dates, venue, and everything attendees need to know.",
    icon: CalendarPlus,
  },
  {
    number: 2,
    title: "Tag Relevant Interests",
    description:
      "Select topics and categories so Campusly knows exactly which students would love your event.",
    icon: Tags,
  },
  {
    number: 3,
    title: "Smart Discovery",
    description:
      "Campusly's matching engine surfaces your event to students whose interests align — no spam, just relevance.",
    icon: Sparkles,
  },
  {
    number: 4,
    title: "Students Discover & Register",
    description:
      "Interested students find your event naturally in their feed, explore the details, and register with one tap.",
    icon: Users,
  },
]

export default function OrganizerSection() {
  return (
    <section className="py-24 md:py-32 bg-background px-4">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <Badge variant="secondary" className="mb-4 text-sm px-4 py-1">
          For Organizers
        </Badge>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Reach the students who{" "}
          <span className="text-primary">actually care</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Stop shouting into the void. Four simple steps to get your event in
          front of the right audience.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative max-w-2xl mx-auto">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isLast = index === steps.length - 1

          return (
            <div key={step.number} className="relative flex gap-6 pb-12 last:pb-0 group">
              {/* Vertical connector line */}
              {!isLast && (
                <div className="absolute left-[23px] top-[56px] w-px h-[calc(100%-40px)] bg-border group-hover:bg-primary/30 transition-colors duration-300" />
              )}

              {/* Number circle */}
              <div className="relative z-10 flex-shrink-0">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-sm group-hover:scale-110 group-hover:shadow-md ${
                    isLast
                      ? "bg-primary text-primary-foreground shadow-primary/25 group-hover:shadow-primary/40"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  }`}
                >
                  {step.number}
                </div>
              </div>

              {/* Content card */}
              <Card
                className={`flex-1 p-6 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg ${
                  isLast
                    ? "border-primary/30 bg-primary/[0.03] group-hover:border-primary/50 group-hover:shadow-primary/10"
                    : "group-hover:border-primary/20"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>

                    {isLast && (
                      <div className="pt-3">
                        <Link href="/dashboard">
                          <Button size="sm" className="gap-2 group/btn">
                            View Dashboard
                            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>

                  <div
                    className={`p-2.5 rounded-xl transition-colors duration-300 ${
                      isLast
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </Card>
            </div>
          )
        })}
      </div>
    </section>
  )
}
