import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

function parseUserId(token: string | null): string | null {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1])).sub;
  } catch {
    return null;
  }
}

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

interface TokenStore {
  token: string | null;
  refreshToken: string | null;
  userId: string | null;
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
}

export const useTokenStore = create<TokenStore>()(
  devtools(
    persist(
      (set) => ({
        token: null,
        refreshToken: null,
        userId: null,

        setToken: (token: string | null) => {
          set({ token, userId: parseUserId(token) });
        },

        setRefreshToken: (refreshToken: string | null) => {
          set({ refreshToken });
        },
      }),
      {
        name: "token-store",
        storage: createJSONStorage(() =>
          typeof window !== "undefined" ? localStorage : noopStorage,
        ),
        partialize: (state) => ({
          token: state.token,
          refreshToken: state.refreshToken,
          userId: state.userId,
        }),
      },
    ),
    { name: "TokenStore" },
  ),
);
