import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface productExpansionStore {
  productExpansion: string[];
  loaded: boolean;
  setExpandedProducts: (productIds: string[]) => void;
}

export const useProductExpansionStore = create<productExpansionStore>()(
  devtools(
    persist(
      (set) => ({
        productExpansion: [],
        loaded: true,
        setExpandedProducts: (productIds: string[]) => {
          set((state) => ({
            productExpansion: productIds,
          }));
        },
      }),
      {
        name: "cdr-product-expansion-store",
      },
    ),
  ),
);
