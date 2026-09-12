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
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setUserName, setInterests } = useCampusStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    const firstPart = email ? (email.split("@")[0] ?? "Utpal") : "Utpal";
    const extractedName = firstPart.replace(/[._]/g, " ");
    const formattedName =
      extractedName.charAt(0).toUpperCase() + extractedName.slice(1);

    setUserName(formattedName || "Utpal");

    setTimeout(() => {
      router.push("/feed");
    }, 500);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setUserName("Utpal (Google)");
    setInterests(["AI", "Web Dev", "Hackathons"]);
    setTimeout(() => {
      router.push("/feed");
    }, 500);
  };

  const handleFastTrack = (name: string, roleInterests: string[]) => {
    setIsLoading(true);
    setUserName(name);
    setInterests(roleInterests);
    setTimeout(() => {
      router.push("/feed");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Top Header Bar */}
      <header className="w-full border-b border-border/60 bg-background/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
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

      {/* Main Login Canvas */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xl shadow-black/5 dark:shadow-black/20">
            
            {/* Brand Logo & Welcome Header */}
            <div className="text-center mb-6">
              <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-extrabold text-sm shadow-xs transition-transform group-hover:scale-105">
                  C
                </div>
                <span className="text-lg font-bold tracking-tight text-foreground">
                  Campusly
                </span>
              </Link>

              <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center justify-center gap-1.5">
                <span>Welcome back</span>
                <span>👋</span>
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Continue your campus journey
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full h-10 pl-10 pr-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground/60 transition-colors"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-foreground">
                    Password
                  </label>
                  <span className="text-[11px] text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                    Forgot?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-10 pl-10 pr-10 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground/60 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-1"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 rounded-xl text-xs font-bold gap-2 shadow-xs cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 mt-2 transition-all"
              >
                {isLoading ? (
                  <span>Logging in...</span>
                ) : (
                  <>
                    <span>Log in</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-5">
              <div className="border-t border-border/60 w-full" />
              <span className="bg-card px-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider shrink-0">
                or
              </span>
            </div>

            {/* Continue with Google */}
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={handleGoogleLogin}
              className="w-full h-10 rounded-xl text-xs font-semibold gap-2.5 border-border/80 bg-card hover:bg-muted/50 text-foreground cursor-pointer shadow-2xs transition-all"
            >
              {/* Google Multi-Color SVG Icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </Button>

            {/* Quick 1-Click Persona Badges for Judge Demo */}
            <div className="mt-5 p-3 rounded-2xl border border-border/60 bg-muted/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span>1-Click Demo Logins</span>
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  Fast-Track
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleFastTrack("Rahul Sharma", ["AI", "Web Dev", "Python"])}
                  className="p-2 rounded-xl border border-border/70 bg-card hover:border-primary text-left transition-all cursor-pointer shadow-2xs group"
                >
                  <div className="text-xs font-bold text-foreground group-hover:text-primary truncate">
                    Rahul Sharma
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    CSE · AI Lead
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleFastTrack("Ananya Singh", ["Design", "UI/UX", "Startups"])}
                  className="p-2 rounded-xl border border-border/70 bg-card hover:border-primary text-left transition-all cursor-pointer shadow-2xs group"
                >
                  <div className="text-xs font-bold text-foreground group-hover:text-primary truncate">
                    Ananya Singh
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    Design · UI/UX
                  </div>
                </button>
              </div>
            </div>

            {/* Footer Switcher */}
            <div className="mt-6 pt-5 border-t border-border/60 text-center text-xs text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/onboarding"
                className="font-semibold text-primary hover:underline transition-colors"
              >
                Create account
              </Link>
            </div>

          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-1.5 mt-4 text-[11px] text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Encrypted campus session · LPU Student Network</span>
          </div>

        </div>
      </main>

      {/* Simple Footer */}
      <footer className="w-full py-3 text-center text-xs text-muted-foreground border-t border-border/40 bg-muted/10">
        Campusly • Verified student opportunity network
      </footer>
    </div>
  );
}
