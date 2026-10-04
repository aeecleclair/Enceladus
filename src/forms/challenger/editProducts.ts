import { AppModulesSportCompetitionSchemasSportCompetitionProductVariantComplete } from "@/api";

import { z } from "zod";

export const editProductSchema = z.object({
  products: z.array(
    z.object({
      product_variant:
        z.custom<AppModulesSportCompetitionSchemasSportCompetitionProductVariantComplete>(),
      quantity: z.number().min(1),
    }),
  ),
});

export type EditProductValues = z.infer<typeof editProductSchema>;
