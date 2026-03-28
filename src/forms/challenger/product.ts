import { z } from "zod";

export const productFormSchema = z.object({
  id: z.string().optional(),
  name: z
    .string({
      required_error: "Veuillez renseigner le nom du produit",
    })
    .min(1, {
      message: "Veuillez renseigner le nom du produit",
    }),
  description: z.string().optional(),
  required: z.boolean().optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
