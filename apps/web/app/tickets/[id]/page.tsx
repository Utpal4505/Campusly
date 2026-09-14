"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { getAnimeAvatar } from "@/lib/avatars";
import { authClient } from "@/lib/auth";
import type { TicketItem } from "@repo/schemas";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Printer,
  Share2,
  Download,
  CalendarPlus,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

import QRCodeDisplay from "@/components/QRCodeDisplay";

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<TicketItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!ticketId) return;

    authClient
      .getTicket(ticketId)
      .then((data) => {
        if (isMounted) setTicket(data);
      })
      .catch((err) => {
        if (isMounted) setError(err?.message || "Unable to retrieve ticket.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [ticketId]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddToGoogleCalendar = () => {
    if (!ticket?.event) return;
    const eventDate = new Date(ticket.event.date);
    const endDate = new Date(eventDate.getTime() + 3 * 60 * 60 * 1000); // default 3h

    const formatGCalDate = (d: Date) =>
      d.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const url = new URL("https://calendar.google.com/calendar/render");
    url.searchParams.set("action", "TEMPLATE");
    url.searchParams.set("text", ticket.event.title);
    url.searchParams.set(
      "dates",
      `${formatGCalDate(eventDate)}/${formatGCalDate(endDate)}`
    );
    url.searchParams.set(
      "details",
      `Campusly Event Entrance Pass: ${ticket.ticketNumber}\nTicket Status: ${ticket.status}\nAttendee: ${ticket.user?.name}`
    );
    url.searchParams.set("location", ticket.event.location || "Campus Venue");

    window.open(url.toString(), "_blank");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-20 print:bg-white print:text-black print:pb-0">
      <div className="print:hidden">
        <AppHeader />
      </div>

      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-8">
        
        {/* Navigation Row */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Link
            href="/tickets"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Tickets</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyLink}
              className="h-8 px-2.5 rounded-lg text-xs gap-1 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? "Copied!" : "Share"}</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handlePrint}
              className="h-8 px-2.5 rounded-lg text-xs gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-24 text-center flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
            <p className="text-xs text-muted-foreground">Retrieving verified ticket...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 rounded-2xl border border-destructive/40 bg-destructive/5 text-center my-12">
            <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
            <h2 className="text-sm font-bold text-foreground mb-1">Ticket Inaccessible</h2>
            <p className="text-xs text-muted-foreground mb-4">{error}</p>
            <Link href="/tickets">
              <Button size="sm" variant="outline" className="text-xs rounded-xl">
                Return to Tickets
              </Button>
            </Link>
          </div>
        )}

        {/* Digital Entrance Pass Card */}
        {ticket && !isLoading && (
          <div className="relative rounded-3xl border border-border/80 bg-card shadow-xl overflow-hidden print:border-black print:shadow-none">
            
            {/* Top Pass Header */}
            <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-6 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
              <div className="relative z-10 flex items-center justify-between mb-3 text-[11px] font-bold uppercase tracking-widest text-white/80">
                <span>CAMPUSLY PASS</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>OFFICIAL ENTRANCE PASS</span>
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black tracking-tight mb-2 leading-tight">
                {ticket.event?.title}
              </h1>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>STATUS: {ticket.status}</span>
              </div>
            </div>

            {/* Middle Section: Event & Student Info */}
            <div className="p-6 space-y-5">
              
              {/* Event Time & Venue Details */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-0.5">
                    Date & Time
                  </span>
                  <p className="font-bold text-foreground leading-snug">
                    {ticket.event?.date
                      ? new Date(ticket.event.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "TBA"}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {ticket.event?.date
                      ? new Date(ticket.event.date).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : ""}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block mb-0.5">
                    Location & Venue
                  </span>
                  <p className="font-bold text-foreground leading-snug">
                    {ticket.event?.location || "Main Campus Auditorium"}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Lovely Professional University
                  </p>
                </div>
              </div>

              {/* Attendee Details */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-border/60 bg-muted/20">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-border shrink-0">
                  <img
                    src={getAnimeAvatar(ticket.user?.name || "Student")}
                    alt="Attendee"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                    Attendee
                  </span>
                  <p className="text-sm font-bold text-foreground truncate">
                    {ticket.user?.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {ticket.user?.email}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                    Tier
                  </span>
                  <span className="text-xs font-bold text-primary">
                    {ticket.registration?.paymentStatus === "PAID"
                      ? `PAID (₹${ticket.registration?.amount})`
                      : "FREE PASS"}
                  </span>
                </div>
              </div>

              {/* Ticket Notch Divider */}
              <div className="relative my-6 -mx-6 flex items-center">
                <div className="w-6 h-6 rounded-r-full bg-background border-r border-t border-b border-border/80 shrink-0" />
                <div className="flex-1 border-b-2 border-dashed border-border/80 mx-2" />
                <div className="w-6 h-6 rounded-l-full bg-background border-l border-t border-b border-border/80 shrink-0" />
              </div>

              {/* QR Code & Scan Pass Section */}
              <div className="text-center flex flex-col items-center">
                <span className="text-[11px] font-semibold text-muted-foreground mb-3">
                  Scan for Campus Security & Entrance Check-in
                </span>

                <QRCodeDisplay
                  value={ticket.ticketNumber}
                  size={180}
                  bordered={true}
                  darkColor="#0f172a"
                  lightColor="#ffffff"
                />

                <div className="mt-4 inline-block px-4 py-1.5 rounded-xl bg-muted/60 border border-border/70">
                  <span className="font-mono text-sm sm:text-base font-black tracking-widest text-foreground">
                    {ticket.ticketNumber}
                  </span>
                </div>

                {ticket.registration?.paymentId && (
                  <p className="text-[10px] font-mono text-muted-foreground mt-2">
                    Ref: {ticket.registration.paymentId}
                  </p>
                )}
              </div>

            </div>

            {/* Bottom Actions Footer */}
            <div className="p-4 bg-muted/30 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
              <button
                type="button"
                onClick={handleAddToGoogleCalendar}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span>Add to Google Calendar</span>
              </button>

              <Link
                href={`/events/${ticket.eventId}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>View Event Details</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
