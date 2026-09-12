"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { authClient } from "@/lib/auth";
import { getAnimeAvatar } from "@/lib/avatars";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";

export default function ClaimHandleModal() {
  const { user, isAuthenticated, isLoading, refresh } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [handle, setHandle] = useState("");
  const [handleStatus, setHandleStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid"
  >("idle");
  const [handleMessage, setHandleMessage] = useState("");
  const [handleSuggestions, setHandleSuggestions] = useState<string[]>([]);
  const [isClaiming, setIsClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine if modal should open
  useEffect(() => {
    if (!isLoading && isAuthenticated && user && !user.username) {
      setIsOpen(true);
      const base = (user.name || user.email.split("@")[0] || "student")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/(^_|_$)+/g, "")
        .slice(0, 18);
      if (base.length >= 3) {
        setHandle(base);
      }
    } else {
      setIsOpen(false);
    }
  }, [isLoading, isAuthenticated, user]);

  // Debounced live availability check
  useEffect(() => {
    if (!isOpen || !handle.trim()) {
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
  }, [handle, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim() || handleStatus !== "available") return;

    setIsClaiming(true);
    setError(null);
    try {
      await authClient.updateUsername(handle.trim());
      await refresh();
      setIsOpen(false);
    } catch (err: any) {
      setError(err?.message || "Could not claim handle. Please try again.");
    } finally {
      setIsClaiming(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 sm:p-7 rounded-2xl bg-card border border-border shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug">
              Claim your campus @handle
            </h3>
            <p className="text-xs text-muted-foreground">
              Welcome, {user?.name || "Student"}! Set your unique campus handle.
            </p>
          </div>
        </div>

        {/* Live Identity Badge Preview */}
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/70 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-border/70 flex items-center justify-center bg-muted/20 shrink-0">
            <img
              src={getAnimeAvatar(user?.name || handle || "Student", "Utpal")}
              alt={user?.name || "Student"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-foreground truncate">
              {user?.name || "Student"}
            </p>
            <p className="font-mono text-xs font-semibold text-primary">
              @{handle || "your_handle"}
            </p>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20 shrink-0">
            Verified
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-foreground">
                Choose Handle <span className="text-primary">*</span>
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
              <div className="mt-2 flex items-center gap-1.5 flex-wrap text-[11px] text-muted-foreground animate-in fade-in">
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

          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={handleStatus !== "available" || isClaiming}
            className="w-full h-11 rounded-xl text-xs sm:text-sm font-bold gap-2 shadow-xs cursor-pointer"
          >
            {isClaiming ? (
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
        </form>
      </div>
    </div>
  );
}
