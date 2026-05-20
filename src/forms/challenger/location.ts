import { z } from "zod";

export const locationSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type LocationFormData = z.infer<typeof locationSchema>;
