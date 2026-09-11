import { create } from "zustand";

export interface OnboardingState {
  interests: string[];
  goals: string[];
  userName: string;
  setInterests: (interests: string[]) => void;
  toggleInterest: (interest: string) => void;
  setGoals: (goals: string[]) => void;
  toggleGoal: (goal: string) => void;
  setUserName: (name: string) => void;
}

const DEFAULT_INTERESTS = ["AI", "Web Dev", "Startups"];
const DEFAULT_GOALS = ["Hackathons", "Projects", "People & Teammates"];

export const useCampusStore = create<OnboardingState>((set) => ({
  interests: DEFAULT_INTERESTS,
  goals: DEFAULT_GOALS,
  userName: "Utpal",
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
}));
