import { z } from "zod";
import { AppModulesSportCompetitionSchemasSportCompetitionProductVariantComplete } from "@/src/api/hyperionSchemas";
export const editProductSchema = z.object({
  products: z.array(
    z.object({
      product:
        z.custom<AppModulesSportCompetitionSchemasSportCompetitionProductVariantComplete>(),
      quantity: z.number().min(1),
    }),
  ),
});

export type EditProductValues = z.infer<typeof editProductSchema>;
