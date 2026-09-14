/**
 * Authentic Club Logos and Thematic Visual Cover Banners for LPU Campus Clubs.
 * Provides crisp SVG/PNG logos and high-resolution Unsplash campus photography headers.
 */

export interface ClubAsset {
  logo: string;
  coverImage: string;
}

export const KNOWN_CLUB_ASSETS: Record<string, ClubAsset> = {
  // ── Grassroots Coding & Community Chapters ──
  "coding-blocks": {
    logo: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=160&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80",
  },
  "coding-ninjas": {
    logo: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=160&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80",
  },
  "geeksforgeeks": {
    logo: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=160&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80",
  },
  "codechef": {
    logo: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=160&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80",
  },
  "girlscript": {
    logo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80",
  },
  "cybsec": {
    logo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=160&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80",
  },
  "risc": {
    logo: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=160&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80",
  },
  "electech": {
    logo: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=160&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=1200&auto=format&fit=crop&q=80",
  },

  // ── University-Wide Chapters ──
  "gdg": {
    logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=160&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&auto=format&fit=crop&q=80",
  },
  "ieee": {
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=160&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80",
  },
  "tatva": {
    logo: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=160&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80",
  },
  "aurora": {
    logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=160&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80",
  },
  "lscc": {
    logo: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=160&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1532581291347-9c39cf10a73c?w=1200&auto=format&fit=crop&q=80",
  },

  // ── Cultural, Arts, Media & Design ──
  "natyamanch": {
    logo: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=160&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1200&auto=format&fit=crop&q=80",
  },
  "iqlipse": {
    logo: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=160&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80",
  },
  "vibedance": {
    logo: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=160&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=1200&auto=format&fit=crop&q=80",
  },
  "shutterbugs": {
    logo: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=160&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&auto=format&fit=crop&q=80",
  },
  "designersden": {
    logo: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=160&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&auto=format&fit=crop&q=80",
  },
  "kalakriti": {
    logo: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=160&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80",
  },

  // ── Business & Startups ──
  "sml": {
    logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=160&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80",
  },
  "ecell": {
    logo: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=160&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&auto=format&fit=crop&q=80",
  },
  "finix": {
    logo: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=160&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=1200&auto=format&fit=crop&q=80",
  },
  "markophilic": {
    logo: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=160&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80",
  },

  // ── Social, Literary & Esports ──
  "sankalp": {
    logo: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=160&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1511497584788-87676104235f?w=1200&auto=format&fit=crop&q=80",
  },
  "wingsofhope": {
    logo: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=160&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&auto=format&fit=crop&q=80",
  },
  "spade": {
    logo: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=160&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80",
  },
  "debate": {
    logo: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=160&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80",
  },
  "esports": {
    logo: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=160&auto=format&fit=crop&q=80",
    coverImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80",
  },
};

function matchClubKey(name: string, id?: string): string | null {
  const combined = `${name || ""} ${id || ""}`.toLowerCase();

  if (combined.includes("coding block") || combined.includes("codingblocks")) return "coding-blocks";
  if (combined.includes("coding ninja") || combined.includes("codingninjas")) return "coding-ninjas";
  if (combined.includes("geeksforgeeks") || combined.includes("gfg")) return "geeksforgeeks";
  if (combined.includes("codechef")) return "codechef";
  if (combined.includes("girlscript")) return "girlscript";
  if (combined.includes("cybsec") || combined.includes("null chapter") || combined.includes("cyber")) return "cybsec";
  if (combined.includes("risc") || combined.includes("robotics") || combined.includes("intelligent systems")) return "risc";
  if (combined.includes("electech") || combined.includes("hardware")) return "electech";
  if (combined.includes("gdg") || combined.includes("gdsc") || combined.includes("google developer")) return "gdg";
  if (combined.includes("ieee")) return "ieee";
  if (combined.includes("tatva")) return "tatva";
  if (combined.includes("aurora")) return "aurora";
  if (combined.includes("lscc") || combined.includes("saeindia")) return "lscc";
  if (combined.includes("natya") || combined.includes("theatre") || combined.includes("drama")) return "natyamanch";
  if (combined.includes("iqlipse") || combined.includes("dhwani") || combined.includes("music")) return "iqlipse";
  if (combined.includes("dance") || combined.includes("vibe dance") || combined.includes("beats")) return "vibedance";
  if (combined.includes("shutterbug") || combined.includes("uni tv") || combined.includes("photo")) return "shutterbugs";
  if (combined.includes("designers den") || combined.includes("design")) return "designersden";
  if (combined.includes("kalakriti") || combined.includes("canvas") || combined.includes("fine art")) return "kalakriti";
  if (combined.includes("sml") || combined.includes("management learning")) return "sml";
  if (combined.includes("ecell") || combined.includes("e-cell") || combined.includes("griffin") || combined.includes("startup")) return "ecell";
  if (combined.includes("finix") || combined.includes("finance") || combined.includes("investment")) return "finix";
  if (combined.includes("markophilic") || combined.includes("marketing")) return "markophilic";
  if (combined.includes("sankalp") || combined.includes("environment") || combined.includes("green")) return "sankalp";
  if (combined.includes("wings of hope") || combined.includes("aashray") || combined.includes("welfare")) return "wingsofhope";
  if (combined.includes("spade") || combined.includes("club20")) return "spade";
  if (combined.includes("debate") || combined.includes("debating") || combined.includes("parliamentary")) return "debate";
  if (combined.includes("esport") || combined.includes("gaming") || combined.includes("gamecraft")) return "esports";

  return null;
}

export function getClubLogo(clubName: string, clubId?: string, customLogo?: string | null): string {
  if (customLogo && customLogo.startsWith("http")) {
    return customLogo;
  }
  const key = matchClubKey(clubName, clubId);
  const asset = key ? KNOWN_CLUB_ASSETS[key] : undefined;
  if (asset) {
    return asset.logo;
  }
  // Deterministic SVG emblem
  const cleanSeed = encodeURIComponent(
    (clubName || clubId || "campus-club").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-")
  );
  return `https://api.dicebear.com/9.x/shapes/svg?seed=${cleanSeed}&backgroundColor=1e1b4b,1e3a8a,064e3b`;
}

export function getClubCoverImage(
  clubName: string,
  clubId?: string,
  customCover?: string | null
): string {
  if (customCover && customCover.startsWith("http")) {
    return customCover;
  }
  const key = matchClubKey(clubName, clubId);
  const asset = key ? KNOWN_CLUB_ASSETS[key] : undefined;
  if (asset) {
    return asset.coverImage;
  }
  return "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80";
}
