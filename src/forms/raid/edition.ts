import { z } from "zod";

export const editionFormSchema = z
  .object({
    name: z.string().min(1, "Le nom est requis"),
    startDate: z.date({ message: "La date de début est requise" }),
    endDate: z.date({ message: "La date de fin est requise" }),
    registeringEndDate: z
      .date({ message: "La date de fin d'inscription est requise" })
      .optional(),
    inscriptionEnabled: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.endDate < data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "La date de fin doit être après la date de début",
      });
    }
    if (data.registeringEndDate && data.registeringEndDate > data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["registeringEndDate"],
        message:
          "La fin d'inscription doit être avant ou le jour du début de l'édition",
      });
    }
  });

export type EditionFormSchema = z.infer<typeof editionFormSchema>;
