import { z } from "zod";

export const volunteerFormSchema = z
  .object({
    diet: z.string().optional(),
    allergy: z.string().optional(),
    has_car: z.boolean(),
    car_seats: z.number().int().positive().optional(),
    is_special_driver: z.boolean(),
    is_utility_vehicle_driver: z.boolean(),
    is_parcours_helper: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.has_car && data.car_seats == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["car_seats"],
        message: "Indiquez le nombre de places disponibles",
      });
    }
  });

export type VolunteerFormSchema = z.infer<typeof volunteerFormSchema>;
