"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth";
import type { TicketItem } from "@repo/schemas";
import {
  Ticket,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Loader2,
  CheckCircle2,
  Tag,
} from "lucide-react";

export default function MyTicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  useEffect(() => {
    let isMounted = true;
    authClient
      .getTickets()
      .then((data) => {
        if (isMounted) {
          setTickets(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => {
        console.error("Failed to load tickets:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const now = new Date();
  const upcomingTickets = tickets.filter(
    (t) => t.event?.date && new Date(t.event.date) >= now
  );
  const pastTickets = tickets.filter(
    (t) => t.event?.date && new Date(t.event.date) < now
  );

  const displayTickets = activeTab === "upcoming" ? upcomingTickets : pastTickets;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-20">
      <AppHeader />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <Ticket className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-black tracking-tight text-foreground">
                My Event Tickets
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Official digital entrance passes for your registered campus events.
            </p>
          </div>

          <Link href="/events">
            <Button
              size="sm"
              variant="outline"
              className="text-xs font-semibold rounded-lg gap-1.5 cursor-pointer"
            >
              <span>Explore More Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 my-6">
          <button
            type="button"
            onClick={() => setActiveTab("upcoming")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "upcoming"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <span>Upcoming Events</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === "upcoming"
                  ? "bg-white/20 text-white"
                  : "bg-muted-foreground/20 text-muted-foreground"
              }`}
            >
              {upcomingTickets.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("past")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "past"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <span>Past Events</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === "past"
                  ? "bg-white/20 text-white"
                  : "bg-muted-foreground/20 text-muted-foreground"
              }`}
            >
              {pastTickets.length}
            </span>
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
            <p className="text-xs text-muted-foreground">Loading your tickets...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && displayTickets.length === 0 && (
          <div className="py-16 px-6 text-center border-2 border-dashed border-border/70 rounded-2xl bg-card/40 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground mb-3">
              <Ticket className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-1">
              {activeTab === "upcoming"
                ? "No upcoming tickets yet"
                : "No past tickets found"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mb-5">
              {activeTab === "upcoming"
                ? "Register for hackathons, workshops, and project showcases to get your official entrance passes."
                : "Your attended campus events will appear here once they conclude."}
            </p>
            <Link href="/events">
              <Button size="sm" className="rounded-xl text-xs font-semibold gap-1.5 cursor-pointer">
                <span>Browse Campus Events</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        )}

        {/* Tickets Grid */}
        {!isLoading && displayTickets.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {displayTickets.map((ticket) => {
              const eventDate = ticket.event?.date ? new Date(ticket.event.date) : null;
              const isPaid = ticket.registration?.paymentStatus === "PAID";
              const formattedDate = eventDate
                ? eventDate.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Date TBA";

              const formattedTime = eventDate
                ? eventDate.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "";

              return (
                <div
                  key={ticket.id}
                  className="group relative rounded-2xl border border-border/70 bg-card hover:border-primary/50 transition-all shadow-xs hover:shadow-md overflow-hidden flex flex-col md:flex-row"
                >
                  {/* Left Calendar Strip */}
                  <div className="md:w-32 bg-muted/40 p-4 border-b md:border-b-0 md:border-r border-border/60 flex md:flex-col items-center justify-between md:justify-center text-center shrink-0">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
                        {eventDate ? eventDate.toLocaleDateString("en-US", { month: "short" }) : "EVENT"}
                      </span>
                      <span className="text-2xl md:text-3xl font-black text-foreground block leading-tight">
                        {eventDate ? eventDate.getDate() : "--"}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground font-medium md:mt-1">
                      {eventDate ? eventDate.toLocaleDateString("en-US", { weekday: "short" }) : ""}
                    </span>
                  </div>

                  {/* Center Event Information */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>{ticket.status}</span>
                        </span>

                        {isPaid ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                            PAID (₹{ticket.registration?.amount || ticket.event?.price})
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground border border-border">
                            FREE PASS
                          </span>
                        )}

                        <span className="font-mono text-[11px] font-semibold text-muted-foreground ml-auto">
                          {ticket.ticketNumber}
                        </span>
                      </div>

                      <h2 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1.5">
                        {ticket.event?.title || "Campus Event"}
                      </h2>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-muted-foreground mb-3">
                        {formattedTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-muted-foreground/70" />
                            <span>{formattedTime}</span>
                          </span>
                        )}
                        {ticket.event?.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-muted-foreground/70" />
                            <span>{ticket.event.location}</span>
                          </span>
                        )}
                      </div>

                      {/* Interest tags */}
                      {ticket.event?.interests && ticket.event.interests.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {ticket.event.interests.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted/60 text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Row */}
                    <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">
                        Issued to: <strong className="text-foreground">{ticket.user?.name}</strong>
                      </span>

                      <Link href={`/tickets/${ticket.id}`}>
                        <Button
                          size="sm"
                          className="h-8 px-3 rounded-lg text-xs font-semibold gap-1.5 cursor-pointer shadow-xs"
                        >
                          <span>View Ticket</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}
