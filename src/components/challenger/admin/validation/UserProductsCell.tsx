"use client";

import {
  AppModulesSportCompetitionSchemasSportCompetitionProductComplete,
  AppModulesSportCompetitionSchemasSportCompetitionProductVariantComplete,
  ProductVariantStats,
} from "@/src/api/hyperionSchemas";
import { Badge } from "@/src/components/ui/badge";

export type RequiredPurchase = Array<{
  product_variant_id: string;
  quantity: number;
  validated: boolean;
  variant?: ProductVariantStats;
  product?: AppModulesSportCompetitionSchemasSportCompetitionProductComplete;
}>;
interface UserProductsCellProps {
  requiredPurchases?: RequiredPurchase;
}

export const UserProductsCell = ({
  requiredPurchases,
}: UserProductsCellProps) => {
  if (!requiredPurchases) {
    return (
      <div className="text-center text-muted-foreground text-sm">
        Chargement...
      </div>
    );
  }

  if (requiredPurchases.length === 0) {
    return (
      <div className="text-center text-muted-foreground text-sm">Aucun</div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {requiredPurchases.map((purchase) => (
        <div
          key={purchase.product_variant_id}
          className="flex items-center gap-2"
        >
          <div className="text-sm">
            {purchase.validated ? (
              <span className="text-muted-foreground">✓</span>
            ) : (
              <span className="text-muted-foreground">✗</span>
            )}{" "}
            <span className="font-medium">
              {purchase.variant
                ? purchase.variant.name
                : purchase.product?.name}
            </span>
            {purchase.quantity > 1 && (
              <span className="text-muted-foreground">
                {" "}
                x{purchase.quantity}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
