import { z } from "zod";

export const teamResultSchema = z.object({
  school_id: z.string().uuid("ID d'école invalide"),
  sport_id: z.string().uuid("ID de sport invalide"),
  team_id: z.string().uuid("ID d'équipe invalide"),
  points: z.number().min(0, "Les points doivent être positifs"),
});

export const podiumRankingsSchema = z.object({
  rankings: z.array(teamResultSchema).min(1, "Au moins un résultat est requis"),
});

export type TeamResultFormData = z.infer<typeof teamResultSchema>;
export type PodiumRankingsFormData = z.infer<typeof podiumRankingsSchema>;
