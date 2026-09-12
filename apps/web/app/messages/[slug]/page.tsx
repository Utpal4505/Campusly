"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/AppHeader";
import { getAnimeAvatar } from "@/lib/avatars";
import { authClient } from "@/lib/auth";
import { useAuth } from "@/lib/auth-context";
import { io, Socket } from "socket.io-client";
import type { ConversationItem, MessageItem } from "@repo/schemas";
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
  Loader2,
  Wifi,
  WifiOff,
} from "lucide-react";

interface DisplayMessage {
  id: string;
  sender: "peer" | "user";
  text: string;
  time: string;
}

interface PeerConversation {
  id?: string;
  slug: string;
  name: string;
  role: string;
  degree: string;
  eventMatch: string;
  lastMessage: string;
  lastTime: string;
  unreadCount?: number;
  isOnline: boolean;
  initialMessages?: DisplayMessage[];
}

const SEED_CONVERSATIONS: PeerConversation[] = [
  {
    slug: "ananya-singh",
    name: "Ananya Singh",
    role: "Lead Product Designer @ Design Guild",
    degree: "Design & CS · 3rd Year",
    eventMatch: "GenAI Hackathon 2026 & DesignSphere LPU",
    lastMessage: "I'm working on backend and FastAPI agents. Let's connect and sync up before tomorrow.",
    lastTime: "6:16 PM",
    isOnline: true,
  },
  {
    slug: "rahul-sharma",
    name: "Rahul Sharma",
    role: "AI & Backend Lead",
    degree: "B.Tech CSE · 2nd Year",
    eventMatch: "GenAI Hackathon 2026 & AI Resume Analyzer",
    lastMessage: "Have you checked the LangGraph multi-agent repo on campus GitHub?",
    lastTime: "5:45 PM",
    isOnline: true,
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
  },
];

export default function MessagePage() {
  const params = useParams();
  const rawSlug = (params?.slug as string) || "ananya-singh";
  const { user } = useAuth();
  const currentUserId = user?.id || "anonymous-student";

  const [conversationsList, setConversationsList] = useState<PeerConversation[]>(SEED_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileList, setShowMobileList] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Active Peer information
  const activeConversation =
    conversationsList.find((c) => c.slug === rawSlug || c.id === rawSlug) ||
    conversationsList[0] ||
    SEED_CONVERSATIONS[0]!;

  // 1. Fetch Conversations List from Backend
  useEffect(() => {
    let isMounted = true;
    authClient
      .getConversations()
      .then((data: ConversationItem[]) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const mapped: PeerConversation[] = data.map((c) => ({
            id: c.id,
            slug: c.peer.id,
            name: c.peer.name,
            role: `${c.peer.department || "Engineering"} Student`,
            degree: `Year ${c.peer.yearOfStudy || 3} · LPU`,
            eventMatch: "Campus Project Synergy",
            lastMessage: c.lastMessage?.content || "Started conversation",
            lastTime: c.lastMessage
              ? new Date(c.lastMessage.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Just now",
            isOnline: true,
          }));

          // Merge with seeds so standard peers remain discoverable
          const existingSlugs = new Set(mapped.map((m) => m.slug));
          const combined = [
            ...mapped,
            ...SEED_CONVERSATIONS.filter((s) => !existingSlugs.has(s.slug)),
          ];
          setConversationsList(combined);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch database conversations:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Initialize or Get Active Conversation & History
  useEffect(() => {
    let isMounted = true;
    setIsLoadingMessages(true);

    // Resolve or create conversation with the peer in PostgreSQL
    authClient
      .createConversation(rawSlug)
      .then(async (conv) => {
        if (!isMounted) return;
        setActiveConvId(conv.id);

        // Fetch message history
        const history = await authClient.getMessages(conv.id);
        if (isMounted) {
          if (Array.isArray(history) && history.length > 0) {
            setMessages(
              history.map((m) => ({
                id: m.id,
                sender: m.senderId === currentUserId ? "user" : "peer",
                text: m.content,
                time: new Date(m.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              }))
            );
          } else {
            // Default initial messages for seed interaction
            setMessages([
              {
                id: "init-1",
                sender: "peer",
                text: `Hey! Great to connect with you on Campusly. What are you currently building?`,
                time: "Just now",
              },
            ]);
          }
        }
      })
      .catch((err) => {
        console.warn("Falling back to local thread:", err);
        if (isMounted) {
          setMessages([
            {
              id: "fallback-1",
              sender: "peer",
              text: `Hey! What are you planning to build for the hackathon?`,
              time: "6:14 PM",
            },
          ]);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingMessages(false);
      });

    return () => {
      isMounted = false;
    };
  }, [rawSlug, currentUserId]);

  // 3. Connect Real-time WebSockets
  useEffect(() => {
    if (!activeConvId || !currentUserId) return;

    const socket = io("http://localhost:4000", {
      query: { userId: currentUserId },
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("join_conversation", {
        conversationId: activeConvId,
        userId: currentUserId,
      });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    // Listen for incoming real-time messages from peer
    socket.on("new_message", (newMsg: any) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [
          ...prev,
          {
            id: newMsg.id,
            sender: newMsg.senderId === currentUserId ? "user" : "peer",
            text: newMsg.content,
            time: new Date(newMsg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ];
      });

      // Update last message in sidebar
      setConversationsList((prev) =>
        prev.map((c) =>
          c.id === activeConvId || c.slug === rawSlug
            ? {
                ...c,
                lastMessage: newMsg.content,
                lastTime: new Date(newMsg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              }
            : c
        )
      );
    });

    return () => {
      socket.emit("leave_conversation", { conversationId: activeConvId });
      socket.disconnect();
    };
  }, [activeConvId, currentUserId, rawSlug]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4. Send Message via WebSockets + HTTP Fallback
  const handleSend = async (textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content) return;

    const tempId = `temp-${Date.now()}`;
    const newMsg: DisplayMessage = {
      id: tempId,
      sender: "user",
      text: content,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInputText("");

    // Update conversation sidebar preview immediately
    setConversationsList((prev) =>
      prev.map((c) =>
        c.id === activeConvId || c.slug === rawSlug
          ? {
              ...c,
              lastMessage: content,
              lastTime: "Just now",
            }
          : c
      )
    );

    // Transmit via WebSocket
    if (activeConvId) {
      if (socketRef.current?.connected) {
        socketRef.current.emit("send_message", {
          conversationId: activeConvId,
          senderId: currentUserId,
          content,
        });
      } else {
        try {
          await authClient.sendMessage(activeConvId, content);
        } catch (err) {
          console.error("HTTP send message error:", err);
        }
      }
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSend(prompt);
  };

  const filteredConversations = conversationsList.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.eventMatch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background text-foreground">
      <AppHeader />

      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-3 sm:py-4 flex flex-col min-h-0">
        
        {/* Unified Studio Workspace Card */}
        <div className="flex-1 rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs flex flex-col md:flex-row min-h-0">
          
          {/* ===================================================================
              LEFT PANE: Conversations Inbox Sidebar (320px)
          =================================================================== */}
          <aside
            className={`
              ${showMobileList ? "flex" : "hidden"} 
              md:flex flex-col w-full md:w-80 lg:w-84 shrink-0 
              border-r border-border/60 bg-muted/20 dark:bg-muted/10 
              overflow-hidden h-full min-h-0
            `}
          >
            {/* Inbox Header & Search */}
            <div className="p-3.5 sm:p-4 border-b border-border/60 space-y-3 shrink-0 bg-card/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-foreground tracking-tight">
                    Inbox Messages
                  </h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {conversationsList.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground"
                    title={isConnected ? "WebSocket Live" : "Reconnecting"}
                  >
                    {isConnected ? (
                      <Wifi className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <WifiOff className="w-3 h-3 text-amber-500" />
                    )}
                    <span className="hidden sm:inline">
                      {isConnected ? "Live" : "Offline"}
                    </span>
                  </span>

                  <Link
                    href="/people"
                    className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                    title="Find more peers"
                  >
                    <span>+ Peers</span>
                  </Link>
                </div>
              </div>

              {/* Search Conversations */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search students, events..."
                  className="w-full h-8 pl-8 pr-3 text-xs rounded-xl bg-card border border-border/70 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Conversation Thread List */}
            <div className="flex-1 overflow-y-auto divide-y divide-border/40 scrollbar-none min-h-0">
              {filteredConversations.map((convo) => {
                const isActive =
                  convo.slug === activeConversation.slug ||
                  (convo.id && convo.id === activeConversation.id);

                return (
                  <Link
                    key={convo.id || convo.slug}
                    href={`/messages/${convo.slug}`}
                    onClick={() => setShowMobileList(false)}
                    className={`p-3.5 flex items-start gap-3 transition-colors block cursor-pointer text-left ${
                      isActive
                        ? "bg-card dark:bg-muted/70 shadow-2xs border-l-3 border-primary"
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
                        <span className={`text-xs font-bold truncate ${isActive ? "text-primary" : "text-foreground"}`}>
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
                        {convo.unreadCount ? (
                          <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center shrink-0">
                            {convo.unreadCount}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </aside>

          {/* ===================================================================
              RIGHT PANE: Active Chat Canvas (Flex-1)
          =================================================================== */}
          <section
            className={`
              ${showMobileList ? "hidden" : "flex"} 
              md:flex flex-1 flex-col bg-background min-w-0 overflow-hidden h-full min-h-0 relative
            `}
          >
            {/* Chat Top Bar */}
            <div className="h-14 sm:h-15 px-4 sm:px-5 border-b border-border/60 flex items-center justify-between gap-3 bg-card/60 backdrop-blur-md shrink-0">
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
                    {activeConversation.degree} ·{" "}
                    <span className="text-emerald-500 font-medium">
                      {isConnected ? "Live Chat Ready" : "Connecting..."}
                    </span>
                  </p>
                </div>
              </div>

              {/* Quick Actions Group */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  onClick={() => setIsInviteModalOpen(true)}
                  className="h-8 px-3 rounded-xl text-xs font-semibold gap-1.5 shadow-xs cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 hidden sm:inline-flex transition-colors"
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
            <div className="px-4 sm:px-5 py-2 bg-muted/30 border-b border-border/60 flex items-center justify-between text-xs text-muted-foreground shrink-0">
              <div className="flex items-center gap-1.5 truncate">
                <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate">
                  Matched via <strong className="text-foreground">{activeConversation.eventMatch}</strong>
                </span>
              </div>
              <span className="text-[10px] text-primary font-semibold shrink-0 hidden sm:inline">
                Real-Time WebSockets Active
              </span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-3 scrollbar-none min-h-0">
              {isLoadingMessages && (
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary mb-2" />
                  <span className="text-xs text-muted-foreground">Loading chat history...</span>
                </div>
              )}

              {/* Day Divider */}
              <div className="text-center my-1.5">
                <span className="text-[10px] font-semibold text-muted-foreground px-3 py-1 rounded-full bg-muted/60 dark:bg-muted/40 border border-border/50">
                  Campus 1-on-1 Chat Session
                </span>
              </div>

              {messages.map((m, idx) => {
                const isUser = m.sender === "user";
                const isLastInCluster =
                  idx === messages.length - 1 || messages[idx + 1]?.sender !== m.sender;

                return (
                  <div
                    key={m.id}
                    className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {/* Peer avatar on left for peer messages */}
                    {!isUser && (
                      <div className="w-7 h-7 rounded-full overflow-hidden border border-border/60 shrink-0 bg-muted/20">
                        <img
                          src={getAnimeAvatar(activeConversation.slug, activeConversation.name)}
                          alt={activeConversation.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Chat Bubble */}
                    <div
                      className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-xs sm:text-[13px] leading-relaxed relative shadow-2xs ${
                        isUser
                          ? "bg-primary text-primary-foreground rounded-br-xs"
                          : "bg-muted/70 dark:bg-muted/50 text-foreground border border-border/60 rounded-bl-xs"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{m.text}</p>
                      
                      <div
                        className={`flex items-center gap-1 mt-1 text-[10px] ${
                          isUser ? "text-primary-foreground/75 justify-end" : "text-muted-foreground justify-start"
                        }`}
                      >
                        <span>{m.time}</span>
                        {isUser && isLastInCluster && (
                          <CheckCheck className="w-3 h-3 text-primary-foreground" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Context Prompts */}
            <div className="px-4 sm:px-5 py-2 bg-card/40 border-t border-border/50 shrink-0 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <span className="text-[10px] font-bold text-muted-foreground uppercase shrink-0 mr-1 hidden sm:inline">
                Prompts:
              </span>
              {[
                "Hey, want to team up for the Hackathon?",
                "Are you free to sync on project architecture?",
                "What tech stack are you thinking?",
                "Let's meet at Student Center Hall B!",
              ].map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => handleQuickPrompt(prompt)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-muted/60 hover:bg-primary/10 hover:text-primary hover:border-primary/30 border border-border/60 text-muted-foreground transition-all shrink-0 cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Message Input Bottom Bar */}
            <div className="p-3 sm:p-4 border-t border-border/60 bg-card/80 backdrop-blur-md shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <div className="flex-1 relative flex items-center">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Message ${activeConversation.name}...`}
                    className="w-full h-10 pl-4 pr-10 rounded-xl bg-background border border-border/80 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors shadow-2xs"
                  />
                  <button
                    type="button"
                    className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors p-1"
                    title="Insert emoji"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="h-10 px-4 rounded-xl text-xs font-semibold gap-1.5 shadow-xs bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 cursor-pointer shrink-0 transition-transform active:scale-95"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </form>
            </div>
          </section>

        </div>
      </main>

      {/* Team Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4 animate-in fade-in-0 zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  Invite {activeConversation.name} to Squad
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Send an instant collaboration invitation for upcoming campus hackathons and projects.
            </p>

            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-2">
              <span className="font-semibold text-foreground block">Target Project / Event:</span>
              <span className="text-primary font-bold block">{activeConversation.eventMatch}</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsInviteModalOpen(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  handleSend(`Hey ${activeConversation.name}! I'd love to invite you to join our hackathon squad for ${activeConversation.eventMatch}. Let's team up!`);
                  setIsInviteModalOpen(false);
                }}
                className="rounded-xl text-xs font-semibold bg-primary text-primary-foreground"
              >
                Send Squad Invite
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
