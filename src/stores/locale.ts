import { Locale } from "next-intl";
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

interface LocaleStore {
  localeStore: Locale | undefined;
  setLocaleStore: (size: Locale) => void;
}

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useLocaleStore = create<LocaleStore>()(
  devtools(
    persist(
      (set) => ({
        localeStore: undefined,
        setLocaleStore: (localeStore) => set({ localeStore }),
      }),
      {
        name: "locale-store",
        storage: createJSONStorage(() =>
          typeof window !== "undefined" ? localStorage : noopStorage,
        ),
      },
    ),
  ),
);
