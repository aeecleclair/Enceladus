import { z } from "zod";

export const teamFormSchema = z.object({
  name: z.string().min(1, "Le nom de l'équipe est requis"),
  sport_id: z.string().min(1, "Le sport est requis"),
  school_id: z.string().min(1, "L'école est requise"),
  captain_id: z.string().min(1, "Le capitaine est requis"),
});

export type TeamFormValues = z.infer<typeof teamFormSchema>;
