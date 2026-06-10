import { nullableInteger } from "@/lib/challenger/nullableInterger";

import { z } from "zod";

export const sportQuotaFormSchema = z.object({
  participant_quota: nullableInteger(
    "Le quota doit être soit un entier, soit vide",
  ),
  team_quota: nullableInteger("Le quota doit être soit un entier, soit vide"),
});

export type SportQuotaFormValues = z.infer<typeof sportQuotaFormSchema>;
export type SportQuotaFormInput = z.input<typeof sportQuotaFormSchema>;
