import z from "zod";

export default function categoryFormSchema() {
    return z.object({
        event_id: z.string(),
        name: z.string().min(1, {
            message: "Le nom de la catégorie en français est requis",
        }),
        quota: z.number().int().nonnegative().optional(),
        user_quota: z.number().int().nonnegative().optional(),
        price: z.number().positive(),
        disabled: z.boolean(),
        linked_sessions: z.array(z.string()).optional(),
        required_membership: z.string().optional(),
    });
}