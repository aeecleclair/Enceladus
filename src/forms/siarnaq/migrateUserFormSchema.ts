import { useTranslations } from "next-intl";
import z from "zod";

import { isValidPhoneNumber } from "libphonenumber-js";

export default function migrateUserFormSchema(
  t: ReturnType<typeof useTranslations<"siarnaq.migrateUserFormSchema">>,
) {
  // useTranslations("migrateUserFormSchema") (don't remove!)
  return z.object({
    nickname: z.string().optional(),
    email: z
      .email({
        message: t("email"),
      })
      .optional(),
    floor: z.string().optional(),
    birthday: z.date().optional(),
    phone: z
      .string()
      .refine((value) => isValidPhoneNumber("+" + value), {
        message: t("phone"),
      })
      .optional(),
    promo: z
      .string()
      .refine(
        (value) => {
          if (value === "null") return true;
          const parsedValue = parseInt(value);
          return !isNaN(parsedValue) && parsedValue >= 0;
        },
        { message: t("promo") },
      )
      .optional(),
  });
}
