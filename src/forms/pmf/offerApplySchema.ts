import z from "zod";

export default function offerApplySchema(
) {
    return z.object({
        CV: z.string().nullable(),
        motivation: z.string(),
    })
}
