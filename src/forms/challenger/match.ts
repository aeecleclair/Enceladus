import { z } from "zod";

export const matchFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  sport_id: z.string().min(1, "Le sport est requis"),
  team1_id: z.string().min(1, "L'équipe 1 est requise"),
  team2_id: z.string().min(1, "L'équipe 2 est requise"),
  date: z.date({
    invalid_type_error: "La date est requise",
    required_error: "La date est requise",
  }),
  location_id: z.string().min(1, "Le lieu est requis"),
  score_team1: z.number().int().optional(),
  score_team2: z.number().int().optional(),
  winner_id: z.string().optional(),
  ended: z.boolean().optional(),
  edition_id: z.string().min(1, "L'édition est requise"),
});

export type MatchFormValues = z.infer<typeof matchFormSchema>;
