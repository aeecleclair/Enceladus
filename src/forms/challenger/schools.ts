import { z } from "zod";

export const schoolFormSchema = z.object({
  schools: z
    .string({
      required_error: "Veuillez renseigner le nom de l'école",
    })
    .uuid("Le format de l'ID de l'école est invalide"),
  fromLyon: z.boolean(),
  active: z.boolean(),
  inscription_enabled: z.boolean(),
});

export type SchoolFormValues = z.infer<typeof schoolFormSchema>;
