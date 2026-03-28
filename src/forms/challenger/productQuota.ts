import { z } from "zod";
import { nullableInteger } from "../utils/nullableInterger";

export const productQuotaFormSchema = z.object({
  quota: nullableInteger("Le quota doit être soit un entier, soit vide"),
});

export type ProductQuotaFormValues = z.infer<typeof productQuotaFormSchema>;
