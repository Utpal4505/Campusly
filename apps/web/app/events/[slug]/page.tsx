"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AppHeader from "@/components/AppHeader";
import {
  ArrowLeft,
  Heart,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Zap,
  Sparkles,
  Share2,
  Trophy,
  Clock,
  Ticket,
} from "lucide-react";

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [isSaved, setIsSaved] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <AppHeader />

      {/* Main Event Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6">
        
        {/* Top Breadcrumb & Actions */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/feed"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to For You Feed</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsSaved(!isSaved)}
            className={`h-8 px-3 rounded-lg border border-border/60 bg-card flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer ${
              isSaved ? "text-red-500 border-red-200 bg-red-500/5" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-red-500" : ""}`} />
            <span>{isSaved ? "Saved" : "Save"}</span>
          </button>
        </div>
        
        {/* Registration Success Overlay / Card if registered */}
        {isRegistered ? (
          <div className="py-12 px-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/[0.03] text-center max-w-lg mx-auto shadow-sm animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
              You&apos;re registered!
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              A pass has been reserved in your name. Bring your student ID to check in.
            </p>

            <div className="p-4 rounded-2xl border border-border/70 bg-card text-left mb-6 space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-border/50">
                <span className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Pass #CAMPUS-8841
                </span>
                <Badge variant="secondary" className="text-[10px] text-emerald-700 bg-emerald-50 border-emerald-200">
                  Confirmed
                </Badge>
              </div>
              <h3 className="font-bold text-base text-foreground">
                GenAI Hackathon 2026
              </h3>
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary/70" />
                  <span>12 September · 6:00 PM</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary/70" />
                  <span>LPU Campus · Main Auditorium</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/feed" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto rounded-xl px-6 font-semibold text-xs shadow-xs">
                  Back to For You
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => setIsRegistered(false)}
                className="w-full sm:w-auto rounded-xl px-5 text-xs text-muted-foreground hover:text-foreground"
              >
                View event details
              </Button>
            </div>
          </div>
        ) : (
          /* Normal Event Detail View */
          <div>
            {/* Event Visual Banner */}
            <div className="w-full h-48 sm:h-64 rounded-2xl bg-gradient-to-tr from-blue-900 via-indigo-900 to-purple-950 p-6 flex flex-col justify-between text-white relative overflow-hidden mb-6 shadow-sm">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-[size:16px_16px]" />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20">
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  Campus Hackathon
                </span>
                <span className="text-xs font-medium text-white/80 bg-black/30 px-2.5 py-1 rounded-full backdrop-blur-sm">
                  ₹50,000 in Prizes
                </span>
              </div>

              <div className="relative z-10">
                <span className="text-xs font-mono uppercase tracking-widest text-blue-300">
                  Flagship Event
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mt-1">
                  GENAI HACKATHON
                </h1>
                <p className="text-sm text-white/80 font-medium mt-1">
                  Build. Compete. Ship.
                </p>
              </div>
            </div>

            {/* Host & Key Meta */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mb-1">
                  <Zap className="w-3.5 h-3.5" />
                  Hosted by Coding Blocks
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted-foreground mt-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary/70" />
                    <span className="text-foreground font-medium">12 September · 6:00 PM</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary/70" />
                    <span>LPU Campus (Block 32)</span>
                  </div>
                </div>
              </div>

              <div className="sm:text-right">
                <div className="text-2xl font-extrabold text-foreground">₹249</div>
                <div className="text-xs text-muted-foreground">Entry fee per attendee</div>
              </div>
            </div>

            {/* About Section */}
            <section className="mb-8">
              <h2 className="text-base font-bold text-foreground mb-3">
                About the Event
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Build innovative solutions using generative AI, large language models, and agentic workflows.
                Compete with the top student developers on campus, showcase your prototypes to industry judges,
                and connect with potential co-founders.
              </p>
            </section>

            {/* What to Expect */}
            <section className="mb-8">
              <h2 className="text-base font-bold text-foreground mb-3">
                What to expect
              </h2>
              <div className="grid sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-border/60 bg-card">
                  <div className="font-semibold text-foreground mb-1">⚡ Team Challenge</div>
                  <div className="text-muted-foreground">Teams of 2–4 builders. Solo participants matched at kickoff.</div>
                </div>
                <div className="p-3.5 rounded-xl border border-border/60 bg-card">
                  <div className="font-semibold text-foreground mb-1">🤝 Mentors & Network</div>
                  <div className="text-muted-foreground">Hands-on mentorship from senior builders and tech alumni.</div>
                </div>
                <div className="p-3.5 rounded-xl border border-border/60 bg-card">
                  <div className="font-semibold text-foreground mb-1">🏆 Prizes & Demos</div>
                  <div className="text-muted-foreground">Pitch live on stage. Winner certificates and cash pool.</div>
                </div>
              </div>
            </section>

            {/* Relevant to you */}
            <section className="mb-10">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Relevant to your interests
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  AI & Machine Learning
                </span>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Hackathons
                </span>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Web Development
                </span>
              </div>
            </section>

            {/* Bottom Action Card */}
            <div className="sticky bottom-4 z-40 p-4 rounded-2xl border border-border/80 bg-card/95 backdrop-blur-md shadow-lg flex items-center justify-between gap-4">
              <div>
                <div className="text-xs text-muted-foreground font-medium">Standard Registration</div>
                <div className="text-lg font-bold text-foreground">₹249</div>
              </div>

              <Button
                size="lg"
                onClick={() => setIsRegistered(true)}
                className="rounded-xl px-7 text-xs font-bold shadow-xs gap-2"
              >
                Register Now
                <Ticket className="w-4 h-4" />
              </Button>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-muted-foreground border-t border-border/40 bg-muted/20">
        Campusly • Event Discovery & Registration
      </footer>

    </div>
  );
}
