"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  Search,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Code,
  Layers,
  Cpu,
  Smartphone,
  Palette,
  X,
  Send,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SquadItem {
  id: string;
  teamName: string;
  leadName: string;
  leadUsername: string;
  leadYear: string;
  currentMembers: number;
  maxMembers: number;
  lookingForRole: string; // e.g. "UI/UX Designer", "AI/ML Engineer"
  techStack: string[];
  projectIdea: string;
  contactSlug: string;
  roleCategory: "all" | "design" | "ai" | "frontend" | "backend" | "mobile" | "hardware";
}

const DEFAULT_SQUADS: SquadItem[] = [
  {
    id: "sq-1",
    teamName: "ByteCrafters LPU",
    leadName: "Aarav Sharma",
    leadUsername: "aarav_dev",
    leadYear: "3rd Year CSE",
    currentMembers: 3,
    maxMembers: 4,
    lookingForRole: "UI/UX & Figma Designer",
    techStack: ["Figma", "Next.js", "Tailwind CSS"],
    projectIdea: "Smart campus lost-and-found mobile web platform with AI image verification.",
    contactSlug: "aarav-sharma",
    roleCategory: "design",
  },
  {
    id: "sq-2",
    teamName: "NeuralNomads",
    leadName: "Priya Patel",
    leadUsername: "priya_ml",
    leadYear: "4th Year AI/ML",
    currentMembers: 2,
    maxMembers: 4,
    lookingForRole: "FastAPI / Backend Engineer",
    techStack: ["PyTorch", "FastAPI", "PostgreSQL", "Docker"],
    projectIdea: "Autonomous attendance & anomaly detection using computer vision on campus feeds.",
    contactSlug: "priya-patel",
    roleCategory: "backend",
  },
  {
    id: "sq-3",
    teamName: "CircuitBreakers (Block 36)",
    leadName: "Rohan Verma",
    leadUsername: "rohan_iot",
    leadYear: "2nd Year Robotics",
    currentMembers: 3,
    maxMembers: 4,
    lookingForRole: "Flutter / Mobile Dev",
    techStack: ["ESP32", "MQTT", "Flutter", "Firebase"],
    projectIdea: "Low-cost smart hostel water telemetry & electricity load monitoring sensor box.",
    contactSlug: "rohan-verma",
    roleCategory: "mobile",
  },
  {
    id: "sq-4",
    teamName: "Web3 Pioneers",
    leadName: "Ananya Iyer",
    leadUsername: "ananya_sol",
    leadYear: "3rd Year CSE",
    currentMembers: 2,
    maxMembers: 4,
    lookingForRole: "Frontend / React Engineer",
    techStack: ["Solidity", "Ethers.js", "Next.js", "IPFS"],
    projectIdea: "Verifiable student credentials & campus election voting on a zero-knowledge ledger.",
    contactSlug: "ananya-iyer",
    roleCategory: "frontend",
  },
];

interface SquadFinderSectionProps {
  eventId: string;
  eventTitle: string;
}

export default function SquadFinderSection({
  eventId,
  eventTitle,
}: SquadFinderSectionProps) {
  const [squads, setSquads] = useState<SquadItem[]>(DEFAULT_SQUADS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [joinedSquadId, setJoinedSquadId] = useState<string | null>(null);

  // Form State
  const [teamName, setTeamName] = useState("");
  const [leadName, setLeadName] = useState("");
  const [lookingForRole, setLookingForRole] = useState("");
  const [roleCategory, setRoleCategory] = useState<SquadItem["roleCategory"]>("frontend");
  const [currentMembers, setCurrentMembers] = useState(2);
  const [maxMembers, setMaxMembers] = useState(4);
  const [techStackInput, setTechStackInput] = useState("");
  const [projectIdea, setProjectIdea] = useState("");

  const filteredSquads = squads.filter((s) => {
    if (selectedCategory === "all") return true;
    return s.roleCategory === selectedCategory;
  });

  const handleCreateSquad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !lookingForRole.trim()) return;

    const newSquad: SquadItem = {
      id: `sq-${Date.now()}`,
      teamName: teamName.trim(),
      leadName: leadName.trim() || "Campus Student",
      leadUsername: leadName.toLowerCase().replace(/[^a-z0-9]/g, "_") || "student_lead",
      leadYear: "B.Tech CSE",
      currentMembers: Number(currentMembers) || 2,
      maxMembers: Number(maxMembers) || 4,
      lookingForRole: lookingForRole.trim(),
      techStack: techStackInput
        ? techStackInput.split(",").map((s) => s.trim()).filter(Boolean)
        : ["React", "TypeScript"],
      projectIdea: projectIdea.trim() || "Innovative solution tackling college campus problem statements.",
      contactSlug: "messages",
      roleCategory,
    };

    setSquads([newSquad, ...squads]);
    setIsCreateOpen(false);

    // Reset Form
    setTeamName("");
    setLeadName("");
    setLookingForRole("");
    setTechStackInput("");
    setProjectIdea("");
  };

  const categories = [
    { id: "all", label: "All Roles", icon: Layers },
    { id: "design", label: "UI/UX Design", icon: Palette },
    { id: "ai", label: "AI / ML", icon: Sparkles },
    { id: "frontend", label: "Frontend", icon: Code },
    { id: "backend", label: "Backend", icon: Layers },
    { id: "mobile", label: "Mobile App", icon: Smartphone },
    { id: "hardware", label: "Hardware & IoT", icon: Cpu },
  ];

  return (
    <section className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card shadow-xs mt-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Teammate & Squad Finder</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            Find Your Hackathon Dream Team
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Browse campus squads looking for peers, or post your own opening for {eventTitle}.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="rounded-xl px-4 h-9 text-xs font-bold gap-1.5 bg-primary text-primary-foreground shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Post a Squad Opening</span>
        </Button>
      </div>

      {/* Role Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`h-8 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-foreground text-background shadow-xs"
                  : "bg-muted/40 hover:bg-muted/70 text-muted-foreground hover:text-foreground border border-border/50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Squad Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {filteredSquads.map((squad) => (
          <div
            key={squad.id}
            className="p-5 rounded-2xl border border-border/70 bg-muted/20 hover:border-primary/40 hover:bg-muted/30 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Card Top: Team Name + Spots Badge */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-foreground">
                    {squad.teamName}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Lead: <span className="font-semibold text-foreground/90">{squad.leadName}</span> • {squad.leadYear}
                  </p>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-mono text-[11px] font-bold shrink-0">
                  {squad.currentMembers}/{squad.maxMembers} Members
                </span>
              </div>

              {/* Looking for role pill */}
              <div className="mb-3">
                <span className="text-[10px] font-mono uppercase text-muted-foreground block mb-1">
                  Actively Recruiting:
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  {squad.lookingForRole}
                </span>
              </div>

              {/* Project Concept */}
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                {squad.projectIdea}
              </p>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {squad.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-[10px] font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-2">
              <span className="text-[10px] text-muted-foreground">
                {squad.maxMembers - squad.currentMembers} spot remaining
              </span>

              {joinedSquadId === squad.id ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Request Sent!</span>
                </span>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href={`/messages`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-2.5 rounded-xl text-xs gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Message Lead</span>
                    </Button>
                  </Link>

                  <Button
                    size="sm"
                    onClick={() => {
                      setJoinedSquadId(squad.id);
                      setTimeout(() => setJoinedSquadId(null), 3500);
                    }}
                    className="h-8 px-3 rounded-xl text-xs font-bold gap-1 cursor-pointer bg-primary text-primary-foreground"
                  >
                    <span>Request to Join</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredSquads.length === 0 && (
        <div className="text-center py-12 border border-dashed border-border/70 rounded-2xl bg-muted/10">
          <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-bold text-foreground">No squads found for this role yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Be the first to post a squad opening and recruit your teammates!
          </p>
        </div>
      )}

      {/* Post a Squad Opening Modal */}
      {isCreateOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-border/80 bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200 my-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsCreateOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary block mb-1">
                Recruit Hackathon Peers
              </span>
              <h3 className="text-lg font-bold text-foreground">Post a Squad Opening</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Students attending {eventTitle} will be able to discover your team and join.
              </p>
            </div>

            <form onSubmit={handleCreateSquad} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Team Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ApexInnovators"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-border/80 bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Team Lead"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-border/80 bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Category</label>
                  <select
                    value={roleCategory}
                    onChange={(e) => setRoleCategory(e.target.value as any)}
                    className="w-full h-9 px-2 rounded-xl border border-border/80 bg-background text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  >
                    <option value="frontend">Frontend Dev</option>
                    <option value="backend">Backend Dev</option>
                    <option value="design">UI/UX Designer</option>
                    <option value="ai">AI / ML Engineer</option>
                    <option value="mobile">Mobile Dev</option>
                    <option value="hardware">Hardware / IoT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Role Needed</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1 Lead UI/UX Designer & Prototyper"
                  value={lookingForRole}
                  onChange={(e) => setLookingForRole(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-border/80 bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Current Members</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={currentMembers}
                    onChange={(e) => setCurrentMembers(Number(e.target.value))}
                    className="w-full h-9 px-3 rounded-xl border border-border/80 bg-background text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Total Team Size</label>
                  <input
                    type="number"
                    min={2}
                    max={6}
                    value={maxMembers}
                    onChange={(e) => setMaxMembers(Number(e.target.value))}
                    className="w-full h-9 px-3 rounded-xl border border-border/80 bg-background text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Tech Stack (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Next.js, Python, Tailwind, Supabase"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-border/80 bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Project Concept / Idea</label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe what your team plans to build..."
                  value={projectIdea}
                  onChange={(e) => setProjectIdea(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border/80 bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-xl text-xs font-bold gap-1.5 cursor-pointer bg-primary text-primary-foreground"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Opening</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
