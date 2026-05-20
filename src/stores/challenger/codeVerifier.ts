import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface codeVerifierStore {
  codeVerifier?: string;
  setCodeVerifier: (codeVerifier?: string) => void;
  resetCodeVerifier: () => void;
  isLoading: boolean;
}

export const useCodeVerifierStore = create<codeVerifierStore>()(
  devtools(
    persist(
      (set) => ({
        codeVerifier: undefined,
        setCodeVerifier: (codeVerifier?: string) => {
          set({ codeVerifier: codeVerifier, isLoading: true });
        },
        resetCodeVerifier: () => {
          set({ codeVerifier: undefined, isLoading: false });
        },
        isLoading: false,
      }),
      {
        name: "raid-code-verifier-storage",
      },
    ),
  ),
);
