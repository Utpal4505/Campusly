export type MarketplaceCategory = "all" | "lab" | "books" | "electronics" | "hostel";

export type ItemCondition = "Like New" | "Gently Used" | "Fair";

export interface MarketplaceItem {
  id: string;
  title: string;
  category: "lab" | "books" | "electronics" | "hostel";
  price: number; // in INR
  originalPrice?: number;
  condition: ItemCondition;
  image: string;
  description: string;
  pickupLocation: string; // e.g. "BH-4 Hostel", "UniMall", "Block 38"
  seller: {
    name: string;
    username: string;
    branch: string;
    year: string;
    verifiedStudent: boolean;
  };
  createdAt: string;
  isSold?: boolean;
}

export const MARKETPLACE_CATEGORIES: { id: MarketplaceCategory; label: string; icon: string }[] = [
  { id: "all", label: "All Items", icon: "Sparkles" },
  { id: "lab", label: "Lab & Workshop Gear", icon: "Wrench" },
  { id: "electronics", label: "Electronics, IoT & Calc", icon: "Cpu" },
  { id: "books", label: "Textbooks & Notes", icon: "BookOpen" },
  { id: "hostel", label: "Hostel & Cycles", icon: "Bike" },
];

export const INITIAL_MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: "item-1",
    title: "Omega Engineering Mini Drafter with Steel Arm & Canvas Bag",
    category: "lab",
    price: 450,
    originalPrice: 950,
    condition: "Like New",
    image:
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80",
    description:
      "Used for only 1 semester in Engineering Graphics (MEC107). Calibrated stainless steel arms, smooth 360-degree scale clamp, zero wobbling. Includes original black canvas zip pouch and clamps.",
    pickupLocation: "BH-4 (Boys Hostel 4, Block A)",
    seller: {
      name: "Aditya Verma",
      username: "aditya_v",
      branch: "Mechanical Engineering",
      year: "2nd Year",
      verifiedStudent: true,
    },
    createdAt: "3 hours ago",
  },
  {
    id: "item-2",
    title: "Casio fx-991ES Plus 2nd Edition Non-Programmable Scientific Calculator",
    category: "electronics",
    price: 650,
    originalPrice: 1395,
    condition: "Like New",
    image:
      "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=800&auto=format&fit=crop&q=80",
    description:
      "Approved for all LPU Mid-Term and End-Term university examinations. Dual power (solar + battery), 417 functions, matrix/vector calculations. Clean screen with protective snap-on cover.",
    pickupLocation: "UniMall Food Court",
    seller: {
      name: "Neha Patel",
      username: "neha_p",
      branch: "Computer Science & Eng (SCSE)",
      year: "3rd Year",
      verifiedStudent: true,
    },
    createdAt: "5 hours ago",
  },
  {
    id: "item-3",
    title: "Official LPU Laboratory Apron / Coat (White, Size 40) + Polycarb Safety Goggles",
    category: "lab",
    price: 250,
    originalPrice: 600,
    condition: "Like New",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80",
    description:
      "100% thick white cotton lab coat with stitched LPU student pocket. Cleaned, ironed, and free from any chemical stains. Also bundling anti-fog safety goggles for Chemistry & Fabrication labs.",
    pickupLocation: "GH-2 (Girls Hostel 2)",
    seller: {
      name: "Sneha Kumari",
      username: "sneha_k",
      branch: "Biotechnology & Pharmacy",
      year: "2nd Year",
      verifiedStudent: true,
    },
    createdAt: "1 day ago",
  },
  {
    id: "item-4",
    title: "Arduino Uno R3 Ultimate Starter Kit with 35+ Sensors, Breadboard & LCD",
    category: "electronics",
    price: 1200,
    originalPrice: 2400,
    condition: "Like New",
    image:
      "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=800&auto=format&fit=crop&q=80",
    description:
      "Complete hardware kit ideal for IoT hackathons and robotics club projects. Includes original ATmega328P board, ultrasonic sensor, servo motors, jumper cables, relays, and clear storage container.",
    pickupLocation: "Block 38 • Innovation Studio",
    seller: {
      name: "Rahul Sharma",
      username: "rahul_dev",
      branch: "Robotics & Automation",
      year: "3rd Year",
      verifiedStudent: true,
    },
    createdAt: "1 day ago",
  },
  {
    id: "item-5",
    title: "Higher Engineering Mathematics by B.S. Grewal (44th Edition)",
    category: "books",
    price: 380,
    originalPrice: 850,
    condition: "Gently Used",
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
    description:
      "Standard textbook for MTH108 and MTH401 Calculus, Differential Equations, and Transform Calculus. Crisp pages with highlighted key formulas and university previous year question solutions.",
    pickupLocation: "Central Library Lawn",
    seller: {
      name: "Aryan Gupta",
      username: "aryan_g",
      branch: "Electronics & Comm (ECE)",
      year: "2nd Year",
      verifiedStudent: true,
    },
    createdAt: "2 days ago",
  },
  {
    id: "item-6",
    title: "Hero Sprint 21-Speed Gear Bicycle with Keyed Steel Wire Cable Lock",
    category: "hostel",
    price: 3200,
    originalPrice: 7500,
    condition: "Gently Used",
    image:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80",
    description:
      "Life saver for traveling between BH Hostels, Block 34, and Unipolis on LPU's 600-acre campus. Dual disc brakes, smooth Shimano gears, front suspension, and reflective night stripes. Fully tuned.",
    pickupLocation: "BH-2 Cycle Parking Stand",
    seller: {
      name: "Karan Johar",
      username: "karan_j",
      branch: "Mechanical Engineering",
      year: "4th Year (Passout)",
      verifiedStudent: true,
    },
    createdAt: "2 days ago",
  },
  {
    id: "item-7",
    title: "Prestige 1.5L Stainless Steel Electric Kettle for Hostel Maggi & Tea",
    category: "hostel",
    price: 520,
    originalPrice: 1100,
    condition: "Like New",
    image:
      "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&auto=format&fit=crop&q=80",
    description:
      "Auto cut-off boiling technology, 1500W rapid heating, food-grade stainless steel interior. Essential for late night hackathons and hostel study sessions.",
    pickupLocation: "BH-6 (Boys Hostel 6)",
    seller: {
      name: "Manish Kumar",
      username: "manish_k",
      branch: "Computer Science",
      year: "3rd Year",
      verifiedStudent: true,
    },
    createdAt: "3 days ago",
  },
  {
    id: "item-8",
    title: "Raspberry Pi 4 Model B (4GB RAM) with Aluminium Heatsink Case & 32GB MicroSD",
    category: "electronics",
    price: 3750,
    originalPrice: 6500,
    condition: "Like New",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
    description:
      "Tested and working 100%. Flashed with clean Raspberry Pi OS. Perfect for running edge AI computer vision models or hosting a local home server for capstone projects.",
    pickupLocation: "Block 32 • Hardware Lab",
    seller: {
      name: "Siddharth Rao",
      username: "sid_rao",
      branch: "Information Technology",
      year: "4th Year",
      verifiedStudent: true,
    },
    createdAt: "3 days ago",
  },
];

const STORAGE_KEY = "campusly:marketplace-items";

export function getStoredMarketplaceItems(): MarketplaceItem[] {
  if (typeof window === "undefined") return INITIAL_MARKETPLACE_ITEMS;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return INITIAL_MARKETPLACE_ITEMS;
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MARKETPLACE_ITEMS;
  } catch (e) {
    return INITIAL_MARKETPLACE_ITEMS;
  }
}

export function saveMarketplaceItems(items: MarketplaceItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save marketplace items:", e);
  }
}
