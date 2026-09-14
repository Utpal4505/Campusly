/**
 * Authentic Event Cover Images for LPU Campus Events & Hackathons.
 * Provides high-resolution thematic photography banners tailored to each event type.
 */

export const KNOWN_EVENT_COVERS = {
  // Top-Level Hackathons
  sih: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80",
  hackwave: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80",
  cyberwar: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80",
  aetherax: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80",
  wow: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80",
  youthvibe: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop&q=80",

  // Mid-Level Competitions
  aurora: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80",
  robowars: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&auto=format&fit=crop&q=80",
  kaggle: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80",
  innovatex: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&auto=format&fit=crop&q=80",

  // Grassroots & Departmental Mini-Events
  novicehack: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80",
  speedcode: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&auto=format&fit=crop&q=80",
  designsprint: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1200&auto=format&fit=crop&q=80",
  nukkadnatak: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=1200&auto=format&fit=crop&q=80",
  photowalk: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&auto=format&fit=crop&q=80",
  esportsderby: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80",
  admad: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80",
  unplugged: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80",
  treeplantation: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop&q=80",
  parldebate: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80",
} as const;

export function getEventCoverImage(
  title: string,
  id?: string,
  customCover?: string | null,
  category?: string
): string {
  if (customCover && customCover.startsWith("http")) {
    return customCover;
  }

  const combined = `${title || ""} ${id || ""} ${category || ""}`.toLowerCase();

  if (combined.includes("sih") || combined.includes("smart india")) return KNOWN_EVENT_COVERS.sih;
  if (combined.includes("hackwave") || combined.includes("tatva")) return KNOWN_EVENT_COVERS.hackwave;
  if (combined.includes("cyberwar") || combined.includes("ctf") || combined.includes("cyber")) return KNOWN_EVENT_COVERS.cyberwar;
  if (combined.includes("aetherax") || combined.includes("iot") || combined.includes("hardware")) return KNOWN_EVENT_COVERS.aetherax;
  if (combined.includes("wonders") || combined.includes("wow") || combined.includes("gdg")) return KNOWN_EVENT_COVERS.wow;
  if (combined.includes("youthvibe")) return KNOWN_EVENT_COVERS.youthvibe;
  if (combined.includes("aurora") || combined.includes("codefest")) return KNOWN_EVENT_COVERS.aurora;
  if (combined.includes("robowars") || combined.includes("robot") || combined.includes("combat")) return KNOWN_EVENT_COVERS.robowars;
  if (combined.includes("kaggle") || combined.includes("ml") || combined.includes("data")) return KNOWN_EVENT_COVERS.kaggle;
  if (combined.includes("innovatex") || combined.includes("pitch") || combined.includes("startup")) return KNOWN_EVENT_COVERS.innovatex;
  if (combined.includes("novice") || combined.includes("overnight") || combined.includes("mini-hack")) return KNOWN_EVENT_COVERS.novicehack;
  if (combined.includes("speed") || combined.includes("leetcode") || combined.includes("algo")) return KNOWN_EVENT_COVERS.speedcode;
  if (combined.includes("design") || combined.includes("ui") || combined.includes("ux") || combined.includes("figma")) return KNOWN_EVENT_COVERS.designsprint;
  if (combined.includes("nukkad") || combined.includes("theatre") || combined.includes("drama") || combined.includes("play")) return KNOWN_EVENT_COVERS.nukkadnatak;
  if (combined.includes("photo") || combined.includes("walk") || combined.includes("camera") || combined.includes("reel")) return KNOWN_EVENT_COVERS.photowalk;
  if (combined.includes("esport") || combined.includes("valorant") || combined.includes("bgmi") || combined.includes("gaming")) return KNOWN_EVENT_COVERS.esportsderby;
  if (combined.includes("ad-mad") || combined.includes("admad") || combined.includes("case study") || combined.includes("marketing")) return KNOWN_EVENT_COVERS.admad;
  if (combined.includes("unplugged") || combined.includes("music") || combined.includes("open mic") || combined.includes("acoustic")) return KNOWN_EVENT_COVERS.unplugged;
  if (combined.includes("tree") || combined.includes("plantation") || combined.includes("cleanliness") || combined.includes("green")) return KNOWN_EVENT_COVERS.treeplantation;
  if (combined.includes("debate") || combined.includes("parliamentary") || combined.includes("oratory")) return KNOWN_EVENT_COVERS.parldebate;

  // General fallback
  return "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80";
}
