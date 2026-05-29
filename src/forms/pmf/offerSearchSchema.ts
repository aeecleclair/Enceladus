import z from "zod";


export default function offerSearchSchema(
) {
    return z.object({
        search: z.string(),
        offer_type: z.enum(["TFE", 'APP', 'EXE', 'CDI', 'CDD', 'Any']),
        location: z.string(),
        location_type: z.enum(['On_site', 'Hybrid', 'Remote', 'Any']),
        start_date: z.date(),
        duration: z.number(),
        tags: z.array(z.string())
    })
}