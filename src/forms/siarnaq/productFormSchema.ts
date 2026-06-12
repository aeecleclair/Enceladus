import z from "zod";

export default function productFormSchema(
  t: (key: any, values?: any) => string,
) {
  // useTranslations("productFormSchema") (don't remove!)
  return z
    .object({
      id: z.string().optional(),
      name_fr: z
        .string({
          error: t("nameFR"),
        })
        .min(1, {
          message: t("nameFR"),
        }),
      name_en: z.string().optional(), // still optional?
      description_fr: z.string().optional(),
      description_en: z.string().optional(),
      related_membership: z.string().optional(),
      available_online: z.enum(["true", "false"], {
        error: t("availableOnline"),
      }),
      data_field_name: z.string().optional(),
      data_field_can_user_answer: z.boolean().optional(),
      data_fields: z.array(
        z.object({
          name: z.string(),
          can_user_answer: z.boolean(),
          id: z.string(),
          product_id: z.string(),
        }),
      ),
      product_constraints: z.array(z.string()),
      document_constraints: z.array(z.string()),
      ticket_name: z.string().optional(),
      ticket_max_use: z
        .string()
        .refine(
          (value) => {
            if (!value) return true;
            const parsedValue = parseInt(value);
            return !isNaN(parsedValue) && parsedValue >= 1;
          },
          { message: t("ticketMaxUsePositive") },
        )
        .refine(
          (value) => {
            if (!value) return true;
            const isInt = /^\d+$/.test(value);
            return isInt;
          },
          { message: t("ticketMaxUseInt") },
        )
        .optional(),
      ticket_expiration: z.date().optional(),
      tickets: z.array(
        z.object({
          name: z.string(),
          id: z.string(),
          max_use: z.number(),
          expiration: z.date(),
        }),
      ),
    })
    .superRefine((data, ctx) => {
      if (
        // at least one of the fields is empty AND one is full => incomplete ticket
        (!data.ticket_name ||
          !data.ticket_max_use ||
          !data.ticket_expiration) &&
        (data.ticket_name || data.ticket_expiration)
      ) {
        if (!data.ticket_name)
          ctx.addIssue({
            path: ["ticket_name"],
            code: z.ZodIssueCode.custom,
            message: t("noTicketName"),
          });
        if (!data.ticket_max_use)
          ctx.addIssue({
            path: ["ticket_max_use"],
            code: z.ZodIssueCode.custom,
            message: t("noTicketMaxUse"),
          });
        if (!data.ticket_expiration)
          ctx.addIssue({
            path: ["ticket_expiration"],
            code: z.ZodIssueCode.custom,
            message: t("noTicketExpiration"),
          });
      }
    });
}
