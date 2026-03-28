import { z } from "zod";

const schoolType = ["centrale", "from_lyon", "others", "none"] as const;
const publicType = [
  "pompom",
  "fanfare",
  "cameraman",
  "athlete",
  "volunteer",
  "none",
] as const;

export const variantFormSchema = z.object({
  name: z
    .string({
      required_error: "Veuillez renseigner le nom de la variante",
    })
    .min(1, {
      message: "Veuillez renseigner le nom de la variante",
    }),
  description: z.string().optional(),
  price: z
    .string({
      required_error: "Veuillez renseigner le prix du produit",
    })
    .min(0, {
      message: "Veuillez renseigner le prix du produit",
    }),
  unique: z.enum(["unique", "multiple"], {
    required_error: "Veuillez renseigner la quantité du produit",
  }),
  enabled: z.boolean().optional(),
  schoolType: z.enum(schoolType).optional(),
  publicType: z.enum(publicType).optional(),
});

export type VariantFormValues = z.infer<typeof variantFormSchema>;
