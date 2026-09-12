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

export const useCampusStore = create<OnboardingState>((set) => ({
  interests: DEFAULT_INTERESTS,
  interestIds: [],
  goals: DEFAULT_GOALS,
  userName: "Utpal",
  customPosts: [],
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
