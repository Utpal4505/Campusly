"use client";

import { useAuth } from "@/lib/auth-context";
import { RoleProfile, UserRole } from "@/lib/rbac";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  ArrowLeft,
  Sparkles,
  Users,
  Building2,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

interface RoleGuardProps {
  children: React.ReactNode;
  isAuthorized: boolean;
  requiredRoleName: string;
  backHref: string;
  backLabel?: string;
  resourceTitle?: string;
}

export default function RoleGuard({
  children,
  isAuthorized,
  requiredRoleName,
  backHref,
  backLabel = "Back to Public Page",
  resourceTitle,
}: RoleGuardProps) {
  const { currentRole, roleProfile, switchRole, user } = useAuth();

  if (isAuthorized) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-3xl border border-destructive/30 bg-card p-6 sm:p-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95">
        
        {/* Shield Icon */}
        <div className="w-16 h-16 rounded-3xl bg-destructive/10 border border-destructive/30 text-destructive flex items-center justify-center mx-auto shadow-lg shadow-destructive/10">
          <ShieldAlert className="w-8 h-8 stroke-[2.2]" />
        </div>

        {/* Heading */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20 mb-2 inline-block">
            403 • ACCESS RESTRICTED
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
            Restricted University Console
          </h2>
          {resourceTitle && (
            <p className="text-xs font-semibold text-primary mt-0.5">
              {resourceTitle}
            </p>
          )}
        </div>

        {/* Explanation */}
        <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 text-left space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-semibold">Your Active Role:</span>
            <span className="font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[11px]">
              {roleProfile.displayName}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-semibold">Required Access:</span>
            <span className="font-bold text-foreground text-[11px]">
              {requiredRoleName}
            </span>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed pt-2 border-t border-border/40">
            As a student attendee, you do not have permission to review audition candidates, edit organization settings, or approve university Duty Leave (DL) for this entity.
          </p>
        </div>

        {/* Demo Switcher for Evaluation */}
        <div className="p-4 rounded-2xl bg-primary/[0.04] border border-primary/20 text-left space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Evaluating as Reviewer / Evaluator?</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Switch your active demo persona to preview this console:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => switchRole("CLUB_LEAD")}
              className="rounded-xl text-xs font-semibold h-8 gap-1.5 border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Switch to Club Lead</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => switchRole("DSW_ADMIN")}
              className="rounded-xl text-xs font-semibold h-8 gap-1.5 border-purple-500/30 hover:bg-purple-500/10 text-purple-700 dark:text-purple-300 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Switch to DSW Admin</span>
            </Button>
          </div>
        </div>

        {/* Navigation Action */}
        <div className="pt-2 border-t border-border/60">
          <Link href={backHref}>
            <Button variant="outline" className="w-full rounded-xl text-xs gap-1.5 cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{backLabel}</span>
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
