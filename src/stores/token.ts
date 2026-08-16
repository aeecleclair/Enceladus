import Cookies from "js-cookie";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

const hostname = typeof window !== "undefined" ? window.location.hostname : "";

const COOKIE_DOMAIN = (() => {
  if (!hostname) return undefined;
  // Browsers reject Domain cookies for localhost-based hostnames (`.localhost`)
  // and for bare IPs, so scope those to the host only.
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    /^[0-9.]+$/.test(hostname)
  ) {
    return undefined;
  }
  const parts = hostname.split(".");
  if (parts.length < 2) return undefined;
  return "." + parts.slice(1).join(".");
})();

const COOKIE_OPTIONS = {
  ...(COOKIE_DOMAIN ? { domain: COOKIE_DOMAIN } : {}),
  secure:
    typeof window !== "undefined" && window.location.protocol === "https:",
  sameSite: "lax" as const,
  expires: 7,
};

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

function readCookie(key: string): string | null {
  return Cookies.get(key) ?? null;
}

function parseUserId(token: string | null): string | null {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1])).sub;
  } catch {
    return null;
  }
}

export const useTokenStore = create<TokenStore>()(
  devtools(
    persist(
      (set) => ({
        token: readCookie("access_token"),
        refreshToken: readCookie("refresh_token"),
        userId: parseUserId(readCookie("access_token")),

        setToken: (token: string | null) => {
          if (token) {
            Cookies.set("access_token", token, COOKIE_OPTIONS);
            set({ token, userId: parseUserId(token) });
          } else {
            Cookies.remove("access_token", { domain: COOKIE_DOMAIN });
            set({ token: null, userId: null });
          }
        },

        setRefreshToken: (refreshToken: string | null) => {
          if (refreshToken) {
            Cookies.set("refresh_token", refreshToken, COOKIE_OPTIONS);
          } else {
            Cookies.remove("refresh_token", { domain: COOKIE_DOMAIN });
          }
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
