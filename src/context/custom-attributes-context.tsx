export type SchemaItem = {
  id: string;
  name: string;
  type: string;
};

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type CustomAttributeCollection =
  | "company"
  | "contact"
  | "lead"
  | "event";

type CustomAttributesState = {
  companySchema: SchemaItem[];
  contactSchema: SchemaItem[];
  leadSchema: SchemaItem[];
  eventSchema: SchemaItem[];
  setSchema: (
    collection: CustomAttributeCollection,
    schema: SchemaItem[]
  ) => void;
};

export const useCustomAttributesStore = create<CustomAttributesState>()(
  devtools(
    persist(
      (set) => ({
        companySchema: [],
        contactSchema: [],
        leadSchema: [],
        eventSchema: [],
        setSchema: (collection, schema) =>
          set((state) => ({ ...state, [`${collection}Schema`]: schema })),
      }),
      {
        name: "custom-attributes-storage",
      }
    )
  )
);
