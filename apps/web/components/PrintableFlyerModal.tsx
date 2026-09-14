"use client";

import { useState } from "react";
import {
  X,
  Printer,
  Copy,
  Check,
  Calendar,
  MapPin,
  Users,
  Sparkles,
  QrCode,
  Tag,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import QRCodeDisplay from "./QRCodeDisplay";

interface PrintableFlyerModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "club" | "event";
  title: string;
  description?: string | null;
  coverImage?: string | null;
  logo?: string | null;
  urlPath: string; // e.g. /events/sih or /clubs/gdg
  details: {
    date?: string;
    location?: string;
    organizerName?: string;
    price?: number;
    memberCount?: number;
    category?: string;
  };
}

export default function PrintableFlyerModal({
  isOpen,
  onClose,
  type,
  title,
  description,
  coverImage,
  logo,
  urlPath,
  details,
}: PrintableFlyerModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const fullUrl = `${origin}${urlPath}`;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto print:p-0 print:bg-white print:static"
    >
      <div
        className="relative w-full max-w-md rounded-3xl border border-border/80 bg-card shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-200 print:border-none print:shadow-none print:max-w-none print:w-full print:m-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between p-4 border-b border-border/70 bg-muted/30 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground">
              {type === "event" ? "Event Notice Board Flyer" : "Club Campus Poster"}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
              Ready to Print
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className="h-8 px-2.5 rounded-lg text-xs gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </Button>

            <Button
              size="sm"
              onClick={handlePrint}
              className="h-8 px-3 rounded-lg text-xs font-semibold gap-1.5 cursor-pointer bg-primary text-primary-foreground"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Poster</span>
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

        {/* Printable Physical Notice-Board Poster Sheet */}
        <div
          id="campusly-flyer-print-target"
          className="p-6 bg-card text-card-foreground flex flex-col items-center print:p-8 print:w-full print:max-w-2xl print:mx-auto"
        >
          {/* Official University Watermark Header */}
          <div className="w-full text-center pb-3 border-b border-border/60 mb-4">
            <p className="text-[10px] tracking-[0.2em] font-extrabold uppercase text-primary">
              LOVELY PROFESSIONAL UNIVERSITY • CAMPUSLY
            </p>
          </div>

          {/* Banner Image with Overlapping Emblem */}
          {coverImage && (
            <div className="relative w-full h-36 rounded-2xl overflow-hidden shadow-xs mb-6 border border-border/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImage}
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {logo && (
                <div className="absolute bottom-3 left-4 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo}
                    alt={title}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-white bg-white shadow-md"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 block">
                      {type === "event" ? "LPU Campus Event" : "Official Student Club"}
                    </span>
                    <h2 className="text-sm font-extrabold text-white leading-tight line-clamp-1">
                      {title}
                    </h2>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Non-banner fallback header */}
          {!coverImage && (
            <div className="text-center mb-4">
              <h2 className="text-lg font-black text-foreground tracking-tight">{title}</h2>
              <p className="text-xs text-muted-foreground mt-1">
                {type === "event" ? "LPU Campus Event" : "Official Student Club"}
              </p>
            </div>
          )}

          {/* Description */}
          {description && (
            <p className="text-xs text-muted-foreground text-center line-clamp-3 mb-5 px-2">
              {description}
            </p>
          )}

          {/* Event / Club Specific Details Grid */}
          <div className="w-full grid grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-xs mb-5">
            {details.date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="font-semibold truncate">
                  {new Date(details.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}

            {details.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate">{details.location}</span>
              </div>
            )}

            {details.organizerName && (
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate">{details.organizerName}</span>
              </div>
            )}

            {typeof details.price === "number" && (
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {details.price === 0 ? "Free Entrance" : `₹${details.price}`}
                </span>
              </div>
            )}

            {details.memberCount !== undefined && (
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>{details.memberCount} Members</span>
              </div>
            )}

            {details.category && (
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate">{details.category}</span>
              </div>
            )}
          </div>

          {/* Centerpiece: Large Scannable QR Code */}
          <div className="flex flex-col items-center justify-center p-4 rounded-3xl border-2 border-primary/20 bg-background shadow-sm mb-4 w-full">
            <QRCodeDisplay
              value={fullUrl}
              size={190}
              bordered={false}
              darkColor="#0f172a"
              lightColor="#ffffff"
            />
            <div className="mt-3 text-center">
              <span className="text-xs font-bold text-foreground block">
                SCAN WITH PHONE CAMERA
              </span>
              <span className="text-[10px] text-muted-foreground">
                {type === "event" ? "Instant Event Registration & Gate Pass" : "Join Club Community & Meet Peers"}
              </span>
            </div>
          </div>

          {/* Footer Callout */}
          <div className="text-center pt-2 border-t border-border/50 w-full text-[10px] text-muted-foreground flex items-center justify-center gap-1">
            <span>Powered by Campusly</span>
            <span>•</span>
            <span className="font-mono">{origin.replace(/https?:\/\//, "")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
