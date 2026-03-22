import z from "zod";


export default function eventFormSchema() {
  return z.object({
    organiser_id: z.string(),
    name: z.string().min(1, {
      message: "Le nom de l'évènement en français est requis",
    }),
    open_date: z.date(),
    close_date: z.date().optional(),
    quota: z.number().int().nonnegative().optional(),
    user_quota: z.number().int().nonnegative().optional(),
  });
};


export type EventFormValues = z.infer<ReturnType<typeof eventFormSchema>>;
