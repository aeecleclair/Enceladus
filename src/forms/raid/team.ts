import { z } from "zod";

export const teamFormSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom de l'équipe est requis")
    .max(32, "Le nom de l'équipe ne doit pas dépasser 32 caractères"),
  difficulty: z.enum(["discovery", "sports", "expert"]).optional().nullable(),
  meeting_place: z
    .enum(["centrale", "bellecour", "anyway"])
    .optional()
    .nullable(),
});

export type TeamFormSchema = z.infer<typeof teamFormSchema>;
