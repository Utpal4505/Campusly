"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCampusStore } from "@/lib/store";
import ThemeToggle from "@/components/ThemeToggle";
import { authClient } from "@/lib/auth";
import { getInterestEmoji } from "@/lib/interests";
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

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loadingStage, setLoadingStage] = useState(0);

  // Load real interests from backend and sync already saved user preferences
  useEffect(() => {
    let isMounted = true;
    Promise.all([
      authClient.getInterests().catch(() => []),
      authClient.getMe().catch(() => null),
    ]).then(([interestsList, profile]) => {
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

      if (profile?.interests && profile.interests.length > 0) {
        setSelectedInterests(profile.interests);
      }

      setIsLoadingInterests(false);
    });

    return () => {
      isMounted = false;
    };
  }, [setSelectedInterests]);

  // Handle Step 3: save preferences to backend and progress stages
  useEffect(() => {
    if (step === 3) {
      let isMounted = true;

      const savePreferencesAndTransition = async () => {
        try {
          if (interestIds.length === 0) {
            throw new Error("Please select at least 1 interest to continue.");
          }

          // Call PATCH /users/me/preferences with selected interest IDs
          await authClient.updatePreferences(interestIds);

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
          setStep(1); // Return to step 1 so user can retry
        }
      };

      savePreferencesAndTransition();

      return () => {
        isMounted = false;
      };
    }
  }, [step, interestIds, router]);

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
            {step !== 3 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-6 h-1.5 rounded-full transition-all ${
                      step >= 1 ? "bg-primary" : "bg-muted"
                    }`}
                  />
                  <span
                    className={`w-6 h-1.5 rounded-full transition-all ${
                      step >= 2 ? "bg-primary" : "bg-muted"
                    }`}
                  />
                </div>
                <span className="text-xs font-semibold text-muted-foreground">
                  Step {step} of 2
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
        <div className="w-full max-w-2xl mx-auto">
          
          {/* STEP 1: Tell us what you're into */}
          {step === 1 && (
            <div className="flex flex-col items-center text-center animate-in fade-in duration-300">
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

              {/* Step 1 Footer */}
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
                    setStep(2);
                  }}
                  className="rounded-xl px-7 gap-2 shadow-xs font-semibold w-full sm:w-auto cursor-pointer"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: What are you looking for? */}
          {step === 2 && (
            <div className="flex flex-col items-center text-center animate-in fade-in duration-300">
              <div className="w-full flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
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

              {/* 4 Cards */}
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

              {/* Step 2 Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full pt-4 border-t border-border/50">
                <span className="text-xs font-medium text-muted-foreground">
                  {goals.length === 0
                    ? "Select at least 1 category"
                    : `${goals.length} goal${goals.length > 1 ? "s" : ""} selected`}
                </span>

                <Button
                  size="lg"
                  disabled={goals.length === 0}
                  onClick={() => setStep(3)}
                  className="rounded-xl px-7 gap-2 shadow-xs font-semibold w-full sm:w-auto cursor-pointer"
                >
                  Build My Campusly
                  <Sparkles className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Cinematic Loading / Transition State */}
          {step === 3 && (
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
