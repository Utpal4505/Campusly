"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCampusStore } from "@/lib/store";
import ThemeToggle from "@/components/ThemeToggle";
import { authClient, UserProfile } from "@/lib/auth";
import { getInterestEmoji } from "@/lib/interests";
import { getAnimeAvatar } from "@/lib/avatars";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  Zap,
  Hammer,
  Users,
  CalendarDays,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const GOAL_OPTIONS = [
  {
    id: "Hackathons",
    title: "Hackathons",
    description: "Find competitions and build projects with teams",
    icon: Zap,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60",
  },
  {
    id: "Projects",
    title: "Projects",
    description: "Find projects and people to build side-hustles & tools",
    icon: Hammer,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60",
  },
  {
    id: "People & Teammates",
    title: "People & Teammates",
    description: "Connect with students who match your skills and year",
    icon: Users,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/60",
  },
  {
    id: "Events & Clubs",
    title: "Events & Clubs",
    description: "Discover workshops, meetups, and campus club recruitments",
    icon: CalendarDays,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60",
  },
];

type OnboardingStep = "handle" | "interests" | "goals" | "finishing";

export default function OnboardingPage() {
  const router = useRouter();
  const {
    interests,
    interestIds,
    toggleInterestItem,
    setSelectedInterests,
    goals,
    toggleGoal,
  } = useCampusStore();

  const [availableInterests, setAvailableInterests] = useState<
    Array<{ id: string; name: string; emoji: string }>
  >([]);
  const [isLoadingInterests, setIsLoadingInterests] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [needsHandle, setNeedsHandle] = useState(false);
  const [step, setStep] = useState<OnboardingStep>("interests");
  const [loadingStage, setLoadingStage] = useState(0);

  // Handle claim state
  const [handle, setHandle] = useState("");
  const [handleStatus, setHandleStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid"
  >("idle");
  const [handleMessage, setHandleMessage] = useState("");
  const [handleSuggestions, setHandleSuggestions] = useState<string[]>([]);
  const [isClaimingHandle, setIsClaimingHandle] = useState(false);

  // Load real interests from backend and check user profile/username
  useEffect(() => {
    let isMounted = true;
    Promise.all([
      authClient.getInterests().catch(() => []),
      authClient.getMe().catch(() => null),
    ]).then(([interestsList, userProfile]) => {
      if (!isMounted) return;

      if (interestsList && interestsList.length > 0) {
        setAvailableInterests(
          interestsList.map((item) => ({
            id: item.id,
            name: item.name,
            emoji: getInterestEmoji(item.name),
          }))
        );
      }

      if (userProfile) {
        setProfile(userProfile);
        if (userProfile.interests && userProfile.interests.length > 0) {
          setSelectedInterests(userProfile.interests);
        }

        // If user has no username (e.g. from Google OAuth), prompt Step 1: Claim Handle!
        if (!userProfile.username) {
          setNeedsHandle(true);
          setStep("handle");
          const base = (
            userProfile.name ||
            userProfile.email.split("@")[0] ||
            "student"
          )
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/(^_|_$)+/g, "")
            .slice(0, 18);
          if (base.length >= 3) {
            setHandle(base);
          }
        } else {
          setNeedsHandle(false);
          setHandle(userProfile.username);
        }
      }

      setIsLoadingInterests(false);
    });

    return () => {
      isMounted = false;
    };
  }, [setSelectedInterests]);

  // Live debounced check for handle claiming
  useEffect(() => {
    if (step !== "handle" || !handle.trim()) {
      setHandleStatus("idle");
      setHandleMessage("");
      setHandleSuggestions([]);
      return;
    }

    const clean = handle.replace(/^@/, "").toLowerCase().trim();
    if (clean.length < 3) {
      setHandleStatus("invalid");
      setHandleMessage("Must be at least 3 characters");
      setHandleSuggestions([]);
      return;
    }
    if (clean.length > 20) {
      setHandleStatus("invalid");
      setHandleMessage("Cannot exceed 20 characters");
      setHandleSuggestions([]);
      return;
    }
    if (!/^[a-z0-9_]+$/.test(clean)) {
      setHandleStatus("invalid");
      setHandleMessage("Only letters, numbers & _ allowed");
      setHandleSuggestions([]);
      return;
    }

    setHandleStatus("checking");
    const timer = setTimeout(async () => {
      try {
        const res = await authClient.checkUsername(clean);
        if (res.available) {
          setHandleStatus("available");
          setHandleMessage("Available");
          setHandleSuggestions([]);
        } else {
          setHandleStatus("taken");
          setHandleMessage(res.error || "Already taken");
          setHandleSuggestions(res.suggestions || []);
        }
      } catch {
        setHandleStatus("idle");
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [handle, step]);

  const handleClaimHandle = async () => {
    if (!handle.trim() || handleStatus !== "available") return;
    setIsClaimingHandle(true);
    setSaveError(null);
    try {
      const updated = await authClient.updateUsername(handle.trim());
      setProfile(updated);
      setStep("interests");
    } catch (err: any) {
      setSaveError(err?.message || "Could not claim handle. Please try again.");
    } finally {
      setIsClaimingHandle(false);
    }
  };

  // Handle finishing stage: save preferences to backend and progress stages
  useEffect(() => {
    if (step === "finishing") {
      let isMounted = true;

      const savePreferencesAndTransition = async () => {
        try {
          if (interestIds.length === 0) {
            throw new Error("Please select at least 1 interest to continue.");
          }

          // Call PATCH /users/me/preferences with selected interest IDs if authenticated
          try {
            await authClient.updatePreferences(interestIds);
          } catch (err: any) {
            if (
              err?.status === 401 ||
              err?.message?.toLowerCase().includes("authenticated")
            ) {
              // Guest session: selections are already safely stored in useCampusStore!
            } else {
              throw err;
            }
          }

          if (!isMounted) return;
          setLoadingStage(1);
          await new Promise((resolve) => setTimeout(resolve, 450));

          if (!isMounted) return;
          setLoadingStage(2);
          await new Promise((resolve) => setTimeout(resolve, 500));

          if (!isMounted) return;
          setLoadingStage(3);
          await new Promise((resolve) => setTimeout(resolve, 500));

          if (!isMounted) return;
          router.push("/feed");
        } catch (err: any) {
          if (!isMounted) return;
          setSaveError(
            err?.message || "Failed to save preferences. Please check your connection."
          );
          setStep("interests");
        }
      };

      savePreferencesAndTransition();

      return () => {
        isMounted = false;
      };
    }
  }, [step, interestIds, router]);

  const stepNumber =
    step === "handle"
      ? 1
      : step === "interests"
      ? needsHandle
        ? 2
        : 1
      : needsHandle
      ? 3
      : 2;

  const totalSteps = needsHandle ? 3 : 2;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Top Bar */}
      <header className="w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-xs">
              C
            </div>
            <span className="text-base font-bold tracking-tight text-foreground">
              Campusly
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {step !== "finishing" && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  {needsHandle && (
                    <span
                      className={`w-5 h-1.5 rounded-full transition-all ${
                        step === "handle" || step === "interests" || step === "goals"
                          ? "bg-primary"
                          : "bg-muted"
                      }`}
                    />
                  )}
                  <span
                    className={`w-5 h-1.5 rounded-full transition-all ${
                      step === "interests" || step === "goals"
                        ? "bg-primary"
                        : "bg-muted"
                    }`}
                  />
                  <span
                    className={`w-5 h-1.5 rounded-full transition-all ${
                      step === "goals" ? "bg-primary" : "bg-muted"
                    }`}
                  />
                </div>
                <span className="text-xs font-semibold text-muted-foreground">
                  Step {stepNumber} of {totalSteps}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
        <div className="w-full max-w-2xl mx-auto">
          
          {/* STEP: Claim your Campus Handle (OAuth / Google sign-ins) */}
          {step === "handle" && (
            <div className="flex flex-col items-center text-center animate-in fade-in duration-300">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
                Claim your campus identity
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
                Welcome{profile?.name ? `, ${profile.name}` : ""}! Choose your unique campus @handle so peers can find you, invite you to hackathons, and chat in real-time.
              </p>

              {/* Live Profile Preview Card */}
              <div className="w-full max-w-md p-4 rounded-2xl bg-card border border-border/80 shadow-xs mb-6 text-left flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-border/70 flex items-center justify-center bg-muted/20 shrink-0">
                  <img
                    src={getAnimeAvatar(profile?.name || handle || "Student", "Utpal")}
                    alt={profile?.name || "Student"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-foreground truncate">
                      {profile?.name || "Campus Student"}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                      Verified
                    </span>
                  </div>
                  <p className="font-mono text-xs font-semibold text-primary mt-0.5">
                    @{handle || "your_handle"}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                    {profile?.email || "Campus Student"}
                  </p>
                </div>
              </div>

              {/* Handle Input Field */}
              <div className="w-full max-w-md space-y-3 mb-6 text-left">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Campus Handle <span className="text-primary">*</span>
                  </label>
                  {handleStatus === "checking" && (
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin text-primary" />
                      <span>Checking...</span>
                    </span>
                  )}
                  {handleStatus === "available" && (
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>Available</span>
                    </span>
                  )}
                  {handleStatus === "taken" && (
                    <span className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 animate-in fade-in">
                      <AlertCircle className="w-3 h-3 text-rose-500" />
                      <span>Already taken</span>
                    </span>
                  )}
                  {handleStatus === "invalid" && handleMessage && (
                    <span className="text-[11px] text-amber-500 font-medium animate-in fade-in">
                      {handleMessage}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-muted-foreground select-none">
                    @
                  </span>
                  <input
                    type="text"
                    required
                    value={handle}
                    onChange={(e) => {
                      const val = e.target.value
                        .replace(/^@/, "")
                        .toLowerCase()
                        .replace(/[^a-z0-9_]/g, "");
                      setHandle(val);
                    }}
                    placeholder="your_handle"
                    className={`w-full h-11 pl-8 pr-9 text-xs sm:text-sm font-mono bg-muted/40 rounded-xl border transition-all text-foreground placeholder:text-muted-foreground/60 ${
                      handleStatus === "available"
                        ? "border-emerald-500/60 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                        : handleStatus === "taken"
                        ? "border-rose-500/60 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20"
                        : "border-border/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                    }`}
                  />
                  {handleStatus === "available" && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  )}
                  {handleStatus === "taken" && (
                    <AlertCircle className="w-4 h-4 text-rose-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  )}
                </div>

                {handleSuggestions.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-muted-foreground animate-in fade-in">
                    <span>Try:</span>
                    {handleSuggestions.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => setHandle(sug)}
                        className="px-1.5 py-0.5 rounded-md bg-muted hover:bg-card border border-border text-foreground font-mono transition-colors cursor-pointer"
                      >
                        @{sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {saveError && (
                <div className="mb-4 w-full max-w-md p-3 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive text-xs font-medium flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="w-full max-w-md">
                <Button
                  size="lg"
                  disabled={handleStatus !== "available" || isClaimingHandle}
                  onClick={handleClaimHandle}
                  className="w-full rounded-xl gap-2 shadow-xs font-semibold cursor-pointer"
                >
                  {isClaimingHandle ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Claiming handle...</span>
                    </>
                  ) : (
                    <>
                      <span>Claim Handle & Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* STEP: Tell us what you're into */}
          {step === "interests" && (
            <div className="flex flex-col items-center text-center animate-in fade-in duration-300">
              {needsHandle && (
                <div className="w-full flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={() => setStep("handle")}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to handle
                  </button>
                </div>
              )}

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2.5">
                Tell us what you&apos;re into
              </h1>
              <p className="text-sm text-muted-foreground max-w-md mb-8 leading-relaxed">
                Pick the things you actually care about. We&apos;ll use this to personalize your campus feed.
              </p>

              {/* Error Banner */}
              {saveError && (
                <div className="mb-6 w-full p-3.5 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive text-xs font-medium flex items-center justify-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}

              {/* Grid of Interests */}
              {isLoadingInterests ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="text-xs">Loading campus interest tags...</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full mb-8 max-h-[460px] overflow-y-auto pr-1">
                  {availableInterests.map((item) => {
                    const isSelected = interestIds.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          toggleInterestItem({ id: item.id, name: item.name })
                        }
                        className={`group relative p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-150 flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/[0.04] shadow-xs ring-1 ring-primary/20"
                            : "border-border/70 bg-card hover:border-primary/40 hover:bg-muted/30"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <span className="text-xl sm:text-2xl shrink-0">
                            {item.emoji}
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-foreground truncate">
                            {item.name}
                          </span>
                        </div>

                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 transition-all ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "border border-border/70 opacity-0 group-hover:opacity-60"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Step Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full pt-4 border-t border-border/50">
                <span className="text-xs font-medium text-muted-foreground">
                  {interestIds.length === 0
                    ? "Pick at least 1 interest to continue"
                    : `${interestIds.length} interest${
                        interestIds.length > 1 ? "s" : ""
                      } selected`}
                </span>

                <Button
                  size="lg"
                  disabled={interestIds.length === 0 || isLoadingInterests}
                  onClick={() => {
                    setSaveError(null);
                    setStep("goals");
                  }}
                  className="rounded-xl px-7 gap-2 shadow-xs font-semibold w-full sm:w-auto cursor-pointer"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP: What are you looking for? */}
          {step === "goals" && (
            <div className="flex flex-col items-center text-center animate-in fade-in duration-300">
              <div className="w-full flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setStep("interests")}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to interests
                </button>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2.5">
                What are you looking for?
              </h1>
              <p className="text-sm text-muted-foreground max-w-md mb-8 leading-relaxed">
                Tell us what you want to discover first. You can select multiple.
              </p>

              {/* 4 Goal Cards */}
              <div className="grid sm:grid-cols-2 gap-3.5 w-full mb-8">
                {GOAL_OPTIONS.map((item) => {
                  const isSelected = goals.includes(item.id);
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleGoal(item.id)}
                      className={`group p-4 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/[0.04] shadow-xs ring-1 ring-primary/20"
                          : "border-border/70 bg-card hover:border-primary/40 hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center border ${item.bg}`}
                        >
                          <Icon className={`w-4 h-4 ${item.color}`} />
                        </div>
                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "border border-border/70 opacity-40 group-hover:opacity-80"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-foreground mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Step Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full pt-4 border-t border-border/50">
                <span className="text-xs font-medium text-muted-foreground">
                  {goals.length === 0
                    ? "Select at least 1 category"
                    : `${goals.length} goal${goals.length > 1 ? "s" : ""} selected`}
                </span>

                <Button
                  size="lg"
                  disabled={goals.length === 0}
                  onClick={() => setStep("finishing")}
                  className="rounded-xl px-7 gap-2 shadow-xs font-semibold w-full sm:w-auto cursor-pointer"
                >
                  Build My Campusly
                  <Sparkles className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP: Cinematic Loading / Transition State */}
          {step === "finishing" && (
            <div className="flex flex-col items-center text-center py-10 animate-in zoom-in-95 duration-400">
              {/* Glowing Ambient Orb */}
              <div className="relative mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 animate-bounce">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="absolute -inset-4 rounded-full bg-primary/10 blur-xl -z-10 animate-pulse" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
                Personalizing your campus
              </h2>
              <p className="text-sm text-muted-foreground mb-8">
                Analyzing your interests and curating opportunities...
              </p>

              {/* Dynamic Step-by-step checklist */}
              <div className="w-full max-w-sm rounded-2xl border border-border/70 bg-card p-5 shadow-xs space-y-3.5 text-left mb-8">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-foreground flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    Saving interests ({interests.slice(0, 2).join(", ")}...)
                  </span>
                  <span className="text-emerald-600 font-semibold text-[11px]">
                    Saved
                  </span>
                </div>

                <div
                  className={`flex items-center justify-between text-xs font-medium transition-all duration-300 ${
                    loadingStage >= 1 ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <span className="text-foreground flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-[10px] font-bold">
                      {loadingStage >= 1 ? "✓" : "○"}
                    </span>
                    Finding relevant hackathons & clubs
                  </span>
                  <span className="text-emerald-600 font-semibold text-[11px]">
                    {loadingStage >= 1 ? "Done" : "Matching..."}
                  </span>
                </div>

                <div
                  className={`flex items-center justify-between text-xs font-medium transition-all duration-300 ${
                    loadingStage >= 2 ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <span className="text-foreground flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-[10px] font-bold">
                      {loadingStage >= 2 ? "✓" : "○"}
                    </span>
                    Matching active campus teammates
                  </span>
                  <span className="text-emerald-600 font-semibold text-[11px]">
                    {loadingStage >= 2 ? "Done" : "Searching..."}
                  </span>
                </div>

                <div
                  className={`flex items-center justify-between text-xs font-medium transition-all duration-300 ${
                    loadingStage >= 3 ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <span className="text-foreground flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-[10px] font-bold">
                      {loadingStage >= 3 ? "✓" : "○"}
                    </span>
                    Generating your For You feed
                  </span>
                  <span className="text-emerald-600 font-semibold text-[11px]">
                    {loadingStage >= 3 ? "Ready!" : "Curating..."}
                  </span>
                </div>
              </div>

              {/* Pulsing Loading Dots */}
              <div className="flex items-center gap-1.5 text-muted-foreground/60">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="w-2 h-2 rounded-full bg-primary" />
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-muted-foreground border-t border-border/40">
        Campusly • Personalizing student discovery
      </footer>

    </div>
  );
}
