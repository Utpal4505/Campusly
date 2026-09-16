"use client";

import React, { useState } from "react";
import AppHeader from "@/components/AppHeader";
import CampusMap from "@/components/CampusMap";
import { CAMPUS_VENUES } from "@/lib/campus-map-data";
import {
  Compass,
  MapPin,
  Building,
  Navigation,
  Footprints,
  ShieldCheck,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CampusMapPage() {
  const [selectedVenue, setSelectedVenue] = useState(CAMPUS_VENUES[0]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AppHeader />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/70 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                <span>Campus Navigation Suite</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                Real-Time OSM
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              LPU Campus Venue Navigator
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Explore 600+ acres of Lovely Professional University. Locate lecture halls in Block 38, hackathons in Innovation Studio, cultural events at Unipolis, and food courts with authentic GPS walking paths.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Lovely+Professional+University"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                variant="outline"
                className="h-9 px-3.5 rounded-xl text-xs font-semibold gap-1.5 cursor-pointer shadow-2xs"
              >
                <Navigation className="w-3.5 h-3.5 text-primary" />
                <span>Google Maps View</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </Button>
            </a>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl border border-border/70 bg-card/50 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-sm">
              50+
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Academic Blocks</p>
              <p className="text-[11px] text-muted-foreground">SCSE, Robotics, Labs</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-border/70 bg-card/50 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-sm">
              10k+
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Unipolis Arena</p>
              <p className="text-[11px] text-muted-foreground">YouthVibe & Concerts</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-border/70 bg-card/50 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-sm">
              4 Fl
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Central Library</p>
              <p className="text-[11px] text-muted-foreground">DSW Headquarters</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-border/70 bg-card/50 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-sm">
              75m
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Walking Guide</p>
              <p className="text-[11px] text-muted-foreground">Meters / min pace</p>
            </div>
          </div>
        </div>

        {/* Interactive Real Map Canvas */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>Interactive Campus Grid & Floor Plans</span>
            </span>
            <span className="text-[11px] text-muted-foreground">
              Click any pin or list item to trace walking routes
            </span>
          </div>

          <CampusMap
            initialVenueId="block-38"
            onSelectVenue={setSelectedVenue}
            className="h-[620px] w-full"
            showSidebar={true}
          />
        </div>
      </main>
    </div>
  );
}
