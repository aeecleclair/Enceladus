import { routing } from "./routing";

import { Formats, hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

export const formats = {
  number: {
    euro: {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 2,
    },
  },
} satisfies Formats;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  return {
    locale,
    messages: {
      common: (await import(`../translations/${locale}/common.json`)).default,
      pmf: (await import(`../translations/${locale}/pmf.json`)).default,
      siarnaq: (await import(`../translations/${locale}/siarnaq.json`)).default,
      raid: (await import(`../translations/${locale}/raid.json`)).default,
      sg: (await import(`../translations/${locale}/sg.json`)).default,
    },
    formats,
  };
});
