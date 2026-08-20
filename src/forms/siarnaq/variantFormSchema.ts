import { useTranslations } from "next-intl";
import z from "zod";

export default function variantFormSchema(
  t: ReturnType<typeof useTranslations<"siarnaq.variantFormSchema">>,
) {
  // useTranslations("variantFormSchema") (don't remove!)
  return z
    .object({
      name_fr: z
        .string({
          error: t("nameFR"),
        })
        .min(1, {
          message: t("nameFR"),
        }),
      name_en: z.string().optional(),
      description_fr: z.string().optional(),
      description_en: z.string().optional(),
      related_membership_added_duration: z
        .string()
        .regex(/^([0-9]+Y)?([0-9]+M)?([0-9]+D)?$/)
        .optional(),
      price: z.string({
        error: t("price"),
      }),
      unique: z.enum(["unique", "multiple"], {
        error: t("unique"),
      }),
      allowed_curriculum: z.array(z.string(), {
        error: t("allowedCurriculum"),
      }),
      isMembershipProduct: z.boolean(),
    })
    .superRefine((data, ctx) => {
      if (data.isMembershipProduct && !data.related_membership_added_duration) {
        ctx.addIssue({
          path: ["related_membership_added_duration"],
          code: z.ZodIssueCode.custom,
          message: t("relatedMembershipRequired"),
        });
      }
    });
}
