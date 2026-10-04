import { StyledFormField } from "../../../common/StyledFormField";

import { AppModulesSportCompetitionSchemasSportCompetitionProductVariantComplete } from "@/api";
import { EditProductValues } from "@/forms/challenger/editProducts";
import { RegisteringFormValues } from "@/forms/challenger/registering";
import { useAvailableProducts } from "@/hooks/challenger/useAvailableProducts";

import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PackageCardProps {
  form: UseFormReturn<EditProductValues | RegisteringFormValues>;
}

export const BasketCard = ({ form }: PackageCardProps) => {
  const { availableProducts } = useAvailableProducts();
  const purchases = form.watch("products");
  const ids = purchases.map((purchase) => purchase.product_variant.id);

  const groupedByProductId: Record<
    string,
    AppModulesSportCompetitionSchemasSportCompetitionProductVariantComplete[]
  > = {};
  availableProducts?.forEach((product) => {
    if (product.enabled !== true) return;
    // Exclude volunteer-only products from the registration basket
    if (product.public_type === "volunteer") return;
    if (!groupedByProductId[product.product_id]) {
      groupedByProductId[product.product_id] = [];
    }
    groupedByProductId[product.product_id].push(product);
  });

  const selectedVariantsPerProduct: Record<string, string[]> = {};
  Object.entries(groupedByProductId).forEach(
    ([productId, product_variants]) => {
      selectedVariantsPerProduct[productId] = product_variants
        .filter((product) => ids.includes(product.id))
        .map((product) => product.id);
    },
  );

  // Check if at least one required product is selected
  const requiredProducts = Object.entries(groupedByProductId).filter(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_, products]) => products[0].product.required,
  );
  const hasRequiredProductSelected = requiredProducts.some(
    ([productId]) =>
      selectedVariantsPerProduct[productId] &&
      selectedVariantsPerProduct[productId].length > 0,
  );

  // Set form error if no required products are selected
  useEffect(() => {
    if (requiredProducts.length > 0 && !hasRequiredProductSelected) {
      form.setError("products", {
        type: "required",
        message: "Vous devez sélectionner au moins un produit obligatoire",
      });
    } else {
      form.clearErrors("products");
    }
  }, [hasRequiredProductSelected, requiredProducts.length, form]);

  return (availableProducts?.length || 0) === 0 ? (
    <div className="text-xl font-semibold align-center justify-center">
      Chargement...
    </div>
  ) : (
    <div className="space-y-4 overflow-y-auto pr-8 ">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">Ta formule :</h2>
      </div>
      {form.formState.errors.products && (
        <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded p-3">
          {form.formState.errors.products.message}
        </div>
      )}
      {Object.entries(groupedByProductId).map(([productId, products]) => {
        const productVariant = products[0];
        const purchase = purchases.find(
          (p) => p.product_variant.id === productVariant.id,
        );
        return (
          <div
            key={productId}
            className={`${
              productVariant.product.required
                ? "border-2 border-red-200 bg-red-50 rounded-lg p-4"
                : ""
            }`}
          >
            {productVariant.product.required && (
              <div className="mb-2 text-red-600 text-sm font-semibold flex items-center gap-1">
                <span className="text-red-500">⚠️</span> Produit obligatoire
              </div>
            )}
            <StyledFormField
              className={productVariant.product.required ? "text-black" : ""}
              form={form}
              label={`${productVariant.product.name}${productVariant.product.required ? " *" : ""}`}
              id={`products[${productId}]`}
              input={() => (
                <>
                  {products.length > 1 ? (
                    <div className="flex items-center space-x-2 pt-2">
                      {/* <RadioGroup
                        onValueChange={(value) => {
                          const selectedProduct = availableProducts?.find(
                            (product) => product.id === value,
                          );
                          if (!selectedProduct) return;
                          form.setValue("products", [
                            ...purchases.filter(
                              (purchase) =>
                                purchase.product.id !==
                                selectedPerProduct[productId][0],
                            ),
                            {
                              product: selectedProduct,
                              quantity: 1,
                            },
                          ]);
                        }}
                        defaultValue={selectedPerProduct[productId][0] || ""}
                        value={selectedPerProduct[productId][0] || ""}
                      > */}
                      <div className="flex flex-col gap-2">
                        {products.map((variant) => (
                          <div
                            className="flex items-center space-x-2"
                            key={variant.id}
                          >
                            <Checkbox
                              className={
                                productVariant.product.required
                                  ? "border-black"
                                  : ""
                              }
                              defaultChecked={ids.includes(variant.id)}
                              value={variant.id}
                              id={`variant-${variant.id}`}
                              onClick={(e) => {
                                // Allow unselecting for non-required products
                                if (ids.includes(variant.id)) {
                                  form.setValue(
                                    "products",
                                    purchases.filter(
                                      (purchase) =>
                                        purchase.product_variant.id !==
                                        variant.id,
                                    ),
                                  );
                                  return;
                                }
                                form.setValue("products", [
                                  ...purchases.filter(
                                    (purchase) =>
                                      purchase.product_variant.id !==
                                      variant.id,
                                  ),
                                  {
                                    product_variant: variant,
                                    quantity: 1,
                                  },
                                ]);
                              }}
                            />
                            <Label htmlFor={`variant-${variant.id}`}>
                              {variant.name} - {variant.price / 100}€
                            </Label>
                          </div>
                        ))}
                      </div>
                      {/* </RadioGroup> */}
                      <>
                        {!productVariant.unique &&
                          ids.includes(productVariant.id) && (
                            <Input
                              type="number"
                              min={1}
                              value={purchase?.quantity || 1}
                              onChange={(e) => {
                                const value = Math.max(
                                  1,
                                  Math.min(99, Number(e.target.value)),
                                );
                                form.setValue(
                                  "products",
                                  purchases.map((p) =>
                                    p.product_variant.id === productVariant.id
                                      ? { ...p, quantity: value }
                                      : p,
                                  ),
                                );
                              }}
                              className="ml-2 w-16"
                            />
                          )}
                      </>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox
                        className={
                          productVariant.product.required ? "border-black" : ""
                        }
                        id={`products[${productId}]`}
                        value={productVariant.id}
                        checked={ids.includes(productVariant.id)}
                        onCheckedChange={() => {
                          if (ids.includes(productVariant.id)) {
                            form.setValue(
                              "products",
                              purchases.filter(
                                (purchase) =>
                                  purchase.product_variant.id !==
                                  productVariant.id,
                              ),
                            );
                            return;
                          }
                          form.setValue("products", [
                            ...purchases.filter(
                              (purchase) =>
                                purchase.product_variant.id !== productId,
                            ),
                            {
                              product_variant: productVariant,
                              quantity: 1,
                            },
                          ]);
                        }}
                      />
                      <Label htmlFor={`products[${productId}]`}>
                        {productVariant.name} - {productVariant.price / 100}€
                      </Label>
                      {!productVariant.unique &&
                        ids.includes(productVariant.id) && (
                          <Input
                            type="number"
                            min={1}
                            value={purchase?.quantity || 1}
                            onChange={(e) => {
                              const value = Math.max(
                                1,
                                Math.min(99, Number(e.target.value)),
                              );
                              form.setValue(
                                "products",
                                purchases.map((p) =>
                                  p.product_variant.id === productVariant.id
                                    ? { ...p, quantity: value }
                                    : p,
                                ),
                              );
                            }}
                            className="ml-2 w-16"
                          />
                        )}
                    </div>
                  )}
                </>
              )}
            />
          </div>
        );
      })}
    </div>
  );
};
