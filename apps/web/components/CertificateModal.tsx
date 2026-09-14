"use client";

import { useState } from "react";
import {
  X,
  Printer,
  Copy,
  Check,
  Award,
  ShieldCheck,
  Download,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import QRCodeDisplay from "./QRCodeDisplay";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: {
    ticketNumber: string;
    status: string;
    createdAt: string;
    user?: {
      name?: string | null;
      email?: string | null;
    } | null;
    event?: {
      title?: string | null;
      date?: string | null;
      location?: string | null;
      creatorName?: string | null;
    } | null;
  };
}

export default function CertificateModal({
  isOpen,
  onClose,
  ticket,
}: CertificateModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const attendeeName = ticket.user?.name || "Student Participant";
  const eventTitle = ticket.event?.title || "University Flagship Event";
  const eventDate = ticket.event?.date
    ? new Date(ticket.event.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Academic Year 2026-2027";
  const eventLocation = ticket.event?.location || "Lovely Professional University";
  const certificateId = `CPLY-CERT-${ticket.ticketNumber}`;

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const verificationUrl = `${origin}/tickets/${ticket.ticketNumber}`;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleCopyVerification = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(verificationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto print:p-0 print:bg-white print:static"
    >
      <div
        className="relative w-full max-w-3xl rounded-3xl border border-border/80 bg-card shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-200 print:border-none print:shadow-none print:max-w-none print:w-full print:m-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Header (Hidden in Print) */}
        <div className="flex items-center justify-between p-4 border-b border-border/70 bg-muted/30 print:hidden">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
                <span>Official Certificate of Participation</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold uppercase">
                  Verified Pass
                </span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyVerification}
              className="h-8 px-2.5 rounded-xl text-xs gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy Link"}</span>
            </Button>

            <Button
              size="sm"
              onClick={handlePrint}
              className="h-8 px-3 rounded-xl text-xs font-bold gap-1.5 cursor-pointer bg-primary text-primary-foreground shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-lg cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Certificate Landscape Presentation Sheet */}
        <div className="p-6 sm:p-10 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-foreground print:bg-white print:text-black">
          {/* Ornamental Outer Frame */}
          <div className="relative border-4 border-amber-500/40 rounded-2xl p-6 sm:p-10 shadow-inner overflow-hidden print:border-amber-700">
            {/* Inner Gold Border */}
            <div className="absolute inset-1.5 border border-amber-500/20 rounded-xl pointer-events-none" />

            {/* Corner Decorative Accents */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-500" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-500" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-500" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-500" />

            {/* University & DSW Crest Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 mb-2 border border-amber-500/30 shadow-xs">
                <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>

              <h4 className="text-[11px] sm:text-xs font-black tracking-[0.25em] uppercase text-amber-700 dark:text-amber-400">
                LOVELY PROFESSIONAL UNIVERSITY
              </h4>
              <p className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase mt-0.5">
                DIVISION OF STUDENT WELFARE • CAMPUSLY CREDENTIALS
              </p>
            </div>

            {/* Main Certificate Title */}
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-wide text-foreground uppercase border-b-2 border-amber-500/30 pb-3 inline-block">
                Certificate of Participation
              </h1>
            </div>

            {/* Presentation Statement */}
            <div className="text-center max-w-xl mx-auto space-y-3 mb-8">
              <p className="text-xs sm:text-sm text-muted-foreground italic font-serif">
                This official university credential is proudly presented to
              </p>

              <div className="py-1">
                <h2 className="text-xl sm:text-3xl font-extrabold text-foreground tracking-tight underline decoration-amber-500/40 decoration-2 underline-offset-8">
                  {attendeeName}
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-2">
                for active participation and successful completion at the{" "}
                <span className="font-bold text-foreground">{eventTitle}</span> held at{" "}
                <span className="font-medium text-foreground">{eventLocation}</span> on{" "}
                <span className="font-medium text-foreground">{eventDate}</span>.
              </p>
            </div>

            {/* Signatures & Verifiable QR Strip */}
            <div className="pt-6 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Signature 1: Dean DSW */}
              <div className="text-center sm:text-left">
                <div className="font-serif italic text-base sm:text-lg text-foreground/90 font-bold">
                  Dr. Sorabh Lakhanpal
                </div>
                <div className="w-32 h-0.5 bg-foreground/30 mt-1 mb-1 sm:mx-0 mx-auto" />
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Dean, Division of Student Welfare (DSW)
                </p>
                <p className="text-[9px] text-muted-foreground">Lovely Professional University</p>
              </div>

              {/* Center Medallion Badge */}
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs mb-1">
                  <ShieldCheck className="w-5 h-5 text-black" />
                </div>
                <span className="text-[9px] font-extrabold tracking-wider uppercase text-amber-800 dark:text-amber-300">
                  OFFICIAL GATE VERIFIED
                </span>
                <span className="text-[8px] font-mono text-muted-foreground">
                  SERIAL: {ticket.ticketNumber}
                </span>
              </div>

              {/* Scannable Verification QR */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] font-bold uppercase tracking-wider block text-foreground">
                    SCAN TO VERIFY
                  </span>
                  <span className="text-[9px] text-muted-foreground font-mono block">
                    {certificateId}
                  </span>
                </div>
                <QRCodeDisplay
                  value={verificationUrl}
                  size={75}
                  bordered={true}
                  darkColor="#0f172a"
                  lightColor="#ffffff"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
