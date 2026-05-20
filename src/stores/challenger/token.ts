import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

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
          const userId = token
            ? JSON.parse(atob(token.split(".")[1])).sub
            : null;

          set({ token: token, userId: userId });
        },
        setRefreshToken: (refreshToken: string | null) => {
          set({ refreshToken: refreshToken });
        },
      }),
      {
        name: "token-storage",
      },
    ),
  ),
);
