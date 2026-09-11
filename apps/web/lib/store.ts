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

export interface OnboardingState {
  interests: string[];
  goals: string[];
  userName: string;
  customPosts: CustomPost[];
  isCreateModalOpen: boolean;
  isEditInterestsOpen: boolean;
  setInterests: (interests: string[]) => void;
  toggleInterest: (interest: string) => void;
  setGoals: (goals: string[]) => void;
  toggleGoal: (goal: string) => void;
  setUserName: (name: string) => void;
  addCustomPost: (post: CustomPost) => void;
  setCreateModalOpen: (open: boolean) => void;
  setEditInterestsOpen: (open: boolean) => void;
}

const DEFAULT_INTERESTS = ["AI", "Web Dev", "Startups"];
const DEFAULT_GOALS = ["Hackathons", "Projects", "People & Teammates"];

export const useCampusStore = create<OnboardingState>((set) => ({
  interests: DEFAULT_INTERESTS,
  goals: DEFAULT_GOALS,
  userName: "Utpal",
  customPosts: [],
  isCreateModalOpen: false,
  isEditInterestsOpen: false,
  setInterests: (interests) => set({ interests }),
  toggleInterest: (interest) =>
    set((state) => ({
      interests: state.interests.includes(interest)
        ? state.interests.filter((i) => i !== interest)
        : [...state.interests, interest],
    })),
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
  setCreateModalOpen: (open) => set({ isCreateModalOpen: open }),
  setEditInterestsOpen: (open) => set({ isEditInterestsOpen: open }),
}));
