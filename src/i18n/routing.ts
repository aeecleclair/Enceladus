import { defineRouting } from "next-intl/routing";

export const locales = ["fr", "en"] as const;

export const routing = defineRouting({
  locales: locales,
  defaultLocale: "fr",
  localePrefix: "always",
  localeDetection: false,
});
