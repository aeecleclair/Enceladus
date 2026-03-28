import { z } from "zod";

export const substituteFormSchema = z.object({
  substitute: z.boolean({
    required_error: "Veuillez sélectionner votre statut de remplaçant",
  }),
});

export type SubstituteFormValues = z.infer<typeof substituteFormSchema>;
