import { useTranslations } from "next-intl";
import z from "zod";

export default function curriculumFormSchema(
  t: ReturnType<typeof useTranslations<"siarnaq.curriculumFormSchema">>,
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
