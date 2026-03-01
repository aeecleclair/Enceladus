import z from "zod";


export default function offerFormSchema(
) {
    return z.object({
        author_id: z.string(),
        company_name: z.string(),
        title: z.string(),
        description: z.string(),
        offer_type: z.enum(["TFE", 'APP', 'EXE', 'CDI', 'CDD']),
        location: z.string(),
        location_type: z.enum(['On_site', 'Hybrid', 'Remote']),
        start_date: z.date(),
        end_date: z.date(),
        duration: z.number()
    })
}