"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AppHeader from "@/components/AppHeader";
import { authClient } from "@/lib/auth";
import type { EventDetail } from "@repo/schemas";
import { getEventBySlug } from "@/lib/events-data";
import { getAnimeAvatar } from "@/lib/avatars";
import {
  ArrowLeft,
  Heart,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Zap,
  Sparkles,
  Share2,
  Trophy,
  Clock,
  Ticket,
  Check,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Info,
  Loader2,
} from "lucide-react";
import { getEventCoverImage } from "@/lib/event-assets";

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const rawSlug = (params?.slug as string) || "campus-hackathon-2026";
  const fallback = getEventBySlug(rawSlug);

  const [liveEvent, setLiveEvent] = useState<EventDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [paymentReceipt, setPaymentReceipt] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load Razorpay Checkout SDK
  useEffect(() => {
    if (typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    authClient
      .getEvent(rawSlug)
      .then((data) => {
        if (isMounted) {
          setLiveEvent(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch live event, using fallback:", err);
        if (isMounted) setIsLoading(false);
      });

    // Check if the current user already has a ticket for this event
    authClient
      .getTickets()
      .then((tickets) => {
        if (!isMounted || !Array.isArray(tickets)) return;
        const matchingTicket = tickets.find(
          (t) =>
            t.eventId === rawSlug ||
            t.event?.id === rawSlug ||
            t.event?.title?.toLowerCase() === rawSlug.toLowerCase() ||
            t.event?.title
              ?.toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .includes(rawSlug.toLowerCase())
        );
        if (matchingTicket) {
          setIsRegistered(true);
          setTicketId(matchingTicket.id);
          setPaymentReceipt(matchingTicket.ticketNumber);
        }
      })
      .catch(() => {
        // Guest or unauthenticated, ignore silently
      });

    return () => {
      isMounted = false;
    };
  }, [rawSlug]);

  const formattedDate = liveEvent?.date
    ? new Date(liveEvent.date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : fallback.date;

  const formattedTime = liveEvent?.date
    ? new Date(liveEvent.date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : fallback.time;

  const eventPrice = liveEvent?.price ?? (fallback.isFree ? 0 : 199);
  const isFree = eventPrice === 0;
  const entryFee = isFree ? "Free Entry" : `₹${eventPrice} / Participant`;

  const event = {
    id: liveEvent?.id || fallback.id,
    slug: rawSlug,
    title: liveEvent?.title || fallback.title,
    subtitle: liveEvent?.description || fallback.subtitle,
    category: (liveEvent?.interests?.[0]?.name as any) || fallback.category,
    categoryBadge: fallback.categoryBadge,
    date: formattedDate,
    time: formattedTime,
    monthDay: fallback.monthDay,
    venue: liveEvent?.location || fallback.venue,
    venueLandmark: fallback.venueLandmark,
    venueDirections: fallback.venueDirections,
    host: liveEvent?.creator?.name || fallback.host,
    hostSlug: fallback.hostSlug,
    entryFee,
    isFree,
    price: eventPrice,
    prizePool: fallback.prizePool,
    spotsTotal: 120,
    spotsRemaining: liveEvent
      ? Math.max(8, 120 - liveEvent.registrationCount)
      : fallback.spotsRemaining,
    registrationDeadline: fallback.registrationDeadline,
    gradient: fallback.gradient,
    accentColor: fallback.accentColor,
    about: liveEvent?.description || fallback.about,
    whatToExpect: fallback.whatToExpect,
    schedule: fallback.schedule,
    rules: fallback.rules,
    tags: liveEvent?.interests?.map((i: any) => i.name) || fallback.tags,
    mentors: fallback.mentors,
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleRegister = async () => {
    setIsRegistering(true);
    setRegisterError(null);
    try {
      const order = await authClient.createPaymentOrder(event.id);

      // If free event or already registered, registration was confirmed directly
      if (order.isFree || order.registered) {
        setIsRegistered(true);
        if (order.ticket?.ticketNumber) {
          setPaymentReceipt(order.ticket.ticketNumber);
        } else {
          setPaymentReceipt(`FREE-${Date.now().toString().slice(-6)}`);
        }
        if (order.ticket?.id) {
          setTicketId(order.ticket.id);
        }
        setIsRegistering(false);
        return;
      }

      // If paid event: Check for Razorpay checkout SDK
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        const options = {
          key: order.keyId || "rzp_test_campusly_dev",
          amount: order.amount,
          currency: order.currency || "INR",
          name: "Campusly",
          description: `${event.title} Registration Fee`,
          order_id: order.orderId,
          prefill: {
            name: "Student Participant",
            email: "student@university.edu",
          },
          theme: {
            color: "#7c3aed",
          },
          handler: async (response: any) => {
            try {
              const verifyRes = await authClient.verifyPayment(event.id, {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              setPaymentReceipt(response.razorpay_payment_id);
              if (verifyRes?.ticket?.id) {
                setTicketId(verifyRes.ticket.id);
              }
              setIsRegistered(true);
            } catch (err: any) {
              setRegisterError(err?.message || "Payment verification failed.");
            } finally {
              setIsRegistering(false);
            }
          },
          modal: {
            ondismiss: () => {
              setIsRegistering(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Dev / test mode fallback when Razorpay script isn't loaded:
        const simRes = await authClient.verifyPayment(event.id, {
          razorpayOrderId: order.orderId || `order_${Date.now()}`,
          razorpayPaymentId: `pay_sim_${Date.now().toString().slice(-6)}`,
          razorpaySignature: "simulated_success",
        });
        setPaymentReceipt(`pay_sim_${Date.now().toString().slice(-6)}`);
        if (simRes?.ticket?.id) {
          setTicketId(simRes.ticket.id);
        }
        setIsRegistered(true);
        setIsRegistering(false);
      }
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      if (
        errMsg.includes("401") ||
        err?.status === 401 ||
        errMsg.toLowerCase().includes("authenticated")
      ) {
        router.push(`/login?redirect=${encodeURIComponent(`/events/${rawSlug}`)}`);
        return;
      }
      if (errMsg.includes("already registered") || err?.status === 409) {
        setIsRegistered(true);
        try {
          const myTickets = await authClient.getTickets();
          const existingTicket = myTickets.find(
            (t) =>
              t.eventId === event.id ||
              t.event?.id === event.id ||
              t.event?.title?.toLowerCase() === event.title.toLowerCase()
          );
          if (existingTicket) {
            setTicketId(existingTicket.id);
            setPaymentReceipt(existingTicket.ticketNumber);
          }
        } catch {}
        setIsRegistering(false);
        return;
      }
      setRegisterError(errMsg || "Registration failed. Please try again.");
      setIsRegistering(false);
    }
  };

  const percentageFull = Math.round(
    ((event.spotsTotal - event.spotsRemaining) / event.spotsTotal) * 100
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <AppHeader />

      {/* Main Event Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6">
        
        {/* Top Breadcrumb & Quick Actions */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Events</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="h-8 px-3 rounded-lg border border-border/60 bg-card hover:bg-muted/50 flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer shadow-2xs"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? "Copied!" : "Share"}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSaved(!isSaved)}
              className={`h-8 px-3 rounded-lg border border-border/60 bg-card flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer shadow-2xs ${
                isSaved
                  ? "text-red-500 border-red-500/30 bg-red-500/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-red-500" : ""}`} />
              <span>{isSaved ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>

        {/* Hero Visual Banner */}
        <div className="w-full rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-white relative overflow-hidden mb-8 border shadow-md min-h-[300px]">
          {/* Real High-Resolution Visual Cover Photo */}
          <img
            src={getEventCoverImage(event.title, event.id, (liveEvent as any)?.coverImage, event.category)}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* High-contrast dark gradient overlay for optimal readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 backdrop-blur-[1px]" />

          <div className="relative z-10 flex items-center justify-between gap-3 mb-6 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md ${event.categoryBadge}`}>
              <Zap className="w-3.5 h-3.5" />
              {event.category}
            </span>

            <span className="text-xs font-bold text-white bg-black/40 px-3 py-1 rounded-full backdrop-blur-md border border-white/15 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>{event.prizePool}</span>
            </span>
          </div>

          <div className="relative z-10 max-w-2xl">
            <span className="text-[11px] font-mono uppercase tracking-widest text-primary font-bold block mb-1">
              Lovely Professional University • Campus Initiative
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              {event.title}
            </h1>
            <p className="text-sm sm:text-base text-white/80 font-medium mt-1.5">
              {event.subtitle}
            </p>
          </div>

          {/* Quick Stats Strip inside Banner */}
          <div className="relative z-10 mt-6 pt-4 border-t border-white/15 flex items-center justify-between gap-4 flex-wrap text-xs text-white/90">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="font-semibold">{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-300 shrink-0" />
              <span className="font-semibold">{event.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-300 shrink-0" />
              <span>{event.spotsRemaining} spots remaining</span>
            </div>
          </div>
        </div>

        {/* =======================================================================
            2-COLUMN CONTENT ARCHITECTURE
        ======================================================================= */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Overview, Schedule, Rules & Mentors (Col 8) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* About Section */}
            <section className="p-6 rounded-2xl border border-border/80 bg-card shadow-2xs">
              <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>About the Event</span>
              </h2>
              <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed">
                {event.about}
              </p>
            </section>

            {/* What to Expect Cards */}
            <section className="p-6 rounded-2xl border border-border/80 bg-card shadow-2xs">
              <h2 className="text-base font-bold text-foreground mb-4">
                What to Expect
              </h2>
              <div className="grid sm:grid-cols-3 gap-3.5 text-xs">
                {event.whatToExpect.map((item) => (
                  <div
                    key={item.title}
                    className="p-4 rounded-xl border border-border/60 bg-muted/20 hover:border-primary/30 transition-colors"
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="font-bold text-foreground mb-1">{item.title}</div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Event Timeline & Schedule */}
            <section className="p-6 rounded-2xl border border-border/80 bg-card shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Timeline & Schedule</span>
                </h2>
                <span className="text-[11px] text-muted-foreground">IST Campus Time</span>
              </div>

              <div className="space-y-4">
                {event.schedule.map((item, idx) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3.5 p-3 rounded-xl border border-border/50 bg-muted/15"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                      0{idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <h4 className="text-xs font-bold text-foreground">{item.title}</h4>
                        <span className="text-[10px] font-semibold text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 shrink-0">
                          {item.time}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Squad Eligibility & Competition Rules */}
            <section className="p-6 rounded-2xl border border-border/80 bg-card shadow-2xs">
              <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Eligibility & Rules</span>
              </h2>
              <div className="space-y-2 text-xs text-muted-foreground">
                {event.rules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Mentors & Tech Leads (Featuring Anime Avatars) */}
            <section className="p-6 rounded-2xl border border-border/80 bg-card shadow-2xs">
              <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span>Mentors & Jury Leads</span>
              </h2>

              <div className="grid sm:grid-cols-2 gap-3.5">
                {event.mentors.map((mentor) => (
                  <Link
                    key={mentor.name}
                    href={`/people/${mentor.avatarSlug}`}
                    className="p-3.5 rounded-xl border border-border/70 bg-muted/20 hover:border-primary/40 hover:bg-muted/40 transition-all flex items-center gap-3 group"
                  >
                    <div className="w-11 h-11 rounded-full overflow-hidden border border-border/80 shrink-0 bg-card">
                      <img
                        src={getAnimeAvatar(mentor.avatarSlug, mentor.name)}
                        alt={mentor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                        {mentor.name}
                      </h4>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {mentor.role}
                      </p>
                      <span className="text-[10px] text-primary font-medium inline-flex items-center gap-1 mt-0.5">
                        <span>View Portfolio</span>
                        <ChevronRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

          </div>

          {/* RIGHT COLUMN: Sticky Pass Card & Venue Logistics (Col 4) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            
            {/* Primary Registration / Digital Pass Card */}
            <div className="p-5 rounded-3xl border-2 border-primary/30 bg-card shadow-lg">
              
              {/* If Registered: Digital Ticket Pass */}
              {isRegistered ? (
                <div className="space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-border/60">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Confirmed Pass
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground font-semibold">
                      #LPU-{event.slug.substring(0, 4).toUpperCase()}-8841
                    </span>
                  </div>

                  <div className="text-center py-2">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto mb-2 shadow-md shadow-emerald-500/20">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">
                      You&apos;re Officially In!
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Show this student pass at physical entrance.
                    </p>
                  </div>

                  {/* Pass Ticket Body */}
                  <div className="p-3.5 rounded-2xl border border-dashed border-border/80 bg-muted/30 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                        Event
                      </span>
                      <span className="font-bold text-foreground text-xs block">
                        {event.title}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/40 text-[11px]">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                          Date
                        </span>
                        <span className="font-semibold text-foreground">{event.date}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                          Check-in
                        </span>
                        <span className="font-semibold text-foreground">{event.time}</span>
                      </div>
                    </div>

                    <div className="pt-1 border-t border-border/40 text-[11px] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                          Payment Status
                        </span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {event.isFree ? "Free Student Pass ✓" : `Paid (₹${event.price}) ✓`}
                        </span>
                      </div>
                      {paymentReceipt && (
                        <div className="text-right">
                          <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                            Receipt
                          </span>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {paymentReceipt}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <Link
                      href={ticketId ? `/tickets/${ticketId}` : "/tickets"}
                      className="w-full sm:flex-1"
                    >
                      <Button className="w-full rounded-xl text-xs font-bold cursor-pointer h-9 gap-1.5 shadow-xs bg-primary text-primary-foreground hover:bg-primary/90">
                        <Ticket className="w-3.5 h-3.5" />
                        <span>View Digital Ticket Pass</span>
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      onClick={() => setIsRegistered(false)}
                      className="w-full sm:w-auto rounded-xl text-xs font-semibold cursor-pointer h-9 text-muted-foreground hover:text-foreground"
                    >
                      Options
                    </Button>
                  </div>
                </div>
              ) : (
                /* Registration State */
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] text-muted-foreground font-semibold block">
                        Entry Fee
                      </span>
                      <div className="text-2xl font-black text-foreground">
                        {event.entryFee}
                      </div>
                    </div>

                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Registration Open
                    </span>
                  </div>

                  {/* Spots progress bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                      <span>Capacity</span>
                      <span className="font-bold text-foreground">{percentageFull}% filled</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${percentageFull}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1.5">
                      <span>{event.spotsRemaining} spots left</span>
                      <span>{event.registrationDeadline}</span>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    disabled={isRegistering}
                    onClick={handleRegister}
                    className="w-full rounded-xl text-xs font-bold shadow-xs gap-2 cursor-pointer h-11 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-70"
                  >
                    {isRegistering ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Ticket className="w-4 h-4" />
                    )}
                    <span>
                      {isRegistering
                        ? "Processing..."
                        : event.isFree
                          ? "Register for Free"
                          : `Pay & Register (${event.entryFee})`}
                    </span>
                  </Button>

                  {registerError && (
                    <p className="text-xs text-red-500 font-medium text-center bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                      {registerError}
                    </p>
                  )}

                  <div className="text-[11px] text-center text-muted-foreground flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Instant digital pass on student portal</span>
                  </div>
                </div>
              )}

            </div>

            {/* Venue Location & Campus Directions Card */}
            <div className="p-5 rounded-2xl border border-border/80 bg-card shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>Venue & Directions</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-foreground block">
                    {event.venue}
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    {event.venueLandmark}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-muted/30 border border-border/60 text-[11px] text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground block mb-0.5">Route Guide:</span>
                  {event.venueDirections}
                </div>
              </div>
            </div>

            {/* Host Club Card */}
            <div className="p-5 rounded-2xl border border-border/80 bg-card shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-primary" />
                <span>Organized By</span>
              </h3>

              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    {event.host}
                  </h4>
                  <span className="text-[10px] text-muted-foreground block">
                    Official Campus Organization
                  </span>
                </div>

                {event.hostSlug && (
                  <Link href={`/clubs/${event.hostSlug}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl text-[11px] h-7 px-2.5 gap-1 text-primary cursor-pointer"
                    >
                      <span>Club Page</span>
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-muted-foreground border-t border-border/40 bg-muted/20 mt-12">
        Campusly • LPU Student Event Network
      </footer>

    </div>
  );
}
