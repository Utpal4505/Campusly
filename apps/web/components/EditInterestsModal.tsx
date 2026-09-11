"use client";

import { useCampusStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { X, Check, Sparkles } from "lucide-react";

const ALL_INTERESTS = [
  { id: "AI", label: "AI & Machine Learning", emoji: "🤖" },
  { id: "Web Dev", label: "Web Development", emoji: "💻" },
  { id: "Startups", label: "Startups & VC", emoji: "🚀" },
  { id: "Design", label: "Design & UI/UX", emoji: "🎨" },
  { id: "Cybersecurity", label: "Cybersecurity", emoji: "🔐" },
  { id: "Mobile Dev", label: "Mobile Apps", emoji: "📱" },
  { id: "Hardware", label: "Hardware & IoT", emoji: "⚡" },
  { id: "Business", label: "Business & Finance", emoji: "📊" },
  { id: "Sports", label: "Sports & Fitness", emoji: "🏏" },
  { id: "Game Dev", label: "Game Development", emoji: "🎮" },
  { id: "Research", label: "Academic Research", emoji: "🧪" },
  { id: "Open Source", label: "Open Source", emoji: "🌐" },
];

export default function EditInterestsModal() {
  const { isEditInterestsOpen, setEditInterestsOpen, interests, toggleInterest } =
    useCampusStore();

  if (!isEditInterestsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-border/80 bg-card text-foreground shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-4">
          <div>
            <h2 className="text-base font-bold tracking-tight">Edit Your Interests</h2>
            <p className="text-[11px] text-muted-foreground">Campusly tailors your feed based on these tags</p>
          </div>

          <button
            type="button"
            onClick={() => setEditInterestsOpen(false)}
            className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Interests Grid */}
        <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1 mb-5">
          {ALL_INTERESTS.map((item) => {
            const isSelected = interests.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleInterest(item.id)}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/[0.06] shadow-2xs font-semibold text-foreground ring-1 ring-primary/20"
                    : "border-border/60 bg-card hover:border-border text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-2 text-xs">
                  <span>{item.emoji}</span>
                  <span className="truncate">{item.label}</span>
                </div>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-primary shrink-0 stroke-[2.5]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-border/50 flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">
            {interests.length} selected
          </span>

          <Button
            size="sm"
            onClick={() => setEditInterestsOpen(false)}
            className="rounded-xl px-5 text-xs font-semibold shadow-xs"
          >
            Save Preferences
          </Button>
        </div>

      </div>
    </div>
  );
}
