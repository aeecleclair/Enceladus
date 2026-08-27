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

const apiDate = (d: Date) => d.toISOString().slice(0, 10);

/**
 * Maps RHF form values to the wire shape expected by RaidEditionBase /
 * RaidEditionEdit. Pass extras (e.g. `active`, `inscription_enabled`) per
 * caller, since they are not tracked by the form.
 */
export const editionFormToBody = (values: EditionFormSchema) => ({
  name: values.name,
  year: values.startDate.getFullYear(),
  start_date: apiDate(values.startDate),
  end_date: apiDate(values.endDate),
  registering_end_date: values.registeringEndDate
    ? apiDate(values.registeringEndDate)
    : null,
});
