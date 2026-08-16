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
      challenger: (await import(`../translations/${locale}/challenger.json`))
        .default,
      common: (await import(`../translations/${locale}/common.json`)).default,
      myDocuments: (await import(`../translations/${locale}/myDocuments.json`))
        .default,
      pmf: (await import(`../translations/${locale}/pmf.json`)).default,
      raid: (await import(`../translations/${locale}/raid.json`)).default,
      siarnaq: (await import(`../translations/${locale}/siarnaq.json`)).default,
      template: (await import(`../translations/${locale}/template.json`))
        .default,
    },
    formats,
  };
});
