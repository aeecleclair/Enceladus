import z from "zod";


export default function eventFormSchema() {
  return z.object({
    organiser_id: z.string(),
    name: z.string().min(1, {
      message: "Le nom de l'évènement en français est requis",
    }),
    open_date: z.date(),
    close_date: z.date().nullable(),
    quota: z.number().int().nonnegative().min(1).nullable(),
    user_quota: z.number().int().nonnegative().min(1).nullable(),
  });
};


export type EventFormValues = z.infer<ReturnType<typeof eventFormSchema>>;
