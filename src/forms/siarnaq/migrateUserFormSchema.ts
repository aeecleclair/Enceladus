import { useCoreVariables } from "@/hooks/useCoreVariables";

import z from "zod";

import { isValidPhoneNumber } from "libphonenumber-js";

// const validEmailRegex = /^[\w\-.]*@etu(-enise)?\.ec-lyon\.fr$/;

export default function migrateUserFormSchema(
  t: (key: any, values?: any) => string,
) {
  const { variables } = useCoreVariables();
  // useTranslations("migrateUserFormSchema") (don't remove!)
  return z.object({
    nickname: z.string().optional(),
    email: z
      .string()
      .email({
        message: t("email"),
      })
      // .refine((email) => validEmailRegex.test(email), {
      //   message: "Veuillez renseigner un email de Centrale",
      // })
      .optional(),
    floor: variables?.main_activation_form.floor_choices
      ? z.enum(variables?.main_activation_form.floor_choices).optional()
      : z.string().optional(),
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
          const parsedValue = parseInt(value);
          return !isNaN(parsedValue) && parsedValue >= 0;
        },
        { message: t("promo") },
      )
      .optional(),
  });
}
