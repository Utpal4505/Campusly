export type VenueCategory = "academic" | "auditorium" | "hostel" | "dining" | "landmark";

export interface CampusVenue {
  id: string;
  name: string;
  shortName: string;
  category: VenueCategory;
  coordinates: [number, number]; // [lat, lng]
  blockNumber?: string;
  floor?: string;
  rooms?: string[];
  nearestLandmark: string;
  description: string;
  image: string;
  activeEvents?: string[];
  activeClubs?: string[];
  tags: string[];
}

export const LPU_CAMPUS_CENTER: [number, number] = [31.2536, 75.7037];

export const VENUE_CATEGORIES: { id: VenueCategory | "all"; label: string; icon: string }[] = [
  { id: "all", label: "All Campus Venues", icon: "Compass" },
  { id: "academic", label: "Academic Blocks", icon: "Building" },
  { id: "auditorium", label: "Auditoriums & Arenas", icon: "Drama" },
  { id: "dining", label: "Food & UniMall", icon: "Utensils" },
  { id: "hostel", label: "Hostel Zones", icon: "Home" },
  { id: "landmark", label: "Gates & Library", icon: "MapPin" },
];

export const CAMPUS_VENUES: CampusVenue[] = [
  {
    id: "block-38",
    name: "Block 38 • Innovation Studio & CSE Labs",
    shortName: "Block 38 (Lab 402)",
    category: "academic",
    coordinates: [31.2554, 75.7031],
    blockNumber: "Block 38",
    floor: "4th Floor",
    rooms: ["Lab 402", "Innovation Studio", "Seminar Hall 401"],
    nearestLandmark: "Adjacent to Central Lawn, opposite Block 37",
    description:
      "Primary hub for developer hackathons, coding inductions, and Google Developer Groups (GDG) workshops. Houses high-spec GPU workstations and the Innovation Studio.",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
    activeEvents: ["sih-lpu-internal-hackathon-2026"],
    activeClubs: ["gdg-lpu", "coding-blocks-lpu"],
    tags: ["Coding", "Hackathons", "Tech Labs", "High-Speed WiFi"],
  },
  {
    id: "block-34",
    name: "Block 34 • Central Computing & SCSE Academic Block",
    shortName: "Block 34",
    category: "academic",
    coordinates: [31.2546, 75.7025],
    blockNumber: "Block 34",
    floor: "2nd & 3rd Floor",
    rooms: ["Central Lab 5", "Auditorium 34-101", "Conference Room A"],
    nearestLandmark: "Heart of academic square, 2 mins from Central Library",
    description:
      "Home to the School of Computer Science & Engineering (SCSE). Frequent venue for project reviews, guest lectures, and student squad sync-ups.",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80",
    activeEvents: ["gdg-devfest-lpu-2026"],
    activeClubs: ["coding-blocks-lpu"],
    tags: ["Lectures", "Computer Labs", "Faculty Offices"],
  },
  {
    id: "block-32",
    name: "Block 32 • Robotics, IoT & RISC Hardware Arena",
    shortName: "Block 32 (Robotics)",
    category: "academic",
    coordinates: [31.2541, 75.702],
    blockNumber: "Block 32",
    floor: "Ground Floor",
    rooms: ["RoboWars Testing Arena", "IoT Embedded Systems Lab", "3D Printing Hub"],
    nearestLandmark: "Behind Mechanical Workshop, near Gate 2 lane",
    description:
      "State-of-the-art hardware prototyping workspace equipped with 3D printers, laser cutters, CNC machines, and testing arenas for autonomous rovers and drones.",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80",
    activeEvents: [],
    activeClubs: ["risc-robotics"],
    tags: ["Robotics", "Hardware", "3D Printing", "Arduino"],
  },
  {
    id: "unipolis",
    name: "Baldev Raj Mittal Unipolis • Mega Amphitheater",
    shortName: "Unipolis Arena",
    category: "auditorium",
    coordinates: [31.2528, 75.7042],
    blockNumber: "Unipolis Plaza",
    floor: "Open Air Arena",
    rooms: ["Main Stage", "Backstage Green Rooms", "Sound Control Booth"],
    nearestLandmark: "Central axis of campus, opposite UniMall",
    description:
      "LPU's flagship open-air amphitheater with a capacity of over 10,000 students. Hosts YouthVibe national fest, celebrity musical concerts, cultural exhibitions, and major convocation events.",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80",
    activeEvents: ["youthvibe-mega-cultural-fest-2026"],
    activeClubs: ["vibe-dance-crew", "shutterbugs-media"],
    tags: ["Concerts", "Mega Events", "Open Air", "Festivals"],
  },
  {
    id: "sdm-auditorium",
    name: "Shanti Devi Mittal Auditorium (SDM)",
    shortName: "SDM Auditorium",
    category: "auditorium",
    coordinates: [31.2539, 75.7051],
    blockNumber: "SDM Complex",
    floor: "1st & 2nd Floor",
    rooms: ["Main Air-Conditioned Hall", "VIP Lounge", "Press Briefing Suite"],
    nearestLandmark: "Between Block 28 and UniHospital, eastern avenue",
    description:
      "Fully air-conditioned 2,500-seat premier auditorium featuring Dolby surround acoustics. Primary venue for corporate CEO keynotes, international conferences, and TedxLPU.",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
    activeEvents: ["gdg-devfest-lpu-2026"],
    activeClubs: ["toastmasters-lpu"],
    tags: ["Auditorium", "Air Conditioned", "Conferences", "Corporate Talks"],
  },
  {
    id: "unimall",
    name: "UniMall • Student Commercial Hub & Food Street",
    shortName: "UniMall & Dining",
    category: "dining",
    coordinates: [31.2522, 75.7055],
    blockNumber: "UniMall Building",
    floor: "Ground to 3rd Floor",
    rooms: ["Food Court", "Stationery & Drafting Store", "Courier & Post Office", "Banking Center"],
    nearestLandmark: "Directly facing Unipolis, near Main Gate path",
    description:
      "Comprehensive multi-story on-campus shopping and dining center with food franchises (Domino's, Subway), stationery stores for lab drafters, electronics accessories, and student lounges.",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
    activeEvents: [],
    activeClubs: [],
    tags: ["Food Court", "Stationery", "Shopping", "Banking", "Student Hub"],
  },
  {
    id: "central-library",
    name: "Central Library & Division of Student Welfare (DSW)",
    shortName: "Central Library & DSW",
    category: "landmark",
    coordinates: [31.2533, 75.7048],
    blockNumber: "Central Library",
    floor: "Floors 1-4 (Library) • Ground Floor (DSW Office)",
    rooms: ["Reading Hall A", "Digital Resource Lab", "DSW Approval Desk"],
    nearestLandmark: "Central Quadrangle, adjacent to Law Garden",
    description:
      "A 4-story state-of-the-art academic repository with over 1.5 million volumes, private study carrels, digital research terminals, and the official DSW headquarters for Duty Leave validations.",
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80",
    activeEvents: [],
    activeClubs: ["tatva-dsw"],
    tags: ["Library", "Quiet Zone", "DSW Admin", "Research"],
  },
  {
    id: "hostels-bh",
    name: "Boys Hostels Residential Zone (BH-1 to BH-7)",
    shortName: "Boys Hostels (BH)",
    category: "hostel",
    coordinates: [31.2565, 75.706],
    blockNumber: "BH Residential Complex",
    floor: "Multi-Tower Blocks",
    rooms: ["BH-1 to BH-7", "Night Canteen Plaza", "Hostel Gym"],
    nearestLandmark: "Northern campus perimeter, near Sports Stadium",
    description:
      "Vibrant student residential quarters featuring night canteens, sports lawns, study areas, and peer-to-peer marketplace exchange pickup points.",
    image:
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80",
    activeEvents: [],
    activeClubs: [],
    tags: ["Hostels", "Night Canteen", "Sports Ground", "Residential"],
  },
  {
    id: "hostels-gh",
    name: "Girls Hostels Residential Zone (GH-1 to GH-4)",
    shortName: "Girls Hostels (GH)",
    category: "hostel",
    coordinates: [31.251, 75.702],
    blockNumber: "GH Residential Complex",
    floor: "Multi-Tower Blocks",
    rooms: ["GH-1 to GH-4", "GH Central Garden", "Reading Parlor"],
    nearestLandmark: "Southwestern quiet zone, adjacent to Botanical Gardens",
    description:
      "Secure student housing sector with dedicated reading halls, indoor badminton facilities, green manicured gardens, and community dining halls.",
    image:
      "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?w=800&auto=format&fit=crop&q=80",
    activeEvents: [],
    activeClubs: [],
    tags: ["Hostels", "Gardens", "Reading Rooms", "Residential"],
  },
  {
    id: "main-gate",
    name: "Main Gate 1 • GT Road National Highway Entrance",
    shortName: "Main Gate 1",
    category: "landmark",
    coordinates: [31.2505, 75.7045],
    blockNumber: "Gate 1 Complex",
    floor: "Ground Level",
    rooms: ["Visitor Pass Counter", "Security Office", "E-Rickshaw Stand"],
    nearestLandmark: "Grand Trunk Road (NH-44), Phagwara-Jalandhar Highway",
    description:
      "The primary architectural portal into Lovely Professional University. Hub for campus electric transit, intercity buses, and initial student orientation check-ins.",
    image:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80",
    activeEvents: [],
    activeClubs: [],
    tags: ["Entrance", "Transit", "E-Rickshaws", "Security"],
  },
];

// Calculate Haversine distance in meters
export function calculateDistanceMeters(
  coord1: [number, number],
  coord2: [number, number]
): number {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Estimate walking time in minutes (~75 meters per minute campus walking speed)
export function estimateWalkingMinutes(meters: number): number {
  return Math.max(1, Math.round(meters / 75));
}

// Generate Google Maps navigation link
export function getGoogleMapsNavigationUrl(lat: number, lng: number, label: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(label)}`;
}
