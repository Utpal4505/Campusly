"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { getAnimeAvatar } from "@/lib/avatars";
import {
  Radio,
  X,
  Sparkles,
  ThumbsUp,
  MessageSquare,
  BarChart2,
  Bell,
  Pin,
  CheckCircle2,
  Send,
  Plus,
  ShieldCheck,
  Megaphone,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface LiveQuestion {
  id: string;
  authorName: string;
  authorUsername?: string;
  isAnonymous: boolean;
  text: string;
  upvotes: number;
  upvotedByMe: boolean;
  createdAt: string;
  isAnswered: boolean;
  isPinned: boolean;
}

interface PollOption {
  id: string;
  label: string;
  votes: number;
}

interface LivePoll {
  id: string;
  question: string;
  options: PollOption[];
  myVote?: string; // option id
  isActive: boolean;
  totalVotes: number;
}

interface LiveAnnouncement {
  id: string;
  author: string;
  role: string;
  message: string;
  timestamp: string;
  isUrgent: boolean;
}

interface LiveEventCompanionModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  eventSlug: string;
  isOrganizer: boolean;
}

export default function LiveEventCompanionModal({
  isOpen,
  onClose,
  eventTitle,
  eventSlug,
  isOrganizer,
}: LiveEventCompanionModalProps) {
  const { user, currentRole } = useAuth();
  const [activeTab, setActiveTab] = useState<"qa" | "polls" | "announcements">("qa");

  // Live Q&A State
  const [questions, setQuestions] = useState<LiveQuestion[]>([
    {
      id: "q-1",
      authorName: "Rohan Verma",
      authorUsername: "rohan_v",
      isAnonymous: false,
      text: "Will the judges consider external cloud APIs (e.g. OpenAI / AWS credits) during the evaluation round, or does everything need to run locally?",
      upvotes: 28,
      upvotedByMe: true,
      createdAt: "5m ago",
      isAnswered: false,
      isPinned: true,
    },
    {
      id: "q-2",
      authorName: "Anonymous Student",
      isAnonymous: true,
      text: "Is there hardware debugging equipment available in Block 32 for ESP32 serial communication?",
      upvotes: 14,
      upvotedByMe: false,
      createdAt: "12m ago",
      isAnswered: false,
      isPinned: false,
    },
    {
      id: "q-3",
      authorName: "Priya Sharma",
      authorUsername: "priya_s",
      isAnonymous: false,
      text: "Are we allowed to switch team members before Phase 2 submission cutoff?",
      upvotes: 7,
      upvotedByMe: false,
      createdAt: "18m ago",
      isAnswered: true,
      isPinned: false,
    },
  ]);

  const [newQuestionText, setNewQuestionText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [qaSort, setQaSort] = useState<"top" | "recent">("top");

  // Live Polls State
  const [polls, setPolls] = useState<LivePoll[]>([
    {
      id: "poll-1",
      question: "Which primary technology domain is your team building for?",
      options: [
        { id: "opt-1", label: "AI & Large Language Model Agents", votes: 42 },
        { id: "opt-2", label: "Fullstack Web & Mobile Platforms", votes: 31 },
        { id: "opt-3", label: "Hardware / IoT & Autonomous Rovers", votes: 16 },
        { id: "opt-4", label: "Fintech & Web3 Smart Contracts", votes: 9 },
      ],
      myVote: "opt-1",
      isActive: true,
      totalVotes: 98,
    },
    {
      id: "poll-2",
      question: "How is the venue Wi-Fi & power backup in your lab sector?",
      options: [
        { id: "p2-1", label: "🟢 Super Fast (>100 Mbps)", votes: 64 },
        { id: "p2-2", label: "🟡 Decent, occasional drops", votes: 22 },
        { id: "p2-3", label: "🔴 Need extra extension cords", votes: 8 },
      ],
      totalVotes: 94,
      isActive: true,
    },
  ]);

  // Stage Announcements State
  const [announcements, setAnnouncements] = useState<LiveAnnouncement[]>([
    {
      id: "ann-1",
      author: "Dr. Sorabh Lakhanpal (DSW)",
      role: "Dean / University Advisor",
      message:
        "⚡ Phase 1 Prototype submission portal is now OPEN on Campusly. Ensure your GitHub repo is public with a clear README and video walkthrough.",
      timestamp: "3 mins ago",
      isUrgent: true,
    },
    {
      id: "ann-2",
      author: "GDG Executive Team",
      role: "Stage Coordinator",
      message:
        "🍕 Refreshments and RedBull energy cans are now served at the Block 38 Ground Floor Cafeteria. Please carry your Campusly Gate Pass QR code.",
      timestamp: "20 mins ago",
      isUrgent: false,
    },
  ]);

  const [newAnnouncementText, setNewAnnouncementText] = useState("");

  if (!isOpen) return null;

  // Handle Question Upvote
  const handleToggleUpvote = (qId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === qId) {
          const nextUpvoted = !q.upvotedByMe;
          return {
            ...q,
            upvotedByMe: nextUpvoted,
            upvotes: nextUpvoted ? q.upvotes + 1 : Math.max(0, q.upvotes - 1),
          };
        }
        return q;
      })
    );
  };

  // Submit Question
  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newQ: LiveQuestion = {
      id: `q-${Date.now()}`,
      authorName: isAnonymous ? "Anonymous Student" : user?.name || "Student Attendee",
      authorUsername: isAnonymous ? undefined : user?.username || undefined,
      isAnonymous,
      text: newQuestionText.trim(),
      upvotes: 1,
      upvotedByMe: true,
      createdAt: "Just now",
      isAnswered: false,
      isPinned: false,
    };

    setQuestions((prev) => [newQ, ...prev]);
    setNewQuestionText("");
    setIsAnonymous(false);
  };

  // Vote in Poll
  const handleVotePoll = (pollId: string, optionId: string) => {
    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id === pollId) {
          if (poll.myVote) return poll; // already voted
          const nextOptions = poll.options.map((opt) =>
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
          );
          return {
            ...poll,
            options: nextOptions,
            myVote: optionId,
            totalVotes: poll.totalVotes + 1,
          };
        }
        return poll;
      })
    );
  };

  // Organizer Actions
  const handleTogglePin = (qId: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, isPinned: !q.isPinned } : q))
    );
  };

  const handleToggleAnswered = (qId: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, isAnswered: !q.isAnswered } : q))
    );
  };

  const handleBroadcastAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncementText.trim()) return;

    const newAnn: LiveAnnouncement = {
      id: `ann-${Date.now()}`,
      author: user?.name || "Stage Lead",
      role: currentRole === "DSW_ADMIN" ? "DSW University Admin" : "Club Executive",
      message: newAnnouncementText.trim(),
      timestamp: "Just now",
      isUrgent: true,
    };

    setAnnouncements((prev) => [newAnn, ...prev]);
    setNewAnnouncementText("");
  };

  const sortedQuestions = [...questions].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (qaSort === "top") return b.upvotes - a.upvotes;
    return 0; // maintain recent
  });

  const latestAnnouncement = announcements[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-background/85 backdrop-blur-md animate-in fade-in-0">
      <div
        className="relative w-full max-w-3xl rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/70 bg-muted/40">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-red-500/15 text-red-500 font-bold animate-pulse">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-foreground leading-none">
                  Stage Live Companion
                </h2>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-red-500 text-white animate-pulse">
                  LIVE
                </span>
                {isOrganizer && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold">
                    Presenter Controls
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground truncate max-w-md mt-0.5">
                {eventTitle}
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

        {/* Live Announcement Ticker Banner */}
        {latestAnnouncement && (
          <div className="px-4 py-2 bg-primary/10 border-b border-primary/20 flex items-center gap-2.5 text-xs text-primary font-medium">
            <Megaphone className="w-4 h-4 text-primary shrink-0 animate-bounce" />
            <div className="flex-1 min-w-0 truncate">
              <span className="font-bold mr-1">[{latestAnnouncement.author}]:</span>
              <span>{latestAnnouncement.message}</span>
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0 font-mono">
              {latestAnnouncement.timestamp}
            </span>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="flex items-center justify-between px-5 border-b border-border/60 bg-card">
          <div className="flex items-center gap-4 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("qa")}
              className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === "qa"
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Audience Q&A</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-muted text-foreground">
                {questions.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("polls")}
              className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === "polls"
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Live Polls</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-muted text-foreground">
                {polls.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("announcements")}
              className={`py-3 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === "announcements"
                  ? "border-primary text-primary font-bold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Backstage Alerts</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-muted text-foreground">
                {announcements.length}
              </span>
            </button>
          </div>

          {activeTab === "qa" && (
            <div className="flex items-center gap-1 bg-muted/40 p-0.5 rounded-lg text-[11px]">
              <button
                type="button"
                onClick={() => setQaSort("top")}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                  qaSort === "top" ? "bg-card text-foreground shadow-2xs font-bold" : "text-muted-foreground"
                }`}
              >
                Top Upvoted
              </button>
              <button
                type="button"
                onClick={() => setQaSort("recent")}
                className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                  qaSort === "recent" ? "bg-card text-foreground shadow-2xs font-bold" : "text-muted-foreground"
                }`}
              >
                Recent
              </button>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* TAB 1: AUDIENCE Q&A */}
          {activeTab === "qa" && (
            <div className="space-y-4">
              {/* Question Submission Input */}
              <form
                onSubmit={handleSubmitQuestion}
                className="p-3 rounded-xl border border-border/80 bg-muted/20 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span>Ask the Speakers & Jury</span>
                  </span>
                  <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary w-3 h-3"
                    />
                    <span>Ask anonymously</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type your question for the keynote / hackathon mentors..."
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 rounded-lg border border-border/80 bg-background text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  />
                  <Button
                    size="sm"
                    type="submit"
                    disabled={!newQuestionText.trim()}
                    className="h-8 px-3 rounded-lg text-xs font-semibold gap-1.5 shrink-0 shadow-xs cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Post</span>
                  </Button>
                </div>
              </form>

              {/* Questions Stream */}
              <div className="space-y-2.5">
                {sortedQuestions.map((q) => (
                  <div
                    key={q.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${
                      q.isPinned
                        ? "border-primary/40 bg-primary/5 shadow-xs"
                        : q.isAnswered
                          ? "border-border/50 bg-muted/10 opacity-75"
                          : "border-border/70 bg-card hover:border-border"
                    }`}
                  >
                    {/* Upvote Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleUpvote(q.id)}
                      className={`flex flex-col items-center justify-center min-w-10 px-2 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                        q.upvotedByMe
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : "bg-muted/50 hover:bg-muted border-border/70 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold mt-0.5">{q.upvotes}</span>
                    </button>

                    {/* Question Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-foreground">
                            {q.authorName}
                          </span>
                          {q.authorUsername && (
                            <span className="text-[10px] font-mono text-muted-foreground">
                              @{q.authorUsername}
                            </span>
                          )}
                          <span className="text-[10px] text-muted-foreground/80">• {q.createdAt}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {q.isPinned && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                              <Pin className="w-2.5 h-2.5" /> Pinned
                            </span>
                          )}
                          {q.isAnswered && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Answered
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-foreground/90 leading-relaxed">{q.text}</p>

                      {/* Organizer Controls */}
                      {isOrganizer && (
                        <div className="flex items-center gap-2 mt-2 pt-1.5 border-t border-border/40 text-[11px]">
                          <button
                            type="button"
                            onClick={() => handleTogglePin(q.id)}
                            className="text-primary hover:underline flex items-center gap-1 cursor-pointer font-medium"
                          >
                            <Pin className="w-3 h-3" />
                            <span>{q.isPinned ? "Unpin" : "Pin to Top"}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleAnswered(q.id)}
                            className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{q.isAnswered ? "Reopen Question" : "Mark as Answered"}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: LIVE POLLS */}
          {activeTab === "polls" && (
            <div className="space-y-4">
              {polls.map((poll) => (
                <div
                  key={poll.id}
                  className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-foreground leading-snug">
                      {poll.question}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                      {poll.totalVotes} total votes
                    </span>
                  </div>

                  <div className="space-y-2">
                    {poll.options.map((opt) => {
                      const percentage =
                        poll.totalVotes > 0
                          ? Math.round((opt.votes / poll.totalVotes) * 100)
                          : 0;
                      const isVoted = poll.myVote === opt.id;

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleVotePoll(poll.id, opt.id)}
                          className={`w-full relative p-2.5 rounded-xl border text-left transition-all overflow-hidden cursor-pointer ${
                            isVoted
                              ? "border-primary bg-primary/10 font-bold"
                              : "border-border/70 hover:border-primary/40 bg-muted/20"
                          }`}
                        >
                          {/* Animated Percentage Fill Bar */}
                          <div
                            className={`absolute left-0 top-0 bottom-0 opacity-15 transition-all duration-700 ${
                              isVoted ? "bg-primary opacity-25" : "bg-foreground"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />

                          <div className="relative flex items-center justify-between text-xs z-10">
                            <span className="text-foreground">{opt.label}</span>
                            <div className="flex items-center gap-2 font-mono text-[11px]">
                              {isVoted && (
                                <span className="text-primary font-bold text-[10px]">✓ Your Vote</span>
                              )}
                              <span className="font-bold text-foreground">{percentage}%</span>
                              <span className="text-muted-foreground text-[10px]">({opt.votes})</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: BACKSTAGE ANNOUNCEMENTS */}
          {activeTab === "announcements" && (
            <div className="space-y-4">
              {/* Organizer Broadcast Form */}
              {isOrganizer && (
                <form
                  onSubmit={handleBroadcastAnnouncement}
                  className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2.5"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300">
                    <Megaphone className="w-3.5 h-3.5" />
                    <span>Broadcast Live Stage Alert to All Attendees</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Refreshments now open in Block 38 Ground Floor..."
                      value={newAnnouncementText}
                      onChange={(e) => setNewAnnouncementText(e.target.value)}
                      className="flex-1 text-xs px-3 py-2 rounded-lg border border-border/80 bg-background text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                    />
                    <Button
                      size="sm"
                      type="submit"
                      disabled={!newAnnouncementText.trim()}
                      className="h-8 px-3 rounded-lg text-xs font-semibold gap-1.5 shrink-0 cursor-pointer shadow-xs"
                    >
                      <Send className="w-3 h-3" />
                      <span>Broadcast</span>
                    </Button>
                  </div>
                </form>
              )}

              {/* Announcements Stream */}
              <div className="space-y-2.5">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="p-3.5 rounded-xl border border-border/70 bg-card shadow-2xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">{ann.author}</span>
                        <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border/60">
                          {ann.role}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {ann.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-foreground/90 leading-relaxed">{ann.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
