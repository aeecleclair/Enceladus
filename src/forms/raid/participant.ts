import { z } from "zod";

const sizeEnum = z.enum(["XS", "S", "M", "L", "XL", "None"]);
const situationEnum = z.enum([
  "centrale",
  "otherSchool",
  "corporatePartner",
  "other",
]);

export const participantFormSchema = z
  .object({
    address: z.string().optional().nullable(),
    bike_size: sizeEnum.optional().nullable(),
    t_shirt_size: sizeEnum.optional().nullable(),
    situation: situationEnum.optional().nullable(),
    other_school: z.string().optional().nullable(),
    company: z.string().optional().nullable(),
    diet: z.string().optional().nullable(),
    attestation_on_honour: z.boolean().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.situation === "otherSchool" && !data.other_school) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["other_school"],
        message: "Précisez le nom de votre école",
      });
    }
    if (data.situation === "corporatePartner" && !data.company) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["company"],
        message: "Précisez le nom de votre entreprise",
      });
    }
  });

export type ParticipantFormSchema = z.infer<typeof participantFormSchema>;
