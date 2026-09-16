"use client";

import React from "react";
import CampusMap from "@/components/CampusMap";
import { CampusVenue, CAMPUS_VENUES } from "@/lib/campus-map-data";
import { X, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VenueMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  venueName?: string;
  venueLandmark?: string;
  venueSlug?: string;
}

export default function VenueMapModal({
  isOpen,
  onClose,
  venueName,
  venueLandmark,
  venueSlug,
}: VenueMapModalProps) {
  if (!isOpen) return null;

  // Attempt to match venue by name or slug
  const fallbackVenue = CAMPUS_VENUES[0]!;
  const matchedVenue =
    CAMPUS_VENUES.find(
      (v) =>
        (venueSlug && v.id === venueSlug) ||
        (venueName && v.name.toLowerCase().includes(venueName.toLowerCase())) ||
        (venueName && venueName.toLowerCase().includes(v.blockNumber?.toLowerCase() || "")) ||
        (venueName && venueName.toLowerCase().includes(v.shortName.toLowerCase()))
    ) || fallbackVenue;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-background/80 backdrop-blur-md animate-in fade-in-0">
      <div
        className="relative w-full max-w-5xl rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/80 bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground leading-tight flex items-center gap-2">
                <span>Campus Venue Navigator</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20">
                  LPU Live
                </span>
              </h2>
              <p className="text-[11px] text-muted-foreground">
                {venueName || matchedVenue.name} • {venueLandmark || matchedVenue.nearestLandmark}
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Modal Body: Full Map Canvas */}
        <div className="p-3 sm:p-4 flex-1 overflow-hidden">
          <CampusMap
            initialVenueId={matchedVenue.id}
            className="h-[520px] w-full"
            showSidebar={true}
          />
        </div>
      </div>
    </div>
  );
}
