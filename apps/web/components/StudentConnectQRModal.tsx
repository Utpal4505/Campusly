"use client";

import { useState } from "react";
import {
  X,
  Share2,
  Copy,
  Check,
  Sparkles,
  QrCode,
  GraduationCap,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import QRCodeDisplay from "./QRCodeDisplay";

interface StudentConnectQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    username?: string | null;
    avatar?: string | null;
    department?: string | null;
    yearOfStudy?: number | null;
    interests?: string[];
  };
}

export default function StudentConnectQRModal({
  isOpen,
  onClose,
  user,
}: StudentConnectQRModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Resolve target URL
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const identifier = user.username || user.id;
  const profileUrl = `${origin}/people/${encodeURIComponent(identifier)}`;

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: `${user.name} on Campusly`,
          text: `Connect with ${user.name} on Campusly LPU!`,
          url: profileUrl,
        })
        .catch(() => handleCopy());
    } else {
      handleCopy();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-sm rounded-3xl border border-border/80 bg-card p-6 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background glow accents */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-12 -mt-12" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl pointer-events-none -ml-12 -mb-12" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close connect pass"
          className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Pass Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campus Connect Pass</span>
          </div>
          <h3 className="text-lg font-bold text-foreground">Scan to Connect</h3>
          <p className="text-xs text-muted-foreground">
            Share with batchmates, hackathon partners & club peers
          </p>
        </div>

        {/* Styled Digital Identity Card */}
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-b from-card via-background to-card/50 p-5 shadow-inner text-center relative mb-5">
          {/* Avatar and Name */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative mb-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  user.avatar ||
                  `https://api.dicebear.com/9.x/micah/svg?seed=${encodeURIComponent(
                    user.username || user.name
                  )}`
                }
                alt={user.name}
                className="w-16 h-16 rounded-full border-2 border-primary/40 object-cover shadow-sm bg-muted"
              />
              <div
                className="absolute bottom-0 right-0 p-1 rounded-full bg-primary text-primary-foreground shadow-xs"
                title="Verified Student"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            <h4 className="font-bold text-base text-foreground leading-tight">{user.name}</h4>
            {user.username && (
              <span className="text-xs font-mono text-primary/90 mt-0.5">
                @{user.username}
              </span>
            )}

            {(user.department || user.yearOfStudy) && (
              <div className="flex items-center justify-center gap-2 mt-2 text-[11px] text-muted-foreground flex-wrap">
                {user.department && (
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-primary/70" />
                    <span className="truncate max-w-[160px]">{user.department}</span>
                  </span>
                )}
                {user.yearOfStudy && (
                  <span className="inline-flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 text-primary/70" />
                    <span>Year {user.yearOfStudy}</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Scannable QR Code */}
          <div className="flex justify-center mb-3">
            <QRCodeDisplay
              value={profileUrl}
              size={180}
              bordered={true}
              darkColor="#0f172a"
              lightColor="#ffffff"
            />
          </div>

          <div className="text-[11px] font-medium text-muted-foreground flex items-center justify-center gap-1.5">
            <QrCode className="w-3.5 h-3.5 text-primary" />
            <span>Open camera & point to connect</span>
          </div>

          {/* Interests preview pills */}
          {user.interests && user.interests.length > 0 && (
            <div className="flex items-center justify-center gap-1.5 mt-3 flex-wrap">
              {user.interests.slice(0, 3).map((interest) => (
                <span
                  key={interest}
                  className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] font-medium"
                >
                  {interest}
                </span>
              ))}
              {user.interests.length > 3 && (
                <span className="text-[10px] text-muted-foreground">
                  +{user.interests.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex-1 h-9 rounded-xl text-xs font-semibold gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </Button>

          <Button
            size="sm"
            onClick={handleNativeShare}
            className="flex-1 h-9 rounded-xl text-xs font-semibold gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Pass</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
