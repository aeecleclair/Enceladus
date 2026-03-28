import { z } from "zod";

export const purchaseFormSchema = z.object({
  product_variant_id: z
    .string({
      required_error: "Veuillez sélectionner un produit",
    })
    .min(1, {
      message: "Veuillez sélectionner un produit",
    }),
  quantity: z
    .number({
      required_error: "Veuillez renseigner la quantité",
    })
    .min(1, {
      message: "La quantité doit être au moins de 1",
    }),
});

export type PurchaseFormValues = z.infer<typeof purchaseFormSchema>;

export const purchaseEditFormSchema = z.object({
  quantity: z
    .number({
      required_error: "Veuillez renseigner la quantité",
    })
    .min(1, {
      message: "La quantité doit être au moins de 1",
    }),
});

export type PurchaseEditFormValues = z.infer<typeof purchaseEditFormSchema>;
