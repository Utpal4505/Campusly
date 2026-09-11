"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AppHeader from "@/components/AppHeader";
import {
  ArrowLeft,
  MessageSquare,
  UserPlus,
  Check,
  Building2,
  Code2,
  Calendar,
  Sparkles,
} from "lucide-react";

interface StudentData {
  name: string;
  avatar: string;
  degree: string;
  about: string;
  interests: string[];
  lookingFor: string[];
  recentActivity: string[];
}

const students: Record<string, StudentData> = {
  "rahul-sharma": {
    name: "Rahul Sharma",
    avatar: "RS",
    degree: "CSE · 2nd Year",
    about: "Building things around generative AI, developer tooling, and autonomous agents.",
    interests: ["AI", "Backend", "Web Dev", "Startups"],
    lookingFor: ["Hackathon teammates", "Side Projects", "Co-founders"],
    recentActivity: [
      "Joined AI Club",
      "Building backend for AI Resume Analyzer",
      "Looking for teammate for GenAI Hackathon",
    ],
  },
  "ananya-singh": {
    name: "Ananya Singh",
    avatar: "AS",
    degree: "Design & CS · 3rd Year",
    about: "Product designer and frontend builder interested in student-focused venture ideas.",
    interests: ["UI/UX", "Product Design", "React", "Startups"],
    lookingFor: ["Full-stack engineers", "Startup collaborators"],
    recentActivity: [
      "Designed UI kit for Campusly community",
      "Speaker at Design & Build Guild meetup",
      "Participating in GenAI Hackathon",
    ],
  },
  "dev-kapoor": {
    name: "Dev Kapoor",
    avatar: "DK",
    degree: "Software Engineering · 2nd Year",
    about: "Working on campus utilities and cross-platform mobile apps with Flutter & React Native.",
    interests: ["Web Dev", "Mobile", "TypeScript", "Open Source"],
    lookingFor: ["Hackathon designers", "Backend engineers"],
    recentActivity: [
      "Released Campus Timetable PWA",
      "Organized Open Source Campus sprint",
      "Looking for teammates for GenAI Hackathon",
    ],
  },
  "priya-verma": {
    name: "Priya Verma",
    avatar: "PV",
    degree: "Data Science & AI · 3rd Year",
    about: "Looking for research collaborators and hackathon partners for multi-modal LLM applications.",
    interests: ["AI", "Research", "PyTorch", "Data Science"],
    lookingFor: ["ML Engineers", "Research mentors"],
    recentActivity: [
      "Published paper summary on Diffusion Models",
      "Mentoring freshmen in Python for Data Science",
      "Active participant in AI Club",
    ],
  },
};

export default function StudentProfilePage() {
  const params = useParams();
  const rawSlug = (params?.slug as string) || "rahul-sharma";
  const slug = rawSlug.toLowerCase();

  const student = students[slug] || {
    name: rawSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    avatar: rawSlug.substring(0, 2).toUpperCase(),
    degree: "Computer Science · Student",
    about: "Student builder passionate about campus projects and hackathons.",
    interests: ["Technology", "AI", "Development"],
    lookingFor: ["Teammates", "Events"],
    recentActivity: ["Joined Campusly", "Browsing opportunities"],
  };

  const [isConnected, setIsConnected] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <AppHeader />

      {/* Main Profile */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 sm:px-6 py-6">
        
        {/* Top Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/people"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to People</span>
          </Link>
        </div>
        
        {/* Profile Card Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 text-primary font-bold text-2xl flex items-center justify-center mx-auto mb-3.5 shadow-sm border border-border/80">
            {student.avatar}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {student.name}
          </h1>
          <p className="text-xs font-medium text-muted-foreground mt-0.5">
            {student.degree}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-2.5 mt-5">
            <Link href={`/messages/${slug}`}>
              <Button size="sm" className="rounded-xl px-5 gap-1.5 font-semibold text-xs shadow-xs">
                <MessageSquare className="w-3.5 h-3.5" />
                Message
              </Button>
            </Link>
            <Button
              size="sm"
              variant={isConnected ? "outline" : "secondary"}
              onClick={() => setIsConnected(!isConnected)}
              className="rounded-xl px-5 gap-1.5 font-semibold text-xs"
            >
              {isConnected ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Connected
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  Connect
                </>
              )}
            </Button>
          </div>
        </div>

        {/* About Section */}
        <div className="p-5 rounded-2xl border border-border/80 bg-card mb-4 shadow-2xs space-y-4">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              About
            </h2>
            <p className="text-sm text-foreground/90 leading-relaxed">
              {student.about}
            </p>
          </div>

          {/* Interests */}
          <div className="pt-3 border-t border-border/50">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Interests
            </h2>
            <div className="flex items-center gap-1.5 flex-wrap">
              {student.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-muted text-foreground border border-border/60"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Looking For */}
          <div className="pt-3 border-t border-border/50">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Looking for
            </h2>
            <div className="flex items-center gap-1.5 flex-wrap">
              {student.lookingFor.map((item) => (
                <span
                  key={item}
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/5 text-primary border border-primary/20"
                >
                  ✨ {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-5 rounded-2xl border border-border/80 bg-card shadow-2xs">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Recent Activity
          </h2>
          <ul className="space-y-2.5 text-xs text-muted-foreground">
            {student.recentActivity.map((act) => (
              <li key={act} className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span className="text-foreground/90">{act}</span>
              </li>
            ))}
          </ul>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-muted-foreground border-t border-border/40 bg-muted/20">
        Campusly • Student Profile
      </footer>

    </div>
  );
}
