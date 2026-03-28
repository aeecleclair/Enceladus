import { z } from "zod";

export const volunteerShiftFormSchema = z
  .object({
    name: z.string().min(1, "Le nom est requis"),
    manager_id: z.string().min(1, "Le responsable est requis"),
    description: z.string().optional(),
    value: z.number().min(0, "La valeur doit être au moins 0"),
    start_time: z.date({
      required_error: "L'heure de début est requise",
      invalid_type_error: "L'heure de début doit être une date valide",
    }),
    end_time: z.date({
      required_error: "L'heure de fin est requise",
      invalid_type_error: "L'heure de fin doit être une date valide",
    }),
    location: z.string(),
    max_volunteers: z
      .number()
      .min(0, "Le nombre maximum de bénévoles doit être au moins 0"),
  })
  .superRefine((data, ctx) => {
    if (data.start_time > data.end_time) {
      ctx.addIssue({
        message: "La date de fin doit être postérieure à la date de début",
        path: ["end_time"],
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type VolunteerShiftFormSchema = z.infer<typeof volunteerShiftFormSchema>;
