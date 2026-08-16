import { formats } from "@/i18n/request";
import { routing } from "@/i18n/routing";
import challenger from "@/translations/fr/challenger.json";
import common from "@/translations/fr/common.json";
import myDocuments from "@/translations/fr/myDocuments.json";
import pmf from "@/translations/fr/pmf.json";
import raid from "@/translations/fr/raid.json";
import siarnaq from "@/translations/fr/siarnaq.json";
import template from "@/translations/fr/template.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];

    Messages: {
      challenger: typeof challenger;
      common: typeof common;
      myDocuments: typeof myDocuments;
      pmf: typeof pmf;
      raid: typeof raid;
      siarnaq: typeof siarnaq;
      template: typeof template;
    };

    Formats: typeof formats;
  }
}
