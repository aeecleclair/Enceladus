import z from "zod";

export default function sessionFormSchema() {
  return z.object({
    event_id: z.string(),
    name: z.string().min(1, {
      message: "Le nom de la session en français est requis",
    }),
    quota: z.number().int().nonnegative().optional(),
    user_quota: z.number().int().nonnegative().optional(),
    date: z.date(),
  });
}

export type SessionFormValues = z.infer<ReturnType<typeof sessionFormSchema>>;