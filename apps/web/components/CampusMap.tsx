"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import {
  CampusVenue,
  CAMPUS_VENUES,
  LPU_CAMPUS_CENTER,
  VenueCategory,
  calculateDistanceMeters,
  estimateWalkingMinutes,
  getGoogleMapsNavigationUrl,
} from "@/lib/campus-map-data";
import {
  MapPin,
  Navigation,
  Compass,
  Building,
  ExternalLink,
  Layers,
  Footprints,
  Clock,
  Search,
  X,
  Share2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CampusMapProps {
  initialVenueId?: string;
  onSelectVenue?: (venue: CampusVenue) => void;
  className?: string;
  showSidebar?: boolean;
}

export default function CampusMap({
  initialVenueId,
  onSelectVenue,
  className = "h-[650px] w-full",
  showSidebar = true,
}: CampusMapProps) {
  const { resolvedTheme } = useTheme();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const routeLineRef = useRef<any>(null);

  const [selectedVenue, setSelectedVenue] = useState<CampusVenue | null>(
    CAMPUS_VENUES.find((v) => v.id === initialVenueId) || CAMPUS_VENUES[0] || null
  );
  const [selectedOrigin, setSelectedOrigin] = useState<string>("hostels-bh");
  const [activeCategory, setActiveCategory] = useState<VenueCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  const filteredVenues = CAMPUS_VENUES.filter((venue) => {
    const matchesCat = activeCategory === "all" || venue.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.nearestLandmark.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.rooms?.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase())) ||
      venue.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Initialize Leaflet Map
  useEffect(() => {
    let isCancelled = false;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (isCancelled || !mapContainerRef.current) return;

      const initialCenter: [number, number] = selectedVenue
        ? selectedVenue.coordinates
        : LPU_CAMPUS_CENTER;

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 16,
        minZoom: 14,
        maxZoom: 19,
        zoomControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Tile layer matching theme
      const isDark = resolvedTheme === "dark";
      const tileUrl = isDark
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

      const tiles = L.tileLayer(tileUrl, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      (map as any)._cartoTiles = tiles;

      // Add pins for all campus venues
      CAMPUS_VENUES.forEach((venue) => {
        const isAcademic = venue.category === "academic";
        const isAuditorium = venue.category === "auditorium";
        const isDining = venue.category === "dining";
        const isHostel = venue.category === "hostel";

        let pinBg = "bg-primary text-primary-foreground border-primary";
        let pinIcon = "📍";
        if (isAcademic) {
          pinBg = "bg-blue-600 text-white border-blue-400";
          pinIcon = "🏛️";
        } else if (isAuditorium) {
          pinBg = "bg-purple-600 text-white border-purple-400";
          pinIcon = "🎭";
        } else if (isDining) {
          pinBg = "bg-amber-600 text-white border-amber-400";
          pinIcon = "🍕";
        } else if (isHostel) {
          pinBg = "bg-emerald-600 text-white border-emerald-400";
          pinIcon = "🏠";
        }

        const customHtml = `
          <div class="relative group cursor-pointer">
            <div class="flex items-center justify-center w-8 h-8 rounded-xl shadow-lg border-2 ${pinBg} transition-transform group-hover:scale-110 font-bold text-xs">
              <span>${pinIcon}</span>
            </div>
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 ${pinBg} border-r-2 border-b-2"></div>
            <div class="absolute top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-background/90 text-foreground border border-border/80 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              ${venue.shortName}
            </div>
          </div>
        `;

        const icon = L.divIcon({
          html: customHtml,
          className: "custom-campus-pin",
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });

        const marker = L.marker(venue.coordinates, { icon }).addTo(map);

        marker.on("click", () => {
          setSelectedVenue(venue);
          onSelectVenue?.(venue);
          map.panTo(venue.coordinates, { animate: true, duration: 0.6 });
        });

        markersRef.current[venue.id] = marker;
      });

      setIsMapReady(true);
    }

    initMap();

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update tile theme when user switches dark/light
  useEffect(() => {
    if (!mapInstanceRef.current || !mapInstanceRef.current._cartoTiles) return;
    const isDark = resolvedTheme === "dark";
    const tileUrl = isDark
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
    mapInstanceRef.current._cartoTiles.setUrl(tileUrl);
  }, [resolvedTheme]);

  // Update map center and walking route when selectedVenue or selectedOrigin changes
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedVenue) return;

    mapInstanceRef.current.panTo(selectedVenue.coordinates, {
      animate: true,
      duration: 0.8,
    });

    // Draw route line if origin and destination differ
    async function updateRoute() {
      const L = (await import("leaflet")).default;
      if (!mapInstanceRef.current) return;

      if (routeLineRef.current) {
        mapInstanceRef.current.removeLayer(routeLineRef.current);
        routeLineRef.current = null;
      }

      const originVenue = CAMPUS_VENUES.find((v) => v.id === selectedOrigin);
      if (originVenue && selectedVenue && originVenue.id !== selectedVenue.id) {
        const polyline = L.polyline(
          [originVenue.coordinates, selectedVenue.coordinates],
          {
            color: "#6366f1",
            weight: 3,
            opacity: 0.8,
            dashArray: "6, 8",
          }
        ).addTo(mapInstanceRef.current);
        routeLineRef.current = polyline;
      }
    }

    updateRoute();
  }, [selectedVenue, selectedOrigin]);

  // Calculate distance & walking time
  const fallbackVenue = CAMPUS_VENUES[0]!;
  const originVenue = CAMPUS_VENUES.find((v) => v.id === selectedOrigin) || fallbackVenue;
  const distanceMeters = selectedVenue
    ? calculateDistanceMeters(originVenue.coordinates, selectedVenue.coordinates)
    : 0;
  const walkingMinutes = estimateWalkingMinutes(distanceMeters);

  const handleShare = () => {
    if (selectedVenue && typeof window !== "undefined") {
      navigator.clipboard.writeText(
        `https://www.google.com/maps/search/?api=1&query=${selectedVenue.coordinates[0]},${selectedVenue.coordinates[1]}`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className={`relative flex flex-col lg:flex-row rounded-2xl border border-border/80 bg-card overflow-hidden shadow-md ${className}`}>
      {/* Sidebar Directory (Toggleable) */}
      {showSidebar && (
        <aside className="w-full lg:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-border/80 flex flex-col bg-card/60 backdrop-blur-md z-10">
          {/* Header & Search */}
          <div className="p-3.5 border-b border-border/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground leading-tight">
                    LPU Campus Navigator
                  </h3>
                  <span className="text-[10px] text-muted-foreground">
                    Lovely Professional University
                  </span>
                </div>
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/60">
                OSM Live
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search Block 38, SDM, Unipolis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg border border-border/80 bg-background placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-1 focus:ring-primary"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 text-[11px]">
              {(["all", "academic", "auditorium", "dining", "hostel"] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2 py-1 rounded-md text-[10px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {cat === "all"
                    ? "All"
                    : cat === "academic"
                      ? "Blocks"
                      : cat === "auditorium"
                        ? "Auditoriums"
                        : cat === "dining"
                          ? "Food & Mall"
                          : "Hostels"}
                </button>
              ))}
            </div>
          </div>

          {/* Venues List */}
          <div className="flex-1 overflow-y-auto max-h-[260px] lg:max-h-none p-2 space-y-1 divide-y divide-border/20">
            {filteredVenues.map((venue) => {
              const isSelected = selectedVenue?.id === venue.id;
              return (
                <button
                  key={venue.id}
                  type="button"
                  onClick={() => {
                    setSelectedVenue(venue);
                    onSelectVenue?.(venue);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start gap-2.5 cursor-pointer pt-2 ${
                    isSelected
                      ? "bg-primary/10 border border-primary/25 shadow-xs"
                      : "hover:bg-muted/60 border border-transparent"
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-border/60 bg-muted/40 mt-0.5">
                    <img
                      src={venue.image}
                      alt={venue.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-foreground truncate">
                        {venue.shortName}
                      </h4>
                      {venue.blockNumber && (
                        <span className="text-[9px] font-mono text-primary font-bold shrink-0">
                          {venue.blockNumber}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                      {venue.nearestLandmark}
                    </p>
                    {venue.rooms && (
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        {venue.rooms.slice(0, 2).map((room) => (
                          <span
                            key={room}
                            className="text-[9px] px-1 py-0.2 rounded bg-muted text-muted-foreground border border-border/40 font-mono"
                          >
                            {room}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}

            {filteredVenues.length === 0 && (
              <div className="p-6 text-center text-xs text-muted-foreground">
                No campus venues match your search.
              </div>
            )}
          </div>

          {/* Quick Origin Selector (Walking Calculator) */}
          <div className="p-3 border-t border-border/60 bg-muted/20">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
              Walking From:
            </span>
            <select
              value={selectedOrigin}
              onChange={(e) => setSelectedOrigin(e.target.value)}
              className="w-full p-1.5 text-xs rounded-lg border border-border/80 bg-background text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {CAMPUS_VENUES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.shortName}
                </option>
              ))}
            </select>
          </div>
        </aside>
      )}

      {/* Map Canvas & Live Details Overlay */}
      <div className="relative flex-1 h-[420px] lg:h-auto min-h-[380px] w-full overflow-hidden bg-muted/20">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Selected Venue Floating Card */}
        {selectedVenue && (
          <div className="absolute top-3 left-3 right-3 sm:right-auto sm:max-w-sm z-20 animate-in fade-in-0 slide-in-from-top-2">
            <div className="p-3.5 rounded-xl border border-border/80 bg-background/95 backdrop-blur-md shadow-xl space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">📍</span>
                    <h3 className="text-xs font-bold text-foreground leading-tight">
                      {selectedVenue.name}
                    </h3>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {selectedVenue.nearestLandmark}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleShare}
                  className="h-7 w-7 p-0 shrink-0 text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Copy location link"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                </Button>
              </div>

              {/* Walking Distance Metric */}
              {selectedOrigin !== selectedVenue.id && (
                <div className="flex items-center justify-between p-2 rounded-lg bg-primary/5 border border-primary/20 text-xs">
                  <div className="flex items-center gap-1.5 text-foreground font-semibold">
                    <Footprints className="w-3.5 h-3.5 text-primary" />
                    <span>~{distanceMeters} meters</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary font-bold font-mono">
                    <Clock className="w-3 h-3" />
                    <span>~{walkingMinutes} min walk</span>
                  </div>
                </div>
              )}

              {/* Navigation Action Buttons */}
              <div className="flex items-center gap-2 pt-0.5">
                <a
                  href={getGoogleMapsNavigationUrl(
                    selectedVenue.coordinates[0],
                    selectedVenue.coordinates[1],
                    selectedVenue.name
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button
                    size="sm"
                    className="w-full h-7 text-xs font-semibold gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Directions in Google Maps</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Map Legend Overlay (Bottom Left) */}
        <div className="absolute bottom-3 left-3 z-20 hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border/70 bg-background/90 backdrop-blur-xs text-[10px] text-muted-foreground shadow-xs">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Blocks
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500" /> Auditoriums
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Food & Mall
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Hostels
          </span>
        </div>
      </div>
    </div>
  );
}
