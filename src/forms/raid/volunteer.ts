import { z } from "zod";

export const volunteerFormSchema = z
  .object({
    diet: z.string().optional().nullable(),
    allergy: z.string().optional().nullable(),
    has_car: z.boolean(),
    car_seats: z.coerce.number().int().min(0).optional().nullable(),
    is_special_driver: z.boolean(),
    is_utility_vehicle_driver: z.boolean(),
    is_parcours_helper: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.has_car && (data.car_seats == null || data.car_seats <= 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["car_seats"],
        message: "Indiquez le nombre de places disponibles",
      });
    }
  });

export type VolunteerFormSchema = z.infer<typeof volunteerFormSchema>;
