import z from "zod";

export default function sessionFormSchema() {
  return z.object({
    event_id: z.string(),
    name: z.string().min(1, {
      message: "Le nom de la session en français est requis",
    }),
    quota: z.number().int().nonnegative().min(1).nullable(),
    user_quota: z.number().int().nonnegative().min(1).nullable(),
    date: z.date(),
  });
}

export type SessionFormValues = z.infer<ReturnType<typeof sessionFormSchema>>;