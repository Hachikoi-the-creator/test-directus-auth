import { type EventRules } from "@/types/api-collection";
import { create } from "zustand";

type FollowUpState = {
  followUps: EventRules[];
  isLoading: boolean;
  error: Error | null;
  setFollowUps: (followUps: EventRules[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
};

export const useFollowUpStore = create<FollowUpState>()((set) => ({
  followUps: [],
  isLoading: false,
  error: null,
  setFollowUps: (followUps) => set({ followUps }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
