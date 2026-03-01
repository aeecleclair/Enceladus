import z from "zod";


export default function eventFormSchema() {
  return z.object({
    id: z.string().optional(),
    store_id: z.string(),
    creator_id: z.string(),
    disabled: z.boolean(),
    name: z.string().min(1, {
      message: "Le nom de l'évènement en français est requis",
    }),
    open_date: z.date(),
    close_date: z.date(),
    quota: z.number().int().positive(),
    user_quota: z.number().int().positive(),
  });
}
