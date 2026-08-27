"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Keep data fresh for 30s so a child component re-mount does not
            // re-fire the query. Individual hooks can override per-query.
            staleTime: 30_000,
            // Don't ping the API again every time the user alt-tabs.
            refetchOnWindowFocus: false,
            // Don't retry network/HTTP errors by default — most of our 404s
            // are "no record yet" and retrying them is wasteful.
            retry: 0,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
