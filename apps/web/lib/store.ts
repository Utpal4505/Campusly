import { create } from "zustand";

export interface CustomPost {
  id: string;
  type: "teammates" | "events" | "projects" | "clubs";
  category: string;
  title: string;
  author: string;
  avatar: string;
  meta: string;
  description: string;
  tags: string[];
  createdAt: string;
  actionLabel: string;
  actionDoneLabel: string;
  actionHref?: string;
}

export type CreateModalTabType = "teammate" | "project" | "event";

export interface OnboardingState {
  interests: string[];
  interestIds: string[];
  goals: string[];
  userName: string;
  customPosts: CustomPost[];
  isCreateModalOpen: boolean;
  createModalTab: CreateModalTabType;
  isEditInterestsOpen: boolean;
  setInterestIds: (ids: string[]) => void;
  setInterests: (interests: string[]) => void;
  setSelectedInterests: (items: Array<{ id: string; name: string }>) => void;
  toggleInterest: (interest: string) => void;
  toggleInterestItem: (item: { id: string; name: string }) => void;
  setGoals: (goals: string[]) => void;
  toggleGoal: (goal: string) => void;
  setUserName: (name: string) => void;
  addCustomPost: (post: CustomPost) => void;
  setCreateModalOpen: (open: boolean, tab?: CreateModalTabType) => void;
  setCreateModalTab: (tab: CreateModalTabType) => void;
  setEditInterestsOpen: (open: boolean) => void;
}

const DEFAULT_INTERESTS = ["Artificial Intelligence", "Web Development", "Startups"];
const DEFAULT_GOALS = ["Hackathons", "Projects", "People & Teammates"];

export const DEFAULT_LPU_POSTS: CustomPost[] = [
  {
    id: "lpu-post-sih-squad",
    type: "teammates",
    category: "Teammate",
    title: "Need 2 SCSE Devs (FastAPI + Next.js) for SIH 2026 Internal Round",
    author: "Rahul Sharma (SCSE, 3rd Year)",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=RahulDev",
    meta: "Block 34, Central Lab 5 · SIH 2026 Track",
    description:
      "Forming a 6-member squad for the Smart India Hackathon internal round. We have a problem statement in AI-driven smart agriculture ready. Need 1 backend and 1 frontend developer.",
    tags: ["Artificial Intelligence", "Web Development", "Startups"],
    createdAt: "2 hours ago",
    actionLabel: "Connect & Join Squad",
    actionDoneLabel: "Request Sent ✓",
    actionHref: "/feed",
  },
  {
    id: "lpu-post-transit-project",
    type: "projects",
    category: "Project",
    title: "Campus Transit: Real-Time LPU Auto & Shuttle Tracker",
    author: "Dev Kapoor (SCSE, 3rd Year)",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=DevKapoor",
    meta: "Open Source · Flutter & WebSockets",
    description:
      "Building an open-source progressive web app to track campus e-rickshaws and shuttle timings between Block 34, Uni Mall, and BH-4. Looking for UI/UX contributors.",
    tags: ["App Development", "Web Development", "Open Source"],
    createdAt: "5 hours ago",
    actionLabel: "View Repo & Collaborate",
    actionDoneLabel: "Starred & Joined ✓",
    actionHref: "/feed",
  },
  {
    id: "lpu-post-mess-designer",
    type: "teammates",
    category: "Teammate",
    title: "Seeking Figma UI/UX Designer for Campus Mess & Laundry App",
    author: "Ananya Singh (Designers Den, Block 12)",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=AnanyaDesign",
    meta: "Block 12 Studio · UI/UX Collaboration",
    description:
      "Working on a streamlined hostel laundry booking interface to replace manual tokens. Looking for a developer with React Native or Flutter skills to bring the prototype to life.",
    tags: ["Design", "UI/UX", "App Development"],
    createdAt: "Yesterday",
    actionLabel: "Offer Design / Team Up",
    actionDoneLabel: "Connected ✓",
    actionHref: "/feed",
  },
  {
    id: "lpu-post-robotics-project",
    type: "projects",
    category: "Project",
    title: "Autonomous Line-Follower & Obstacle Bot for RISC Roboverse",
    author: "Sneha Reddy (SEEE, Block 28)",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=SnehaRobo",
    meta: "Innovation Studio · Robotics & Embedded C",
    description:
      "Hardware prototype using ESP32, PID motor controller, and IR sensor array for the upcoming RoboWars obstacle arena. Seeking teammates interested in ROS2 telemetry.",
    tags: ["Robotics", "Artificial Intelligence"],
    createdAt: "2 days ago",
    actionLabel: "Join Hardware Sprint",
    actionDoneLabel: "Collaborating ✓",
    actionHref: "/feed",
  },
];

export const useCampusStore = create<OnboardingState>((set) => ({
  interests: DEFAULT_INTERESTS,
  interestIds: [],
  goals: DEFAULT_GOALS,
  userName: "Utpal",
  customPosts: DEFAULT_LPU_POSTS,
  isCreateModalOpen: false,
  createModalTab: "teammate",
  isEditInterestsOpen: false,
  setInterestIds: (interestIds) => set({ interestIds }),
  setInterests: (interests) => set({ interests }),
  setSelectedInterests: (items) =>
    set({
      interestIds: items.map((i) => i.id),
      interests: items.map((i) => i.name),
    }),
  toggleInterest: (interest) =>
    set((state) => ({
      interests: state.interests.includes(interest)
        ? state.interests.filter((i) => i !== interest)
        : [...state.interests, interest],
    })),
  toggleInterestItem: (item) =>
    set((state) => {
      const isSelected = state.interestIds.includes(item.id);
      return {
        interestIds: isSelected
          ? state.interestIds.filter((id) => id !== item.id)
          : [...state.interestIds, item.id],
        interests: isSelected
          ? state.interests.filter((name) => name !== item.name)
          : [...state.interests, item.name],
      };
    }),
  setGoals: (goals) => set({ goals }),
  toggleGoal: (goal) =>
    set((state) => ({
      goals: state.goals.includes(goal)
        ? state.goals.filter((g) => g !== goal)
        : [...state.goals, goal],
    })),
  setUserName: (userName) => set({ userName }),
  addCustomPost: (post) =>
    set((state) => ({
      customPosts: [post, ...state.customPosts],
    })),
  setCreateModalOpen: (open, tab) =>
    set((state) => ({
      isCreateModalOpen: open,
      ...(tab ? { createModalTab: tab } : {}),
    })),
  setCreateModalTab: (tab) => set({ createModalTab: tab }),
  setEditInterestsOpen: (open) => set({ isEditInterestsOpen: open }),
}));
