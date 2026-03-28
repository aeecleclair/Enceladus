import { z } from "zod";
import { nullableInteger } from "../utils/nullableInterger";

export const generalQuotaFormSchema = z.object({
  athlete_quota: nullableInteger(
    "Le quota doit être soit un entier, soit vide",
  ),
  cameraman_quota: nullableInteger(
    "Le quota doit être soit un entier, soit vide",
  ),
  pompom_quota: nullableInteger("Le quota doit être soit un entier, soit vide"),
  fanfare_quota: nullableInteger(
    "Le quota doit être soit un entier, soit vide",
  ),
  athlete_cameraman_quota: nullableInteger(
    "Le quota doit être soit un entier, soit vide",
  ),
  athlete_pompom_quota: nullableInteger(
    "Le quota doit être soit un entier, soit vide",
  ),
  athlete_fanfare_quota: nullableInteger(
    "Le quota doit être soit un entier, soit vide",
  ),
  non_athlete_cameraman_quota: nullableInteger(
    "Le quota doit être soit un entier, soit vide",
  ),
  non_athlete_pompom_quota: nullableInteger(
    "Le quota doit être soit un entier, soit vide",
  ),
  non_athlete_fanfare_quota: nullableInteger(
    "Le quota doit être soit un entier, soit vide",
  ),
});

export type GeneralQuotaFormValues = z.infer<typeof generalQuotaFormSchema>;
