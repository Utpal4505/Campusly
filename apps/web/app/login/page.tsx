"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { useCampusStore } from "@/lib/store";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  GraduationCap,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setUserName, setInterests } = useCampusStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const firstPart = email ? (email.split("@")[0] ?? "Utpal") : "Utpal";
    const extractedName = firstPart.replace(/[._]/g, " ");
    const formattedName =
      extractedName.charAt(0).toUpperCase() + extractedName.slice(1);

    setUserName(formattedName || "Utpal");

    setTimeout(() => {
      router.push("/feed");
    }, 600);
  };

  const handleFastTrack = (name: string, roleInterests: string[]) => {
    setUserName(name);
    setInterests(roleInterests);
    router.push("/feed");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      
      {/* Top Bar */}
      <header className="w-full border-b border-border/60 bg-background/90 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Campusly</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Login Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          
          {/* Card */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xl shadow-black/5">
            
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground font-extrabold text-lg flex items-center justify-center mx-auto mb-3.5 shadow-xs">
                C
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Log in to Campusly
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Enter your university credentials to explore personalized opportunities.
              </p>
            </div>

            {/* Fast-Track Demo Switchers */}
            <div className="mb-6 p-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.04] space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>1-Click Hackathon Demo Logins</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleFastTrack("Rahul Sharma", ["AI", "Web Dev", "Python"])}
                  className="p-2.5 rounded-xl border border-border/70 bg-card hover:border-primary text-left transition-all cursor-pointer group shadow-2xs"
                >
                  <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                    Rahul Sharma
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    CSE · AI & Backend
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleFastTrack("Ananya Singh", ["Design", "UI/UX", "Startups"])}
                  className="p-2.5 rounded-xl border border-border/70 bg-card hover:border-primary text-left transition-all cursor-pointer group shadow-2xs"
                >
                  <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                    Ananya Singh
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Design & CS · UI/UX
                  </div>
                </button>
              </div>
            </div>

            <div className="relative flex items-center justify-center mb-5">
              <div className="border-t border-border/60 w-full" />
              <span className="bg-card px-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider shrink-0">
                or sign in with email
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleStandardLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Campus Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full h-10 pl-9 pr-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    Password
                  </label>
                  <span className="text-[11px] text-primary hover:underline cursor-pointer">
                    Forgot?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-10 pl-9 pr-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/60 transition-colors"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 rounded-xl text-xs font-bold gap-2 shadow-xs cursor-pointer mt-2"
              >
                {isLoading ? (
                  <span>Logging in...</span>
                ) : (
                  <>
                    <span>Log In to Feed</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </Button>
            </form>

            {/* Security Guarantee */}
            <div className="flex items-center justify-center gap-1.5 mt-5 text-[11px] text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Restricted to verified university students</span>
            </div>

            {/* Footer switcher */}
            <div className="mt-6 pt-5 border-t border-border/60 text-center text-xs text-muted-foreground">
              New to Campusly?{" "}
              <Link
                href="/onboarding"
                className="font-semibold text-primary hover:underline"
              >
                Personalize your feed →
              </Link>
            </div>

          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="w-full py-4 text-center text-xs text-muted-foreground border-t border-border/40 bg-muted/20">
        Campusly • Verified campus opportunity network
      </footer>

    </div>
  );
}
