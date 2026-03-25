import { create } from "zustand";

type ExampleState = {
  latestUpdated: string;
  setLatestUpdated: (latestUpdated: string) => void;
  couponCode: string;
  setCouponCode: (couponCode: string) => void;
};

export const useExampleStore = create<ExampleState>()((set) => ({
  latestUpdated: "",
  couponCode: "",
  setLatestUpdated: (latestUpdated) => set({ latestUpdated: latestUpdated }),
  setCouponCode: (couponCode) => set({ couponCode: couponCode }),
}));
