import { z } from "zod";
import { nullableInteger } from "../utils/nullableInterger";

export const sportQuotaFormSchema = z.object({
  participant_quota: nullableInteger(
    "Le quota doit être soit un entier, soit vide",
  ),
  team_quota: nullableInteger("Le quota doit être soit un entier, soit vide"),
});

export type SportQuotaFormValues = z.infer<typeof sportQuotaFormSchema>;
