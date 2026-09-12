/**
 * Anime illustrated avatar helper utilizing Dicebear Lorelei (Anime/Manga style).
 * Provides consistent, high-contrast illustrated avatars for students and club leadership.
 */

export const ANIME_AVATARS: Record<string, string> = {
  "rahul-sharma": "https://api.dicebear.com/9.x/lorelei/svg?seed=Rahul&backgroundColor=b6e3f4,c0aede,d1d4f9",
  "ananya-singh": "https://api.dicebear.com/9.x/lorelei/svg?seed=Ananya&backgroundColor=ffd5dc,ffdfbf",
  "dev-kapoor": "https://api.dicebear.com/9.x/lorelei/svg?seed=Dev&backgroundColor=d1d4f9,c0aede",
  "priya-verma": "https://api.dicebear.com/9.x/lorelei/svg?seed=Priya&backgroundColor=ffdfbf,ffd5dc",
};

export function getAnimeAvatar(slugOrName?: string, fallbackSeed?: string): string {
  if (!slugOrName) {
    return "https://api.dicebear.com/9.x/lorelei/svg?seed=CampusStudent&backgroundColor=c0aede";
  }
  const key = slugOrName.toLowerCase().trim().replace(/\s+/g, "-");
  if (ANIME_AVATARS[key]) {
    return ANIME_AVATARS[key];
  }
  const seed = fallbackSeed || slugOrName;
  return `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
}

export interface ClubTheme {
  domain: string;
  avatarStyle: "shapes" | "bottts";
  bgColors: string;
  gradientClass: string;
  borderClass: string;
  accentTextClass: string;
  fallbackEmoji: string;
}

export function getClubTheme(
  name: string,
  tags?: (string | { id?: string; name: string })[]
): ClubTheme {
  const lowerName = name.toLowerCase();
  const tagList = (tags || [])
    .map((t) => (typeof t === "string" ? t.toLowerCase() : (t?.name || "").toLowerCase()))
    .join(" ");
  const combined = `${lowerName} ${tagList}`;

  // 1. AI & Robotics (explicit word boundaries to avoid matching 'blockchain')
  if (
    /\b(ai|robot|robotics|ml|machine learning|neural|vision|deep learning|agentic)\b/i.test(
      combined
    ) &&
    !combined.includes("blockchain")
  ) {
    return {
      domain: "Tech & AI",
      avatarStyle: "bottts",
      bgColors: "1e1b4b,312e81,4338ca",
      gradientClass: "from-purple-500/20 via-indigo-500/10 to-transparent",
      borderClass: "border-purple-500/30 group-hover:border-purple-500/60",
      accentTextClass: "text-purple-400",
      fallbackEmoji: "🤖",
    };
  }

  // 2. Blockchain & Web3 & FinTech
  if (
    /\b(blockchain|web3|crypto|fintech|defi|ethereum|solidity|bitcoin|finance|investing)\b/i.test(
      combined
    )
  ) {
    return {
      domain: "Blockchain & FinTech",
      avatarStyle: "shapes",
      bgColors: "064e3b,0f766e,0d9488",
      gradientClass: "from-emerald-500/20 via-teal-500/10 to-transparent",
      borderClass: "border-emerald-500/30 group-hover:border-emerald-500/60",
      accentTextClass: "text-emerald-400",
      fallbackEmoji: "⚡",
    };
  }

  // 3. Design & Creative & UI/UX
  if (
    /\b(design|ui|ux|creative|figma|product design|art|visual|graphics)\b/i.test(combined)
  ) {
    return {
      domain: "Design & Creative",
      avatarStyle: "shapes",
      bgColors: "831843,be185d,db2777",
      gradientClass: "from-rose-500/20 via-pink-500/10 to-transparent",
      borderClass: "border-rose-500/30 group-hover:border-rose-500/60",
      accentTextClass: "text-rose-400",
      fallbackEmoji: "🎨",
    };
  }

  // 4. Startups & E-Cell & Entrepreneurship
  if (
    /\b(startup|startups|ecell|e-cell|entrepreneur|venture|pitch|founder|incubator)\b/i.test(
      combined
    )
  ) {
    return {
      domain: "Startups & E-Cell",
      avatarStyle: "shapes",
      bgColors: "7c2d12,c2410c,ea580c",
      gradientClass: "from-amber-500/20 via-orange-500/10 to-transparent",
      borderClass: "border-amber-500/30 group-hover:border-amber-500/60",
      accentTextClass: "text-amber-400",
      fallbackEmoji: "🚀",
    };
  }

  // 5. Cybersecurity & Systems
  if (
    /\b(cyber|security|hack|infosec|ctf|penetration|firewall|defense)\b/i.test(combined)
  ) {
    return {
      domain: "Security & Systems",
      avatarStyle: "bottts",
      bgColors: "450a0a,7f1d1d,991b1b",
      gradientClass: "from-red-500/20 via-rose-500/10 to-transparent",
      borderClass: "border-red-500/30 group-hover:border-red-500/60",
      accentTextClass: "text-red-400",
      fallbackEmoji: "🛡️",
    };
  }

  // 6. Coding, Competitive Programming & GDSC
  if (
    /\b(code|coding|developer|gdsc|algo|algorithmic|icpc|leetcode|programming|software)\b/i.test(
      combined
    )
  ) {
    return {
      domain: "Software & Coding",
      avatarStyle: "shapes",
      bgColors: "1e3a8a,1d4ed8,2563eb",
      gradientClass: "from-blue-500/20 via-indigo-500/10 to-transparent",
      borderClass: "border-blue-500/30 group-hover:border-blue-500/60",
      accentTextClass: "text-blue-400",
      fallbackEmoji: "💻",
    };
  }

  // 7. Mobile App Developers
  if (/\b(mobile|android|ios|flutter|swift|react native|app)\b/i.test(combined)) {
    return {
      domain: "App Development",
      avatarStyle: "shapes",
      bgColors: "0c4a6e,0284c7,38bdf8",
      gradientClass: "from-sky-500/20 via-blue-500/10 to-transparent",
      borderClass: "border-sky-500/30 group-hover:border-sky-500/60",
      accentTextClass: "text-sky-400",
      fallbackEmoji: "📱",
    };
  }

  // 8. Gaming & Esports
  if (/\b(game|gaming|esport|esports|unity|unreal|gamer)\b/i.test(combined)) {
    return {
      domain: "Gaming & Esports",
      avatarStyle: "bottts",
      bgColors: "581c87,9333ea,c026d3",
      gradientClass: "from-fuchsia-500/20 via-purple-500/10 to-transparent",
      borderClass: "border-fuchsia-500/30 group-hover:border-fuchsia-500/60",
      accentTextClass: "text-fuchsia-400",
      fallbackEmoji: "🎮",
    };
  }

  // 9. Music & Audio
  if (/\b(music|sound|audio|band|acoustic|singer|vocal|concert)\b/i.test(combined)) {
    return {
      domain: "Music & Audio",
      avatarStyle: "shapes",
      bgColors: "701a75,c026d3,e879f9",
      gradientClass: "from-pink-500/20 via-purple-500/10 to-transparent",
      borderClass: "border-pink-500/30 group-hover:border-pink-500/60",
      accentTextClass: "text-pink-400",
      fallbackEmoji: "🎵",
    };
  }

  // 10. Photography & Media
  if (
    /\b(photo|photography|film|video|cinema|shutter|camera|media)\b/i.test(combined)
  ) {
    return {
      domain: "Media & Culture",
      avatarStyle: "shapes",
      bgColors: "292524,44403c,d97706",
      gradientClass: "from-amber-500/20 via-stone-500/10 to-transparent",
      borderClass: "border-amber-500/30 group-hover:border-amber-500/60",
      accentTextClass: "text-amber-400",
      fallbackEmoji: "📸",
    };
  }

  // 11. Athletics & Sports
  if (
    /\b(athletic|athletics|cricket|football|sports|fitness|health|badminton|soccer)\b/i.test(
      combined
    )
  ) {
    return {
      domain: "Athletics & Sports",
      avatarStyle: "shapes",
      bgColors: "14532d,15803d,16a34a",
      gradientClass: "from-emerald-500/20 via-green-500/10 to-transparent",
      borderClass: "border-emerald-500/30 group-hover:border-emerald-500/60",
      accentTextClass: "text-emerald-400",
      fallbackEmoji: "🏆",
    };
  }

  // 12. Quantum Computing
  if (/\b(quantum)\b/i.test(combined)) {
    return {
      domain: "Quantum Computing",
      avatarStyle: "shapes",
      bgColors: "164e63,0891b2,7c3aed",
      gradientClass: "from-cyan-500/20 via-violet-500/10 to-transparent",
      borderClass: "border-cyan-500/30 group-hover:border-cyan-500/60",
      accentTextClass: "text-cyan-400",
      fallbackEmoji: "⚛️",
    };
  }

  // Fallback / Campus Society
  return {
    domain: "Campus Society",
    avatarStyle: "shapes",
    bgColors: "1e293b,334155,475569",
    gradientClass: "from-purple-500/15 via-muted/30 to-transparent",
    borderClass: "border-border/80 group-hover:border-primary/40",
    accentTextClass: "text-purple-400",
    fallbackEmoji: "🏛️",
  };
}

export function getClubAvatarUrl(
  name: string,
  id?: string,
  tags?: (string | { id?: string; name: string })[]
): string {
  const theme = getClubTheme(name, tags);
  const cleanSeed = encodeURIComponent(
    (name || id || "campus-club").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-")
  );
  return `https://api.dicebear.com/9.x/${theme.avatarStyle}/svg?seed=${cleanSeed}&backgroundColor=${theme.bgColors}`;
}

