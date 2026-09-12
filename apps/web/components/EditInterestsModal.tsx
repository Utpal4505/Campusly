"use client";

import { useState, useEffect } from "react";
import { useCampusStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth";
import { getInterestEmoji } from "@/lib/interests";
import { X, Check, Loader2, AlertCircle } from "lucide-react";

// In-memory module cache so subsequent modal opens are instantaneous (0ms)
let cachedInterestsWithEmoji: Array<{ id: string; name: string; emoji: string }> = [];

export default function EditInterestsModal() {
  const {
    isEditInterestsOpen,
    setEditInterestsOpen,
    setSelectedInterests,
  } = useCampusStore();

  const [availableInterests, setAvailableInterests] = useState<
    Array<{ id: string; name: string; emoji: string }>
  >(cachedInterestsWithEmoji);
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(cachedInterestsWithEmoji.length === 0);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // When modal is opened, fetch real interests and user's saved preferences
  useEffect(() => {
    if (!isEditInterestsOpen) return;

    let isMounted = true;

    // Read current store state snapshot
    const currentStore = useCampusStore.getState();
    const currentStoreIds = currentStore.interestIds || [];
    const currentStoreNames = currentStore.interests || [];

    // If cached in memory, display immediately with zero lag
    if (cachedInterestsWithEmoji.length > 0) {
      setAvailableInterests(cachedInterestsWithEmoji);
      setIsLoading(false);

      if (currentStoreIds.length > 0) {
        setLocalSelectedIds(currentStoreIds);
      } else {
        const matched = cachedInterestsWithEmoji
          .filter((i) => currentStoreNames.includes(i.name))
          .map((i) => i.id);
        setLocalSelectedIds(matched);
      }
    } else {
      setIsLoading(true);
    }

    setError(null);

    Promise.all([
      authClient.getInterests().catch(() => []),
      authClient.getMe().catch(() => null),
    ]).then(([interestsList, profile]) => {
      if (!isMounted) return;

      if (interestsList && interestsList.length > 0) {
        cachedInterestsWithEmoji = interestsList.map((item) => ({
          id: item.id,
          name: item.name,
          emoji: getInterestEmoji(item.name),
        }));
        setAvailableInterests(cachedInterestsWithEmoji);
      }

      // Initialize selected items from user profile or store snapshot
      if (profile?.interests && profile.interests.length > 0) {
        setLocalSelectedIds(profile.interests.map((i) => i.id));
      } else if (currentStoreIds.length > 0) {
        setLocalSelectedIds(currentStoreIds);
      } else if (cachedInterestsWithEmoji.length > 0) {
        const matched = cachedInterestsWithEmoji
          .filter((i) => currentStoreNames.includes(i.name))
          .map((i) => i.id);
        setLocalSelectedIds(matched);
      }

      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [isEditInterestsOpen]);

  if (!isEditInterestsOpen) return null;

  const toggleInterest = (id: string) => {
    setLocalSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSavePreferences = async () => {
    if (localSelectedIds.length === 0) {
      setError("Please select at least 1 interest tag.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Call PATCH /users/me/preferences
      const result = await authClient.updatePreferences(localSelectedIds);

      // Update local store with newly saved items
      if (result.interests && result.interests.length > 0) {
        setSelectedInterests(result.interests);
      } else {
        const chosen = availableInterests
          .filter((item) => localSelectedIds.includes(item.id))
          .map((item) => ({ id: item.id, name: item.name }));
        setSelectedInterests(chosen);
      }

      // Close modal
      setEditInterestsOpen(false);

      // Notify feed to refresh
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("campusly:preferences-updated"));
      }
    } catch (err: any) {
      setError(
        err?.message || "Failed to save preferences. Please check your connection."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-border/80 bg-card text-foreground shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-4">
          <div>
            <h2 className="text-base font-bold tracking-tight">Edit Your Interests</h2>
            <p className="text-[11px] text-muted-foreground">
              Campusly tailors your feed based on these tags
            </p>
          </div>

          <button
            type="button"
            onClick={() => setEditInterestsOpen(false)}
            className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/25 text-destructive text-xs font-medium flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Interests Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-xs">Loading campus interest tags...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1 mb-5">
            {availableInterests.map((item) => {
              const isSelected = localSelectedIds.includes(item.id);
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
                  <div className="flex items-center gap-2 text-xs min-w-0 pr-1">
                    <span className="shrink-0">{item.emoji}</span>
                    <span className="truncate">{item.name}</span>
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-primary shrink-0 stroke-[2.5]" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-border/50 flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">
            {localSelectedIds.length} selected
          </span>

          <Button
            size="sm"
            disabled={isSaving || isLoading}
            onClick={handleSavePreferences}
            className="rounded-xl px-5 text-xs font-semibold shadow-xs cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Preferences</span>
            )}
          </Button>
        </div>

      </div>
    </div>
  );
}
