import { Messages } from "next-intl";
import z from "zod";

export default function curriculumFormSchema(
  t: (key: any, values?: any) => string,
) {
  // useTranslations("curriculumFormSchema") (don't remove!)
  return z.object({
    name: z
      .string({
        error: t("name"),
      })
      .min(1, {
        message: t("name"),
      }),
  });
}
