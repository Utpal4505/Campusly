"use client";

import { useState } from "react";
import { getClubAvatarUrl, getClubTheme } from "@/lib/avatars";
import { getClubLogo } from "@/lib/club-assets";

interface ClubAvatarProps {
  clubName: string;
  clubId?: string;
  interests?: (string | { id?: string; name: string })[];
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  customAvatarUrl?: string | null;
}

const SIZE_CLASSES = {
  sm: "w-8 h-8 rounded-lg text-sm",
  md: "w-12 h-12 rounded-2xl text-xl",
  lg: "w-16 h-16 sm:w-20 sm:h-20 rounded-3xl text-3xl sm:text-4xl",
  xl: "w-20 h-20 sm:w-24 sm:h-24 rounded-3xl text-4xl sm:text-5xl",
};

export default function ClubAvatar({
  clubName,
  clubId,
  interests,
  size = "md",
  className = "",
  customAvatarUrl,
}: ClubAvatarProps) {
  const [hasError, setHasError] = useState(false);
  const theme = getClubTheme(clubName, interests);
  const avatarUrl =
    customAvatarUrl || getClubLogo(clubName, clubId) || getClubAvatarUrl(clubName, clubId, interests);

  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  return (
    <div
      className={`relative shrink-0 overflow-hidden flex items-center justify-center border shadow-xs transition-all duration-200 bg-muted/20 ${sizeClass} ${theme.borderClass} ${className}`}
      title={clubName}
    >
      {/* Dynamic ambient backdrop */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${theme.gradientClass} opacity-80 pointer-events-none`}
      />

      {!hasError ? (
        <img
          src={avatarUrl}
          alt={`${clubName} Avatar`}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover relative z-10 transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <span className="relative z-10 select-none animate-in fade-in-50">
          {theme.fallbackEmoji}
        </span>
      )}
    </div>
  );
}
