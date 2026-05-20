import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface SizeStore {
  size: number;
  setSize: (size: number) => void;
}

export const useSizeStore = create<SizeStore>()(
  devtools(
    persist(
      (set) => ({
        size: 50,
        setSize: (size) => set({ size }),
      }),
      {
        name: "size-store",
      },
    ),
  ),
);
