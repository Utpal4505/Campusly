"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/AppHeader";
import { ArrowLeft, Send, Sparkles, CheckCheck } from "lucide-react";

interface Message {
  id: string;
  sender: "peer" | "user";
  text: string;
  time: string;
}

export default function MessagePage() {
  const params = useParams();
  const rawSlug = (params?.slug as string) || "rahul-sharma";
  const peerName =
    rawSlug === "rahul-sharma"
      ? "Rahul Sharma"
      : rawSlug === "ananya-singh"
      ? "Ananya Singh"
      : rawSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "peer",
      text: "Hey! What are you building?",
      time: "6:14 PM",
    },
    {
      id: "2",
      sender: "user",
      text: "Looking for a teammate for the AI hackathon.",
      time: "6:15 PM",
    },
    {
      id: "3",
      sender: "peer",
      text: "I'm working on backend and FastAPI agents. Let's connect and sync up before tomorrow.",
      time: "6:16 PM",
    },
  ]);

  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");

    // Simulate natural fast reply
    setTimeout(() => {
      const replyMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "peer",
        text: "Awesome! I'll be in Block 32 around kickoff. Let's grab a table together.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <AppHeader />

      {/* Chat Peer Bar */}
      <div className="border-b border-border/60 bg-muted/30">
        <div className="max-w-xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/people"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to People</span>
            </Link>

            <span className="text-muted-foreground/30">•</span>

            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                  {peerName.charAt(0)}
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 border-2 border-background absolute -bottom-0.5 -right-0.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-foreground leading-tight">
                  {peerName}
                </div>
                <div className="text-[10px] text-emerald-600 font-medium leading-none">
                  Active now
                </div>
              </div>
            </div>
          </div>

          <Link
            href={`/people/${rawSlug}`}
            className="text-[11px] font-semibold text-primary hover:underline"
          >
            Profile
          </Link>
        </div>
      </div>

      {/* Chat Messages Area */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col justify-end">
        <div className="text-center mb-6">
          <span className="text-[11px] font-medium text-muted-foreground bg-muted/60 px-3 py-1 rounded-full">
            Matched via GenAI Hackathon interests
          </span>
        </div>

        <div className="space-y-3 mb-4">
          {messages.map((m) => {
            const isUser = m.sender === "user";
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? "bg-primary text-primary-foreground rounded-br-xs shadow-xs"
                      : "bg-card border border-border/80 text-foreground rounded-bl-xs shadow-2xs"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 px-1">
                  {m.time}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Form Bar */}
      <div className="sticky bottom-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur-md py-3 px-4">
        <form
          onSubmit={handleSend}
          className="max-w-xl mx-auto flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 h-10 px-4 text-xs bg-muted/50 rounded-xl border border-border/70 focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground transition-all"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!inputText.trim()}
            className="h-10 px-4 rounded-xl gap-1.5 font-semibold text-xs shadow-xs"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
      </div>

    </div>
  );
}
