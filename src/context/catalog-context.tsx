import { create } from "zustand";

type CatalogState = {
  catalogData: {
    id: string;
    name: string;
    jsonSchema: Record<string, any>;
    jsonData: Record<string, any>[];
  };
  setCatalog: (catalog: CatalogState["catalogData"]) => void;
};

export const useCatalogStore = create<CatalogState>()((set) => ({
  catalogData: {
    id: "",
    name: "",
    jsonSchema: {},
    jsonData: [],
  },
  setCatalog: (catalog) => set({ catalogData: catalog }),
}));
