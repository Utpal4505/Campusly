"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/AppHeader";
import { getAnimeAvatar } from "@/lib/avatars";
import {
  ArrowLeft,
  Send,
  Sparkles,
  CheckCheck,
  Search,
  Zap,
  ExternalLink,
  ShieldCheck,
  Smile,
  X,
} from "lucide-react";

interface Message {
  id: string;
  sender: "peer" | "user";
  text: string;
  time: string;
}

interface PeerConversation {
  slug: string;
  name: string;
  role: string;
  degree: string;
  eventMatch: string;
  lastMessage: string;
  lastTime: string;
  unreadCount?: number;
  isOnline: boolean;
  initialMessages: Message[];
}

const CONVERSATIONS: PeerConversation[] = [
  {
    slug: "ananya-singh",
    name: "Ananya Singh",
    role: "Lead Product Designer @ Design Guild",
    degree: "Design & CS · 3rd Year",
    eventMatch: "GenAI Hackathon 2026 & DesignSphere LPU",
    lastMessage: "I'm working on backend and FastAPI agents. Let's connect and sync up before tomorrow.",
    lastTime: "6:16 PM",
    isOnline: true,
    initialMessages: [
      {
        id: "1",
        sender: "peer",
        text: "Hey! Saw you're registered for the GenAI Hackathon. What are you planning to build?",
        time: "6:14 PM",
      },
      {
        id: "2",
        sender: "user",
        text: "Looking for a design engineer peer for an autonomous developer tool squad.",
        time: "6:15 PM",
      },
      {
        id: "3",
        sender: "peer",
        text: "I'm working on backend and FastAPI agents. Let's connect and sync up before tomorrow.",
        time: "6:16 PM",
      },
    ],
  },
  {
    slug: "rahul-sharma",
    name: "Rahul Sharma",
    role: "AI & Backend Lead",
    degree: "B.Tech CSE · 2nd Year",
    eventMatch: "GenAI Hackathon 2026 & AI Resume Analyzer",
    lastMessage: "Have you checked the LangGraph multi-agent repo on campus GitHub?",
    lastTime: "5:45 PM",
    unreadCount: 1,
    isOnline: true,
    initialMessages: [
      {
        id: "1",
        sender: "peer",
        text: "Hey Utpal! Are you free to sync on the AI Resume Analyzer frontend?",
        time: "5:30 PM",
      },
      {
        id: "2",
        sender: "user",
        text: "Yes, I just reviewed the API spec you pushed this morning.",
        time: "5:38 PM",
      },
      {
        id: "3",
        sender: "peer",
        text: "Have you checked the LangGraph multi-agent repo on campus GitHub?",
        time: "5:45 PM",
      },
    ],
  },
  {
    slug: "dev-kapoor",
    name: "Dev Kapoor",
    role: "Full Stack & Systems Lead",
    degree: "Software Engineering · 2nd Year",
    eventMatch: "InnovateX 48h Campus Sprint",
    lastMessage: "Deployed v1.4 of the campus timetable PWA with offline sync.",
    lastTime: "Yesterday",
    isOnline: false,
    initialMessages: [
      {
        id: "1",
        sender: "peer",
        text: "Hey! We're forming a team for InnovateX at Shanti Devi Mittal Auditorium.",
        time: "Yesterday",
      },
      {
        id: "2",
        sender: "user",
        text: "Sounds great! What track are you targeting?",
        time: "Yesterday",
      },
      {
        id: "3",
        sender: "peer",
        text: "Deployed v1.4 of the campus timetable PWA with offline sync.",
        time: "Yesterday",
      },
    ],
  },
  {
    slug: "priya-verma",
    name: "Priya Verma",
    role: "President @ AI & Robotics Society",
    degree: "Data Science & AI · 3rd Year",
    eventMatch: "RoboQuest 2026 & AI Society Lab",
    lastMessage: "Thursday lab night starts at 6:00 PM in CS Hall 3.",
    lastTime: "2d ago",
    isOnline: true,
    initialMessages: [
      {
        id: "1",
        sender: "peer",
        text: "Welcome to AI & Robotics Society! Let me know if you need GPU cluster credentials.",
        time: "2d ago",
      },
      {
        id: "2",
        sender: "user",
        text: "Thanks Priya! Looking forward to the autonomous rover challenge.",
        time: "2d ago",
      },
      {
        id: "3",
        sender: "peer",
        text: "Thursday lab night starts at 6:00 PM in CS Hall 3.",
        time: "2d ago",
      },
    ],
  },
];

export default function MessagePage() {
  const params = useParams();
  const rawSlug = (params?.slug as string) || "ananya-singh";

  const activeConversation =
    CONVERSATIONS.find((c) => c.slug === rawSlug) || CONVERSATIONS[0]!;

  const [messages, setMessages] = useState<Message[]>(activeConversation.initialMessages);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileList, setShowMobileList] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync messages when slug changes
  useEffect(() => {
    const convo = CONVERSATIONS.find((c) => c.slug === rawSlug) || CONVERSATIONS[0]!;
    setMessages(convo.initialMessages);
  }, [rawSlug]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: content,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInputText("");

    // Simulate intelligent peer reply
    setTimeout(() => {
      const replies = [
        "Sounds awesome! Let's definitely coordinate on that.",
        "Got it! I'll reserve a workspace table in Block 32 for our squad.",
        "Perfect. I'll push the latest Figma wireframes and API endpoints now.",
        "Great! Let's connect at kickoff. Catch you in a bit!",
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)]!;
      const replyMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "peer",
        text: randomReply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 850);
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSend(prompt);
  };

  const filteredConversations = CONVERSATIONS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.eventMatch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background text-foreground">
      {/* Top Navbar */}
      <AppHeader />

      {/* ===================================================================
          IMMERSIVE WORKSPACE CONTAINER (Docked Full Height Below Navbar)
      =================================================================== */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        
        {/* ===================================================================
            LEFT PANE: Conversations Inbox Sidebar (320px - 350px)
        =================================================================== */}
        <aside
          className={`
            ${showMobileList ? "flex" : "hidden"} 
            md:flex flex-col w-full md:w-80 lg:w-88 shrink-0 
            border-r border-border/60 bg-muted/20 dark:bg-muted/10 
            overflow-hidden h-full
          `}
        >
          {/* Inbox Header & Search */}
          <div className="p-3.5 sm:p-4 border-b border-border/60 space-y-3 shrink-0 bg-card/40 backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-foreground tracking-tight">
                  Inbox Messages
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  {CONVERSATIONS.length}
                </span>
              </div>

              <Link
                href="/people"
                className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                title="Find more peers"
              >
                <span>+ Find Peers</span>
              </Link>
            </div>

            {/* Search Conversations */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students, events..."
                className="w-full h-8 pl-8 pr-3 text-xs rounded-xl bg-card border border-border/70 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          {/* Conversation Thread List */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/40 scrollbar-none">
            {filteredConversations.map((convo) => {
              const isActive = convo.slug === activeConversation.slug;
              return (
                <Link
                  key={convo.slug}
                  href={`/messages/${convo.slug}`}
                  onClick={() => setShowMobileList(false)}
                  className={`p-3.5 flex items-start gap-3 transition-colors block cursor-pointer text-left ${
                    isActive
                      ? "bg-card dark:bg-muted/80 shadow-2xs border-l-3 border-blue-600"
                      : "hover:bg-card/70 dark:hover:bg-muted/40"
                  }`}
                >
                  {/* Anime Avatar + Online indicator */}
                  <div className="relative shrink-0 mt-0.5">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-border/80 bg-muted/20">
                      <img
                        src={getAnimeAvatar(convo.slug, convo.name)}
                        alt={convo.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {convo.isOnline && (
                      <span
                        className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card"
                        title="Online on campus"
                      />
                    )}
                  </div>

                  {/* Meta Preview */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className={`text-xs font-bold truncate ${isActive ? "text-blue-600 dark:text-blue-400" : "text-foreground"}`}>
                        {convo.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {convo.lastTime}
                      </span>
                    </div>

                    <p className="text-[11px] text-muted-foreground truncate mb-1">
                      {convo.role}
                    </p>

                    <div className="flex items-center justify-between gap-1">
                      <p className="text-[11px] text-foreground/80 dark:text-muted-foreground truncate leading-tight">
                        {convo.lastMessage}
                      </p>
                      {convo.unreadCount && (
                        <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                          {convo.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </aside>

        {/* ===================================================================
            RIGHT PANE: Active Chat Canvas (Flex-1, Docked Viewport)
        =================================================================== */}
        <main
          className={`
            ${showMobileList ? "hidden" : "flex"} 
            md:flex flex-1 flex-col bg-background min-w-0 overflow-hidden h-full relative
          `}
        >
          {/* Chat Top Bar */}
          <div className="h-14 sm:h-16 px-4 sm:px-6 border-b border-border/60 flex items-center justify-between gap-3 bg-card/50 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setShowMobileList(true)}
                className="md:hidden p-1.5 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                title="Back to inbox"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="relative shrink-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-border/80 bg-muted/20">
                  <img
                    src={getAnimeAvatar(activeConversation.slug, activeConversation.name)}
                    alt={activeConversation.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {activeConversation.isOnline && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-background absolute -bottom-0.5 -right-0.5" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-foreground truncate">
                    {activeConversation.name}
                  </h3>
                  <span title="Verified Campus Student">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  {activeConversation.degree} · <span className="text-emerald-500 font-medium">Active now</span>
                </p>
              </div>
            </div>

            {/* Quick Actions Group */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                onClick={() => setIsInviteModalOpen(true)}
                className="h-8 px-3 rounded-xl text-xs font-semibold gap-1.5 shadow-xs cursor-pointer bg-blue-600 hover:bg-blue-700 text-white hidden sm:inline-flex transition-colors"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Invite to Squad</span>
              </Button>

              <Link href={`/people/${activeConversation.slug}`}>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-3 rounded-xl text-xs font-medium gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <span>Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Context Match Callout Strip */}
          <div className="px-4 sm:px-6 py-2 bg-blue-50/70 dark:bg-blue-950/25 border-b border-blue-100/80 dark:border-blue-900/30 flex items-center justify-between text-xs text-muted-foreground shrink-0">
            <div className="max-w-3xl mx-auto w-full flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 truncate">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="truncate">
                  Matched via <strong className="text-foreground">{activeConversation.eventMatch}</strong>
                </span>
              </div>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold shrink-0 hidden sm:inline">
                Campus Synergy · 94% Match
              </span>
            </div>
          </div>

          {/* Messages Scroll Area (Centered with max-w-3xl for optimal line length) */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3 scrollbar-none">
            <div className="max-w-3xl mx-auto w-full space-y-3">
              {/* Day Divider */}
              <div className="text-center my-2">
                <span className="text-[10px] font-semibold text-muted-foreground px-3 py-1 rounded-full bg-muted/60 dark:bg-muted/40 border border-border/50">
                  Today · Direct Campus Chat
                </span>
              </div>

              {messages.map((m, idx) => {
                const isUser = m.sender === "user";
                const isLastInCluster =
                  idx === messages.length - 1 || messages[idx + 1]?.sender !== m.sender;

                return (
                  <div
                    key={m.id}
                    className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Peer avatar only shown on the last message in a cluster */}
                    {!isUser && (
                      isLastInCluster ? (
                        <div className="w-7 h-7 rounded-full overflow-hidden border border-border/70 shrink-0 mb-1 bg-muted/20">
                          <img
                            src={getAnimeAvatar(activeConversation.slug, activeConversation.name)}
                            alt={activeConversation.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-7 shrink-0" />
                      )
                    )}

                    <div className={`max-w-[85%] sm:max-w-[72%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                          isUser
                            ? "bg-blue-600 dark:bg-blue-600 text-white rounded-br-xs shadow-xs font-normal"
                            : "bg-slate-100/95 dark:bg-muted/50 border border-slate-200/80 dark:border-border/60 text-foreground rounded-bl-xs"
                        }`}
                      >
                        {m.text}
                      </div>

                      <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground px-1">
                        <span>{m.time}</span>
                        {isUser && <CheckCheck className="w-3.5 h-3.5 text-blue-400 dark:text-blue-400" />}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Icebreaker Quick Chips */}
          <div className="px-4 sm:px-6 py-2 border-t border-border/60 bg-muted/15 shrink-0">
            <div className="max-w-3xl mx-auto w-full flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                <span>Quick:</span>
              </span>
              {[
                "Hey! Want to team up for GenAI Hackathon?",
                "What's your preferred tech stack?",
                "Let's sync up at Block 32 kickoff.",
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleQuickPrompt(chip)}
                  className="px-3 py-1.5 rounded-full bg-card hover:bg-muted text-[11px] text-foreground font-medium border border-border/70 hover:border-blue-500/40 hover:text-blue-600 dark:hover:text-blue-400 shadow-2xs transition-colors shrink-0 cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Docked Input Form Bar */}
          <div className="p-3 sm:p-4 border-t border-border/60 bg-card/60 backdrop-blur-xs shrink-0">
            <div className="max-w-3xl mx-auto w-full">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2.5">
                <div className="flex-1 relative flex items-center">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Message ${activeConversation.name}... (Press Enter)`}
                    className="w-full h-11 pl-4 pr-11 text-xs sm:text-sm bg-muted/40 rounded-xl border border-border/70 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setInputText((prev) => prev + " 🚀")}
                    className="absolute right-3 p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Add emoji"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="h-11 px-5 rounded-xl gap-2 font-semibold text-xs sm:text-sm shadow-xs cursor-pointer bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 transition-all shrink-0"
                >
                  <span className="hidden sm:inline">Send</span>
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </form>
            </div>
          </div>
        </main>
      </div>

      {/* Quick Squad Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-border/80 bg-card text-foreground shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl border border-blue-500/25 overflow-hidden shrink-0 bg-muted/20">
                  <img
                    src={getAnimeAvatar(activeConversation.slug, activeConversation.name)}
                    alt={activeConversation.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-tight">
                    Invite {activeConversation.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Send an instant hackathon squad invitation.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-foreground mb-1 block">
                  Select Event
                </label>
                <select className="w-full h-9 px-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-blue-500/60 text-foreground">
                  <option>GenAI Hackathon 2026 (Oct 18)</option>
                  <option>InnovateX 48h Campus Sprint (Oct 25)</option>
                  <option>RoboQuest 2026 (Nov 02)</option>
                  <option>DesignSphere LPU (Nov 08)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-foreground mb-1 block">
                  Role Offered
                </label>
                <input
                  type="text"
                  defaultValue="Design & Frontend Lead"
                  className="w-full h-9 px-3 text-xs bg-muted/40 rounded-xl border border-border/70 focus:outline-none focus:border-blue-500/60 text-foreground"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="rounded-xl text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    handleSend(`⚡ Hey ${activeConversation.name}! I just sent you an official squad invitation for the GenAI Hackathon 2026! Let's team up.`);
                    setIsInviteModalOpen(false);
                  }}
                  className="rounded-xl px-4 text-xs font-bold shadow-xs gap-1.5 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Confirm Invitation</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
