"use client";

import { useMemo } from "react";
import { useAvailableProducts } from "@/src/hooks/useAvailableProducts";
import { useUserPurchases } from "@/src/hooks/useUserPurchases";
import { usePayment } from "@/src/hooks/usePayment";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { LoadingButton } from "../../custom/LoadingButton";
import {
  ShoppingBag,
  CreditCard,
  CheckCircle,
  Plus,
  Minus,
} from "lucide-react";
import { AppModulesSportCompetitionSchemasSportCompetitionProductVariantComplete } from "@/src/api/hyperionSchemas";
import { useCompetitionUser } from "@/src/hooks/useCompetitionUser";

export const VolunteerShopTab = () => {
  const { availableProducts } = useAvailableProducts();
  const {
    userMePurchases,
    createPurchase,
    deletePurchase,
    isCreatePurchaseLoading,
    isDeletePurchaseLoading,
    refetchUserMePurchases,
  } = useUserPurchases({ userId: undefined });
  const { getPaymentUrl, isPaymentLoading } = usePayment();
  const { meCompetition } = useCompetitionUser();

  // Filter only volunteer products
  const volunteerProducts = useMemo(
    () =>
      availableProducts?.filter(
        (v) => v.public_type === "volunteer" && v.enabled !== false,
      ) ?? [],
    [availableProducts],
  );

  // Group by product_id
  const grouped = useMemo(() => {
    const map: Record<
      string,
      AppModulesSportCompetitionSchemasSportCompetitionProductVariantComplete[]
    > = {};
    volunteerProducts.forEach((v) => {
      if (!map[v.product_id]) map[v.product_id] = [];
      map[v.product_id].push(v);
    });
    return Object.entries(map);
  }, [volunteerProducts]);

  const getPurchasedVariant = (variantId: string) =>
    userMePurchases?.find((p) => p.product_variant_id === variantId);

  const needPayment =
    userMePurchases &&
    userMePurchases.length > 0 &&
    userMePurchases.reduce((sum, p) => {
      const variant = volunteerProducts?.find(
        (v) => v.id === p.product_variant_id,
      );
      return sum + (variant?.price ?? 0) * p.quantity;
    }, 0) > 0;

  const handlePayment = () => {
    getPaymentUrl((url) => {
      window.open(url, "_blank");
    });
  };

  if (!meCompetition?.is_volunteer)
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Boutique bénévole</h3>
          <p className="text-sm text-muted-foreground text-center">
            Cette boutique est réservée aux bénévoles de l&apos;édition. Pour y
            accéder, inscrivez-vous dans un créneau de bénévolat dans
            l&apos;onglet &quot;Mes Créneaux&quot;.
          </p>
        </CardContent>
      </Card>
    );

  if (volunteerProducts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Boutique bénévole</h3>
          <p className="text-sm text-muted-foreground text-center">
            Aucun produit bénévole disponible pour le moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Boutique bénévole
          </h2>
          <p className="text-sm text-muted-foreground">
            Produits réservés aux bénévoles de l&apos;édition
          </p>
        </div>
        {needPayment && (
          <LoadingButton
            onClick={handlePayment}
            isLoading={isPaymentLoading}
            size="sm"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Payer avec HelloAsso
          </LoadingButton>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {grouped.map(([productId, variants]) => {
          const product = variants[0].product;
          return (
            <Card key={productId}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{product.name}</CardTitle>
                {product.description && (
                  <p className="text-xs text-muted-foreground">
                    {product.description}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                {variants.map((variant) => {
                  const purchase = getPurchasedVariant(variant.id);
                  const isPurchased = !!purchase;
                  return (
                    <div
                      key={variant.id}
                      className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                        isPurchased
                          ? "border-green-200 bg-green-50"
                          : "hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{variant.name}</p>
                          {isPurchased && (
                            <Badge
                              variant="outline"
                              className="text-green-700 border-green-300 text-xs"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Acheté
                              {(purchase?.quantity ?? 1) > 1
                                ? ` (×${purchase?.quantity})`
                                : ""}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {(variant.price / 100).toFixed(2)} €
                        </p>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        {isPurchased ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            disabled={isDeletePurchaseLoading}
                            onClick={() =>
                              deletePurchase(variant.id, refetchUserMePurchases)
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            disabled={isCreatePurchaseLoading}
                            onClick={() =>
                              createPurchase(
                                { product_variant_id: variant.id, quantity: 1 },
                                refetchUserMePurchases,
                              )
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {needPayment && (
        <div className="flex justify-end pt-2">
          <LoadingButton onClick={handlePayment} isLoading={isPaymentLoading}>
            <CreditCard className="mr-2 h-4 w-4" />
            Payer avec HelloAsso
          </LoadingButton>
        </div>
      )}
    </div>
  );
};
