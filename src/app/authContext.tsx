"use client";

import { BodyTokenAuthTokenPost, TokenResponse } from "@/api/types.gen";
import { useWebsite } from "@/hooks/useWebsite";
import { useCodeVerifierStore } from "@/stores/codeVerifier";
import { useTokenStore } from "@/stores/token";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ReactNode, createContext, useContext, useRef, useState } from "react";

import axios from "axios";
import { stringify } from "querystring";

const clientId: string = process.env.NEXT_PUBLIC_CLIENT_ID || "Challenger";
const backUrl: string =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://hyperion.myecl.fr";
const scopes: string[] = ["API"];
const REFRESH_TOKEN_BUFFER = 60;

interface AuthContextValue {
  getTokenFromRequest: () => Promise<void>;
  isLoading: boolean;
  token: string | null;
  refreshToken: string | null;
  isTokenQueried: boolean;
  logout: () => void;
  userId: string | null;
  isTokenExpired: () => boolean;
  login: (code: string, callback?: () => void) => Promise<void>;
  refreshTokens: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { website } = useWebsite();
  const [isLoading, setIsLoading] = useState(false);
  const { token, setToken, refreshToken, setRefreshToken, userId } =
    useTokenStore();
  const [isTokenQueried, setIsTokenQueried] = useState(false);
  const router = useRouter();
  const { codeVerifier, setCodeVerifier, resetCodeVerifier } =
    useCodeVerifierStore();
  const timer = useRef<NodeJS.Timeout | null>(null);
  const redirectUrlHost: string = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${website}/fr/login`;

  function generateRandomString(length: number): string {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;

    const maxUnbiased = Math.floor(256 / charactersLength) * charactersLength;
    let result = "";
    while (result.length < length) {
      const values = crypto.getRandomValues(
        new Uint8Array(length - result.length),
      );
      for (let i = 0; i < values.length && result.length < length; i++) {
        if (values[i] < maxUnbiased) {
          result += characters.charAt(values[i] % charactersLength);
        }
      }
    }
    return result;
  }

  async function hash(code: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(code);

    return await crypto.subtle.digest("SHA-256", data).then((buffer) => {
      const hashedCode = Array.from(new Uint8Array(buffer))
        .map((byte) => String.fromCharCode(byte))
        .join("");
      return btoa(hashedCode).replace(/\+/g, "-").replace(/\//g, "_");
    });
  }

  async function getToken(params: BodyTokenAuthTokenPost) {
    setIsLoading(true);
    const body = stringify(params);
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    };
    try {
      const result = await axios.post(`${backUrl}/auth/token`, body, {
        headers: headers,
      });
      if (result.status != 200) {
        setIsLoading(false);
        return;
      }
      const tokenResponse: TokenResponse = result.data;
      setIsLoading(false);
      setToken(tokenResponse.access_token);
      setRefreshToken(tokenResponse.refresh_token);
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        logout();
      }
    }
  }

  async function refreshTokens(): Promise<string | null> {
    if (isLoading) return null;
    setIsLoading(true);
    if (refreshToken) {
      const params: BodyTokenAuthTokenPost = {
        grant_type: "refresh_token",
        client_id: clientId,
        refresh_token: refreshToken,
      };
      await getToken(params);
      return refreshToken;
    }
    setIsLoading(false);
    return null;
  }

  function isTokenExpired() {
    if (token === null) return true;
    const exp = JSON.parse(atob(token.split(".")[1])).exp;
    const now = Math.floor(Date.now() / 1000);
    return exp < now;
  }

  async function login(code: string, callback?: () => void) {
    if (!codeVerifier || isLoading) {
      return;
    }
    const params: BodyTokenAuthTokenPost = {
      grant_type: "authorization_code",
      client_id: clientId,
      code: code,
      redirect_uri: redirectUrlHost,
      code_verifier: codeVerifier,
    };
    await getToken(params);
    setIsTokenQueried(true);
    if (callback) callback();
    resetCodeVerifier();
  }

  async function getTokenFromRequest() {
    setIsLoading(true);
    const code = generateRandomString(128);
    setCodeVerifier(code);
    const authUrl = `${backUrl}/auth/authorize?client_id=${clientId}&response_type=code&scope=${scopes.join(
      " ",
    )}&redirect_uri=${redirectUrlHost}&code_challenge=${await hash(
      code,
    )}&code_challenge_method=S256`;

    window.location.href = authUrl;
  }

  function logout() {
    setToken(null);
    setRefreshToken(null);
    setIsTokenQueried(false);
    router.replace(`/login`);
  }

  async function getTokenFromStorage(): Promise<string | null> {
    if (isLoading) return null;
    setIsLoading(true);
    if (typeof window === "undefined") {
      setIsLoading(false);
      return null;
    }

    if (token !== null) {
      setIsTokenQueried(true);
    }
    setIsLoading(false);
    return token;
  }

  function lookToRefreshToken() {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    if (token === null) {
      return null;
    }
    const timeToRefreshToken =
      (token ? JSON.parse(atob(token.split(".")[1])).exp : 0) * 1000 -
      Date.now() -
      REFRESH_TOKEN_BUFFER * 1000;

    if (timeToRefreshToken <= 0) {
      refreshTokens();
    } else {
      timer.current = setTimeout(() => {
        refreshTokens();
        timer.current = null;
      }, timeToRefreshToken);
    }
    return token;
  }

  useQuery({
    queryKey: ["lookToRefreshToken"],
    queryFn: () => lookToRefreshToken(),
    retry: 0,
    enabled: token !== null,
    refetchOnMount: false,
  });

  useQuery({
    queryKey: ["getTokenFromStorage"],
    queryFn: () => getTokenFromStorage(),
    retry: 0,
    enabled: token === null,
    refetchOnMount: false,
  });

  const value: AuthContextValue = {
    getTokenFromRequest,
    isLoading,
    token,
    refreshToken,
    isTokenQueried,
    logout,
    userId,
    isTokenExpired,
    login,
    refreshTokens,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth() doit être utilisé dans un <AuthProvider>.");
  }
  return ctx;
}
