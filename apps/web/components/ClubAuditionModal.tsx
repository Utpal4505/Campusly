"use client";

import { useState } from "react";
import {
  X,
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Code2,
  Palette,
  Users,
  Video,
  Cpu,
  PenTool,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

interface ClubAuditionModalProps {
  isOpen: boolean;
  onClose: () => void;
  clubIdOrSlug: string;
  clubName: string;
}

const DOMAINS = [
  { id: "Technical / Dev", label: "Technical / Dev", icon: Code2, desc: "Web, Cloud, Mobile, AI/ML, Competitive Coding" },
  { id: "UI/UX Design", label: "UI/UX Design", icon: Palette, desc: "Figma design systems, Graphics, Motion & Branding" },
  { id: "Management & PR", label: "Management & PR", icon: Users, desc: "Event Ops, Sponsorships, Guest Relations, Outreach" },
  { id: "Media / Video", label: "Media / Video", icon: Video, desc: "Photography, Drone Shoots, Video Reels, Aftermovies" },
  { id: "Robotics / Hardware", label: "Robotics / Hardware", icon: Cpu, desc: "IoT, Arduino, ESP32, ROS, Embedded Systems" },
  { id: "Content / Writing", label: "Content / Writing", icon: PenTool, desc: "Technical blogs, Social media copies, Newsletters" },
];

export default function ClubAuditionModal({
  isOpen,
  onClose,
  clubIdOrSlug,
  clubName,
}: ClubAuditionModalProps) {
  const { user, isAuthenticated } = useAuth();

  const [studentName, setStudentName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [regNo, setRegNo] = useState("");
  const [branch, setBranch] = useState("B.Tech CSE '26");
  const [year, setYear] = useState(2);
  const [domain, setDomain] = useState("Technical / Dev");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [statement, setStatement] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !email.trim() || !regNo.trim() || !statement.trim()) {
      setError("Please complete all required fields including your registration number and statement.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const apiOrigin = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiOrigin}/clubs/${clubIdOrSlug}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName,
          email,
          regNo,
          branch,
          year,
          domain,
          portfolioUrl: portfolioUrl.trim() || undefined,
          statement,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to submit audition application");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || "Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in-0">
      <div className="relative w-full max-w-lg rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Official Inductions 2026-27
              </span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>DSW Verified</span>
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              Apply for {clubName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-5 pr-1 space-y-5 text-xs">
          {success ? (
            <div className="py-8 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Application Submitted!</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto leading-relaxed">
                  Your audition application for <span className="font-semibold text-foreground">{domain}</span> has been routed to the core leads of {clubName}.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 text-left space-y-2 max-w-xs mx-auto">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Candidate:</span>
                  <span className="font-semibold text-foreground">{studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reg No:</span>
                  <span className="font-mono text-foreground font-semibold">{regNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Domain:</span>
                  <span className="font-semibold text-primary">{domain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">APPLIED (Under Review)</span>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground">
                You will receive audition interview updates and notifications inside Campusly.
              </p>

              <Button
                onClick={handleReset}
                className="rounded-xl text-xs font-semibold px-6 cursor-pointer"
              >
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Domain Selection */}
              <div>
                <label className="font-bold text-foreground block mb-2">
                  Select Your Preferred Domain <span className="text-destructive">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DOMAINS.map((item) => {
                    const Icon = item.icon;
                    const isSelected = domain === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setDomain(item.id)}
                        className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border/70 hover:border-border bg-card"
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-foreground text-[11px] leading-tight">
                            {item.label}
                          </p>
                          <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Student Identity Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Utpal Sharma"
                    className="w-full h-9 px-3 rounded-xl border border-border/80 bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">
                    LPU Reg. Number <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    placeholder="e.g. 12204581"
                    className="w-full h-9 px-3 rounded-xl border border-border/80 bg-background text-foreground font-mono text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-muted-foreground block mb-1">
                    Student Email <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name.regno@lpu.in"
                    className="w-full h-9 px-3 rounded-xl border border-border/80 bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-muted-foreground block mb-1">
                      Branch
                    </label>
                    <input
                      type="text"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      placeholder="B.Tech CSE"
                      className="w-full h-9 px-3 rounded-xl border border-border/80 bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-muted-foreground block mb-1">
                      Year
                    </label>
                    <select
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full h-9 px-2.5 rounded-xl border border-border/80 bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value={1}>1st Year</option>
                      <option value={2}>2nd Year</option>
                      <option value={3}>3rd Year</option>
                      <option value={4}>4th Year</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Portfolio / Link */}
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">
                  Portfolio / GitHub / Drive / Behance Link (Optional)
                </label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://github.com/username or drive link"
                  className="w-full h-9 px-3 rounded-xl border border-border/80 bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Statement */}
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">
                  Why do you want to join {clubName}? <span className="text-destructive">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  placeholder="Tell the leads about your projects, skills, and how you want to contribute to the community..."
                  className="w-full p-3 rounded-xl border border-border/80 bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary resize-none leading-relaxed"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="rounded-xl text-xs font-semibold gap-1.5 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Audition Application</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
