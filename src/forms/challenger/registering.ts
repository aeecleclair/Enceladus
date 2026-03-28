import { z } from "zod";
import {
  isValidPhoneNumber,
  parsePhoneNumberWithError,
} from "libphonenumber-js";
import { AppModulesSportCompetitionSchemasSportCompetitionProductVariantComplete } from "@/src/api/hyperionSchemas";

const sexEnum = ["masculine", "feminine"] as const;

export const registeringFormSchema = z
  .object({
    phone: z
      .string({
        required_error: "Veuillez renseigner le numéro de téléphone",
      })
      .refine(
        (value) => isValidPhoneNumber(value, "FR"),
        "Veuillez renseigner un numéro de téléphone valide",
      ),
    is_athlete: z.boolean(),
    is_cameraman: z.boolean(),
    is_fanfare: z.boolean(),
    is_pompom: z.boolean(),
    allow_pictures: z.boolean().default(true),
    sex: z.enum(sexEnum, {
      required_error: "Veuillez sélectionner une option",
    }),
    sport: z
      .object({
        id: z.string({
          required_error: "Veuillez sélectionner un sport",
        }),
        team_id: z.string().optional(),
        license_number: z.string().optional(),
        certificate: z.string().optional(),
        substitute: z.boolean().optional(),
        certificateFile: z
          .any()
          .refine((file) => {
            if (!file) return true;
            const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
            return file.size <= maxSizeInBytes;
          }, "Le fichier doit faire moins de 10MB")
          .refine((file) => {
            if (!file) return true;
            const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
            return allowedTypes.includes(file.type);
          }, "Le fichier doit être au format PDF, JPEG ou PNG"),
      })
      .optional(),
    products: z.array(
      z.object({
        product:
          z.custom<AppModulesSportCompetitionSchemasSportCompetitionProductVariantComplete>(),
        quantity: z.number().min(1),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    if (
      !data.is_athlete &&
      !data.is_cameraman &&
      !data.is_fanfare &&
      !data.is_pompom
    ) {
      ctx.addIssue({
        path: ["is_athlete"],
        code: z.ZodIssueCode.custom,
        message: "Veuillez sélectionner au moins un rôle",
      });
    }
  })
  .superRefine((data, ctx) => {
    if (
      [data.is_cameraman, data.is_fanfare, data.is_pompom].filter(Boolean)
        .length > 1
    ) {
      ctx.addIssue({
        path: ["is_athlete"],
        code: z.ZodIssueCode.custom,
        message: "Vous ne pouvez pas sélectionner plusieurs rôles non sportifs",
      });
    }
  })
  .superRefine((data, ctx) => {
    if (data.is_athlete && !data.sport) {
      ctx.addIssue({
        path: ["sport"],
        code: z.ZodIssueCode.custom,
        message: "Veuillez renseigner les informations sportives",
      });
    }
  });

export type RegisteringFormValues = z.infer<typeof registeringFormSchema>;
