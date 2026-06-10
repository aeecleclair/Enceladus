import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface productExpansionStore {
  productExpansion: Record<string, string[]>;
  loaded: boolean;
  setExpandedProducts: (sellerId: string, productIds: string[]) => void;
}

export const useProductExpansionStore = create<productExpansionStore>()(
  devtools(
    persist(
      (set) => ({
        productExpansion: {},
        loaded: true,
        setExpandedProducts: (sellerId: string, productIds: string[]) => {
          set((state) => ({
            productExpansion: {
              ...state.productExpansion,
              [sellerId]: productIds,
            },
          }));
        },
      }),
      {
        name: "cdr-product-expansion-store",
      },
    ),
  ),
);
