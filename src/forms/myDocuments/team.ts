import { z } from "zod";

export const teamFormSchema = z.object({
  name: z
    .string({
      error: "Veuillez renseigner le nom de l'équipe",
    })
    .min(1, {
      message: "Veuillez renseigner le nom de l'équipe",
    }),
  api_key: z.string().refine((value) => value.startsWith("api_"), {
    message: "myDocuments.team.invalidApiKey",
  }),
  group_id: z.uuidv4(),
});

export type SportFormValues = z.infer<typeof teamFormSchema>;
