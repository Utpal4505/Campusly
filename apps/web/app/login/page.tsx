"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  KeyRound,
  RotateCcw,
  CheckCircle2,
  Loader2,
} from "lucide-react";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/feed";
  const { setUserName, setInterests } = useCampusStore();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSuccessMessage, setOtpSuccessMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Check URL query parameters for ?mode=register
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("mode") === "register") {
        setMode("register");
      }
    }
  }, []);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === "register") {
        const studentName = name.trim() || email.split("@")[0] || "Student";
        await authClient.signUp(email, password, studentName);
        try {
          await authClient.sendVerificationOTP(email);
        } catch (otpErr) {
          console.warn("OTP dispatch warning:", otpErr);
        }
        setStep("otp");
        setOtpSuccessMessage(`Verification code sent to ${email}`);
        setResendCooldown(60);
      } else {
        await authClient.signIn(email, password);
        try {
          const profile = await authClient.getMe();
          if (profile?.name) setUserName(profile.name);
          if (profile?.interests && profile.interests.length > 0) {
            setInterests(profile.interests.map((i) => i.name));
          }
        } catch {
          setUserName(email.split("@")[0] || "Student");
        }
        if (typeof window !== "undefined") {
          window.location.href = redirectUrl;
        } else {
          router.push(redirectUrl);
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

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await authClient.verifyEmailOTP(email, otp.trim());
      const studentName = name.trim() || email.split("@")[0] || "Student";
      setUserName(studentName);
      const target = redirectUrl && redirectUrl !== "/feed" ? redirectUrl : "/onboarding";
      if (typeof window !== "undefined") {
        window.location.href = target;
      } else {
        router.push(target);
      }
    } catch (err: any) {
      setError(
        err?.message ||
          "Invalid or expired verification code. Please check and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    setError(null);
    try {
      await authClient.sendVerificationOTP(email);
      setOtpSuccessMessage(`New verification code sent to ${email}`);
      setResendCooldown(60);
    } catch (err: any) {
      setError(err?.message || "Failed to resend code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authClient.signInSocial("google", redirectUrl);
    } catch (err: any) {
      setError(
        err?.message || "Failed to initiate Google sign-in. Please try again."
      );
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

      const profile = await authClient.getMe().catch(() => null);
      if (profile?.name) {
        setUserName(profile.name);
      } else {
        setUserName(demoName);
      }
      if (profile?.interests && profile.interests.length > 0) {
        setInterests(profile.interests.map((i) => i.name));
      } else {
        setInterests(roleInterests);
      }
      if (typeof window !== "undefined") {
        window.location.href = redirectUrl;
      } else {
        router.push(redirectUrl);
      }
    } catch {
      setUserName(demoName);
      setInterests(roleInterests);
      if (typeof window !== "undefined") {
        window.location.href = redirectUrl;
      } else {
        router.push(redirectUrl);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground grid lg:grid-cols-12 overflow-x-hidden">
      
      {/* ===================================================================
          LEFT COLUMN: Dedicated High-Affordance Authentication Panel
      =================================================================== */}
      <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-between p-6 sm:p-10 lg:p-12 relative z-10 min-h-screen border-b lg:border-b-0 lg:border-r border-border/70 bg-card/50 backdrop-blur-xs">
        
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
        <div className="max-w-md w-full mx-auto my-auto py-6">
          
          {/* Segmented Mode Switcher (Tabbed Login / Register) */}
          <div className="flex p-1 bg-muted/60 dark:bg-muted/40 border border-border/70 rounded-2xl mb-6 shadow-2xs">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${
                mode === "login"
                  ? "bg-card text-foreground shadow-xs border border-border/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${
                mode === "register"
                  ? "bg-card text-foreground shadow-xs border border-border/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Welcome Typography */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <span>{mode === "register" ? "Create your account" : "Welcome back"}</span>
              <span className="inline-block animate-bounce duration-1000">
                {mode === "register" ? "🚀" : "👋"}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
              {mode === "register"
                ? "Join verified student builders, find hackathon teammates, and discover campus clubs."
                : "Enter your campus credentials to access your personalized feed, tickets, and peers."}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === "otp" ? (
            <div className="p-6 rounded-2xl border border-border/80 bg-card shadow-lg animate-in fade-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => {
                  setStep("credentials");
                  setError(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-4 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Email / Back</span>
              </button>

              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <KeyRound className="w-6 h-6" />
              </div>

              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Verify your campus email
              </h2>
              <p className="text-xs text-muted-foreground mt-1 mb-5">
                We sent a 6-digit verification code to <span className="font-semibold text-foreground">{email}</span>
              </p>

              {otpSuccessMessage && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{otpSuccessMessage}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="123456"
                    className="w-full h-12 text-center text-xl tracking-[0.5em] font-mono bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-foreground transition-all"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || otp.length < 6}
                  className="w-full h-11 rounded-xl text-xs sm:text-sm font-bold gap-2 shadow-xs cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying code...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify & Complete Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Didn&apos;t get the code?</span>
                <button
                  type="button"
                  disabled={resendCooldown > 0 || isLoading}
                  onClick={handleResendOtp}
                  className={`font-semibold cursor-pointer transition-colors ${
                    resendCooldown > 0
                      ? "text-muted-foreground cursor-not-allowed"
                      : "text-primary hover:underline"
                  }`}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                </button>
              </div>

              <p className="text-[11px] text-muted-foreground/70 text-center mt-4">
                ⏱️ Codes expire in 10 minutes. For local development, check your terminal/API console.
              </p>
            </div>
          ) : (
            <>
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
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>
                        {mode === "register" ? "Creating account..." : "Signing in..."}
                      </span>
                    </div>
                  ) : (
                    <>
                      <span>{mode === "register" ? "Create Student Account" : "Sign In to Campusly"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Clean Divider */}
              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-border/60 w-full" />
                <span className="bg-background px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider shrink-0">
                  or continue with
                </span>
              </div>

              {/* Continue with Google */}
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={handleGoogleSignIn}
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
            </>
          )}

          {/* Streamlined Demo Fast-Track Presets (Designed as Subtle Chips) */}
          <div className="mt-5 p-3.5 rounded-2xl border border-border/70 bg-muted/20 dark:bg-muted/10">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-primary" />
                <span>Judge &amp; Demo Presets</span>
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                1-Click Test Access
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
                className="p-2 rounded-xl border border-border/70 bg-card hover:border-primary/50 hover:bg-muted/40 flex items-center gap-2.5 text-left transition-all cursor-pointer shadow-2xs group"
              >
                <div className="w-7 h-7 rounded-full overflow-hidden border border-border/70 shrink-0 bg-muted/20">
                  <img
                    src={getAnimeAvatar("rahul-sharma", "Rahul")}
                    alt="Rahul"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-foreground group-hover:text-primary truncate">
                    Rahul Sharma
                  </div>
                  <div className="text-[9px] text-muted-foreground truncate">
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
                className="p-2 rounded-xl border border-border/70 bg-card hover:border-primary/50 hover:bg-muted/40 flex items-center gap-2.5 text-left transition-all cursor-pointer shadow-2xs group"
              >
                <div className="w-7 h-7 rounded-full overflow-hidden border border-border/70 shrink-0 bg-muted/20">
                  <img
                    src={getAnimeAvatar("ananya-singh", "Ananya")}
                    alt="Ananya"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-foreground group-hover:text-primary truncate">
                    Ananya Singh
                  </div>
                  <div className="text-[9px] text-muted-foreground truncate">
                    Design · UI/UX
                  </div>
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Security Note */}
        <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] text-muted-foreground pt-3 border-t border-border/40">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Restricted to verified Lovely Professional University students</span>
        </div>

      </div>

      {/* ===================================================================
          RIGHT COLUMN: Modern Layered Campus Bento Showcase Panel
      =================================================================== */}
      <div className="hidden lg:flex lg:col-span-7 xl:col-span-7 flex-col justify-between p-8 xl:p-12 bg-gradient-to-br from-card/30 via-muted/20 to-card/60 dark:from-[#0d101b] dark:via-[#090b12] dark:to-[#131726] relative overflow-hidden">
        
        {/* Ambient Glow Elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Subtle Background Dot Grid Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#00000010_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-50" />

        {/* Top Live Campus Pulse Bar */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>480+ Students Live in Block 32 &amp; 34 Hubs</span>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>14 Active Hackathons &amp; Clubs</span>
          </div>
        </div>

        {/* Center: Layered Bento Grid Platform Showcase */}
        <div className="relative z-10 max-w-xl w-full mx-auto my-auto space-y-4 py-4">
          
          {/* Bento Item 1: Teammate Match Synergy Card */}
          <div className="rounded-3xl border border-border/80 bg-card/90 backdrop-blur-md p-5 sm:p-6 shadow-xl shadow-black/5 dark:shadow-black/20 space-y-4">
            
            {/* Top Tag Row */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                <Zap className="w-3.5 h-3.5" />
                <span>GenAI Hackathon 2026 Match</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Sparkles className="w-3 h-3" />
                <span>94% Skill Synergy</span>
              </span>
            </div>

            {/* Peer Match Synergy Row */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/40 border border-border/60">
              
              {/* Student 1 */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-border/80 shrink-0 bg-muted/20">
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

              {/* Match Connection Badge */}
              <div className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-[10px] font-extrabold shrink-0 mx-2 flex items-center gap-1">
                <span>⚡ Paired</span>
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
                <div className="w-9 h-9 rounded-full overflow-hidden border border-border/80 shrink-0 bg-muted/20">
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

          {/* Bento Row 2: Digital Entrance Pass & Live Chat Snippets (Side-by-Side) */}
          <div className="grid sm:grid-cols-2 gap-4">
            
            {/* Bento Item 2A: Digital Ticket QR Pass */}
            <div className="p-4 rounded-2xl border border-border/80 bg-card/85 backdrop-blur-md shadow-md space-y-2.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground mb-1">
                  <span className="tracking-wider">DIGITAL PASS</span>
                  <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    CONFIRMED ✓
                  </span>
                </div>
                <div className="text-xs font-bold text-foreground">
                  RoboQuest Challenge 2026
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <span>Oct 24 · Block 34 Arena</span>
                </div>
              </div>

              <div className="pt-2 border-t border-dashed border-border/70 flex items-center justify-between text-[10px]">
                <span className="font-mono font-bold text-primary">#CPLY-8F92K</span>
                <span className="font-medium text-foreground/80 flex items-center gap-1">
                  <span>🎟️ Verified QR Pass</span>
                </span>
              </div>
            </div>

            {/* Bento Item 2B: Real-Time Peer Collaboration */}
            <div className="p-4 rounded-2xl border border-border/80 bg-card/85 backdrop-blur-md shadow-md space-y-2.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground mb-1">
                  <span className="tracking-wider">REAL-TIME CAMPUS CHAT</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <div className="p-2 rounded-xl bg-muted/40 border border-border/50 text-[11px] text-foreground/90 leading-snug">
                  &ldquo;Formed our 3-person team for Code Clash in 10 mins! Ready to pitch tonight.&rdquo;
                </div>
              </div>

              <div className="flex items-center justify-between text-[9px] text-muted-foreground pt-1">
                <span>Verified LPU Student</span>
                <span>Active 12m ago</span>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Social Proof Bar */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-border/60 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2 overflow-hidden">
              {["rahul-sharma", "ananya-singh", "dev-kapoor", "priya-verma"].map((slug) => (
                <div
                  key={slug}
                  className="w-7 h-7 rounded-full border-2 border-card overflow-hidden bg-muted/20"
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
              <span className="text-muted-foreground"> registered across CSE, Design, &amp; Robotics</span>
            </div>
          </div>

          <span className="text-[11px] font-semibold text-primary flex items-center gap-1 self-start sm:self-auto">
            <span>Campusly Network</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}

