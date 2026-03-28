import { formats } from "@/i18n/request";
import { routing } from "@/i18n/routing";

import common from "@/translations/fr/common.json";
import pmf from "@/translations/fr/pmf.json";
import siarnaq from "@/translations/fr/siarnaq.json";
import raid from "@/translations/fr/raid.json";
import challenger from "@/translations/fr/challenger.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];

    Messages: {
      common: typeof common;
      pmf: typeof pmf;
      siarnaq: typeof siarnaq;
      raid: typeof raid;
      challenger: typeof challenger;
    };

    Formats: typeof formats;
  }
}
