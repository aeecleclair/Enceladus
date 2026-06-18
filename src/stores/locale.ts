import { Locale } from "next-intl";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface LocaleStore {
  localeStore: Locale | undefined;
  setLocaleStore: (size: Locale) => void;
}

export const useLocaleStore = create<LocaleStore>()(
  devtools(
    persist(
      (set) => ({
        localeStore: undefined,
        setLocaleStore: (localeStore) => set({ localeStore }),
      }),
      {
        name: "locale-store",
      },
    ),
  ),
);
