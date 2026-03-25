// ? helper context to avoid long loading times when fetching meta templates
import { type WaTemplate } from "@/types/whatsapp";
import { getMetaTemplates } from "@/DAL/whatsapp-meta-template";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type MetaTemplatesState = {
  metaTemplates: WaTemplate[];
  latestUpdated: number;

  getStoredMetaTemplates: () => Promise<WaTemplate[]>;
};

export const useMetaTemplatesStore = create<MetaTemplatesState>()(
  persist(
    (set, get) => ({
      metaTemplates: [],
      latestUpdated: 0,
      getStoredMetaTemplates: async () => {
        const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;
        const now = Date.now();
        const lastUpdated = get().latestUpdated;

        if (
          !lastUpdated ||
          now - lastUpdated > FOUR_HOURS_MS ||
          get().metaTemplates.length === 0
        ) {
          // Fetch new data if more than 4 hours old
          const newTemplates = await getMetaTemplates();
          set({ metaTemplates: newTemplates, latestUpdated: now });
          return newTemplates;
        }

        // Return cached data if less than 4 hours old
        return get().metaTemplates;
      },
    }),
    {
      name: "meta-templates", // name of the item in the storage (must be unique)
    }
  )
);
