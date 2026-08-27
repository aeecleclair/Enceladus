"use client";

import { client } from "@/api/client.gen";
import { useTokenStore } from "@/stores/token";

if (process.env.NEXT_PUBLIC_BACKEND_URL) {
  client.setConfig({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
  });
}

client.interceptors.request.use((options) => {
  const token = useTokenStore.getState().token;
  if (token) {
    if (options.headers instanceof Headers) {
      options.headers.set("Authorization", `Bearer ${token}`);
    }
  }
});

export function AuthInterceptor({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
