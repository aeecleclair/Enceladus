import { nullableInteger } from "@/lib/challenger/nullableInterger";

import { z } from "zod";

export const productQuotaFormSchema = z.object({
  quota: nullableInteger("Le quota doit être soit un entier, soit vide"),
});

export type ProductQuotaFormValues = z.infer<typeof productQuotaFormSchema>;
export type ProductQuotaFormInput = z.input<typeof productQuotaFormSchema>;
