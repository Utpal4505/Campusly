"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { useCampusStore } from "@/lib/store";
import { getAnimeAvatar } from "@/lib/avatars";
import { authClient } from "@/lib/auth";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  User,
  Calendar,
  AlertCircle,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setUserName, setInterests } = useCampusStore();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check URL query parameters for ?mode=register
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("mode") === "register") {
        setMode("register");
      }
    }
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === "register") {
        const studentName = name.trim() || email.split("@")[0] || "Student";
        await authClient.signUp(email, password, studentName);
        try {
          const profile = await authClient.getMe();
          setUserName(profile.name);
        } catch {
          setUserName(studentName);
        }
        // Direct new registrants straight to interest onboarding
        router.push("/onboarding");
      } else {
        await authClient.signIn(email, password);
        const profile = await authClient.getMe();
        setUserName(profile.name);

        if (profile.interests && profile.interests.length > 0) {
          setInterests(profile.interests.map((i) => i.name));
          router.push("/feed");
        } else {
          router.push("/onboarding");
        }
      }
    } catch (err: any) {
      setError(
        err?.message ||
          (mode === "register"
            ? "Registration failed. Please check your credentials."
            : "Invalid campus email or password.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFastTrack = async (
    demoName: string,
    demoEmail: string,
    roleInterests: string[]
  ) => {
    setIsLoading(true);
    setError(null);
    const demoPassword = "DemoPassword123!";

    try {
      try {
        await authClient.signIn(demoEmail, demoPassword);
      } catch {
        // Create demo account on the fly if not already registered in local DB
        await authClient.signUp(demoEmail, demoPassword, demoName);
      }

      const profile = await authClient.getMe();
      setUserName(profile.name || demoName);
      if (profile.interests && profile.interests.length > 0) {
        setInterests(profile.interests.map((i) => i.name));
      } else {
        setInterests(roleInterests);
      }
      router.push("/feed");
    } catch {
      setUserName(demoName);
      setInterests(roleInterests);
      router.push("/feed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground grid lg:grid-cols-12 overflow-x-hidden">
      
      {/* ===================================================================
          LEFT COLUMN: Dedicated Authentication Panel (45% - 50% width)
      =================================================================== */}
      <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-12 relative z-10 min-h-screen">
        
        {/* Top Header: Brand Anchor & Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-extrabold text-xs shadow-xs transition-transform group-hover:scale-105">
              C
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-foreground">
                Campusly
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-muted text-muted-foreground border border-border/60">
                LPU
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg"
              title="Return to homepage"
            >
              <ArrowLeft className="w-4 h-4 inline sm:hidden" />
              <span className="hidden sm:inline">Back to home</span>
            </Link>
          </div>
        </div>

        {/* Center: Auth Card Canvas */}
        <div className="max-w-md w-full mx-auto my-auto py-8">
          
          {/* Welcome Typography */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <span>{mode === "register" ? "Create account" : "Welcome back"}</span>
              <span className="inline-block animate-bounce duration-1000">
                {mode === "register" ? "🚀" : "👋"}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
              {mode === "register"
                ? "Join student builders, find hackathon teammates, and discover campus clubs."
                : "Continue your campus journey · Connect with student builders, hackathons, and clubs."}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            
            {/* Full Name Field (Register Mode Only) */}
            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full h-11 pl-10 pr-3 text-xs sm:text-sm bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground/60 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Campus Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full h-11 pl-10 pr-3 text-xs sm:text-sm bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground/60 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-foreground">
                  Password
                </label>
                {mode === "login" && (
                  <span className="text-[11px] text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                    Forgot?
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-11 pl-10 pr-10 text-xs sm:text-sm bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground/60 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-1"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl text-xs sm:text-sm font-bold gap-2 shadow-xs cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 mt-1 transition-all"
            >
              {isLoading ? (
                <span>
                  {mode === "register" ? "Creating account..." : "Logging in..."}
                </span>
              ) : (
                <>
                  <span>{mode === "register" ? "Create Account" : "Log in"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Clean Divider */}
          <div className="relative flex items-center justify-center my-5">
            <div className="border-t border-border/60 w-full" />
            <span className="bg-background px-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider shrink-0">
              or continue with
            </span>
          </div>

          {/* Continue with Google */}
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() => handleFastTrack("Utpal", "utpal.google@lpu.edu", ["AI", "Web Dev", "Hackathons"])}
            className="w-full h-11 rounded-xl text-xs sm:text-sm font-semibold gap-2.5 border-border/80 bg-card hover:bg-muted/50 text-foreground cursor-pointer shadow-2xs transition-all"
          >
            {/* Google Multi-Color SVG Icon */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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

          {/* Fast-Track 1-Click Demo Logins for Judges & Reviewers */}
          <div className="mt-5 p-3.5 rounded-2xl border border-border/70 bg-muted/25 dark:bg-muted/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-primary" />
                <span>1-Click Hackathon Demo Logins</span>
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Instant Access
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  handleFastTrack(
                    "Rahul Sharma",
                    "rahul.sharma@lpu.edu",
                    ["AI", "Web Dev", "Python"]
                  )
                }
                className="p-2.5 rounded-xl border border-border/70 bg-card hover:border-primary flex items-center gap-2 text-left transition-all cursor-pointer shadow-2xs group"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-border/70 shrink-0 bg-muted/20">
                  <img
                    src={getAnimeAvatar("rahul-sharma", "Rahul")}
                    alt="Rahul"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-foreground group-hover:text-primary truncate">
                    Rahul Sharma
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    CSE · AI Lead
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleFastTrack(
                    "Ananya Singh",
                    "ananya.singh@lpu.edu",
                    ["Design", "UI/UX", "Startups"]
                  )
                }
                className="p-2.5 rounded-xl border border-border/70 bg-card hover:border-primary flex items-center gap-2 text-left transition-all cursor-pointer shadow-2xs group"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-border/70 shrink-0 bg-muted/20">
                  <img
                    src={getAnimeAvatar("ananya-singh", "Ananya")}
                    alt="Ananya"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-foreground group-hover:text-primary truncate">
                    Ananya Singh
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    Design · UI/UX
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Footer Switcher */}
          <div className="mt-6 pt-5 border-t border-border/60 text-center text-xs text-muted-foreground">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setError(null);
                  }}
                  className="font-semibold text-primary hover:underline transition-colors ml-1 cursor-pointer"
                >
                  Create account →
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                  }}
                  className="font-semibold text-primary hover:underline transition-colors ml-1 cursor-pointer"
                >
                  Log in →
                </button>
              </>
            )}
          </div>

        </div>

        {/* Bottom Security Note */}
        <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] text-muted-foreground pt-4">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Restricted to verified Lovely Professional University students</span>
        </div>

      </div>

      {/* ===================================================================
          RIGHT COLUMN: Dynamic Campus Showcase Panel
      =================================================================== */}
      <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-between p-10 xl:p-14 bg-muted/20 dark:bg-muted/10 border-l border-border/60 relative overflow-hidden">
        
        {/* Subtle Background Radial Atmosphere */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Subtle Background Dot Grid Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#00000010_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-60" />

        {/* Top Campus Live Status Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>480+ Students Active Across Campus</span>
          </div>

          <span className="text-xs text-muted-foreground font-medium">
            Block 32 & 34 Hubs
          </span>
        </div>

        {/* Center: Live Product Match Card Showcase */}
        <div className="relative z-10 max-w-lg w-full mx-auto my-auto space-y-6">
          
          {/* Main Showcase Card */}
          <div className="rounded-3xl border border-border/80 bg-card/90 backdrop-blur-md p-6 sm:p-7 shadow-2xl shadow-black/10 dark:shadow-black/30 space-y-5 relative">
            
            {/* Top Tag Row */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                <Zap className="w-3.5 h-3.5" />
                <span>GenAI Hackathon 2026 Match</span>
              </span>
              <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                <span>Oct 18 · Block 32</span>
              </span>
            </div>

            {/* Peer Match Synergy Row */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border border-border/60">
              
              {/* Student 1 */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-border/80 shrink-0 bg-muted/20">
                  <img
                    src={getAnimeAvatar("rahul-sharma", "Rahul")}
                    alt="Rahul Sharma"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-foreground truncate">
                    Rahul Sharma
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    CSE · AI Agents
                  </div>
                </div>
              </div>

              {/* Match Indicator */}
              <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold shrink-0 mx-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>94% Match</span>
              </div>

              {/* Student 2 */}
              <div className="flex items-center gap-2.5 min-w-0 justify-end">
                <div className="text-right min-w-0">
                  <div className="text-xs font-bold text-foreground truncate">
                    Ananya Singh
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    Design · Frontend
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden border border-border/80 shrink-0 bg-muted/20">
                  <img
                    src={getAnimeAvatar("ananya-singh", "Ananya")}
                    alt="Ananya Singh"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

            </div>

            {/* Quote Snippet */}
            <p className="text-xs text-foreground/80 leading-relaxed italic">
              &ldquo;Found my hackathon co-founder within 15 minutes of signing in. No WhatsApp noise, just verified student builders ready to ship.&rdquo;
            </p>

            {/* Stack Tags */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-border/60">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mr-1">
                Tech Stack:
              </span>
              {["Autonomous Agents", "FastAPI", "Next.js", "Figma"].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-lg text-[10px] font-medium bg-muted text-muted-foreground border border-border/60"
                >
                  {tag}
                </span>
              ))}
            </div>

          </div>

          {/* Social Proof Avatars Cluster */}
          <div className="flex items-center justify-between p-4 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xs">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2 overflow-hidden">
                {["rahul-sharma", "ananya-singh", "dev-kapoor", "priya-verma"].map((slug) => (
                  <div
                    key={slug}
                    className="w-8 h-8 rounded-full border-2 border-card overflow-hidden bg-muted/20"
                  >
                    <img
                      src={getAnimeAvatar(slug)}
                      alt="Student"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-xs">
                <span className="font-bold text-foreground">1,200+ students</span>
                <span className="text-muted-foreground"> registered from LPU</span>
              </div>
            </div>

            <span className="text-[11px] font-semibold text-primary flex items-center gap-1">
              <span>Join Now</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>

        </div>

        {/* Bottom Showcase Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/50">
          <span>Campusly · Built for Student Builders</span>
          <span>School of CSE & Design</span>
        </div>

      </div>

    </div>
  );
}
