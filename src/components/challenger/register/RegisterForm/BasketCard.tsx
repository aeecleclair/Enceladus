import { StyledFormField } from "../../custom/StyledFormField";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Label } from "../../ui/label";
import { UseFormReturn } from "react-hook-form";
import { RegisteringFormValues } from "@/src/forms/registering";
import { Checkbox } from "../../ui/checkbox";
import { useAvailableProducts } from "@/src/hooks/useAvailableProducts";
import { AppModulesSportCompetitionSchemasSportCompetitionProductVariantComplete } from "@/src/api/hyperionSchemas";
import { EditProductValues } from "@/src/forms/editProducts";
import { Input } from "../../ui/input";
import { useEffect } from "react";

interface PackageCardProps {
  form: UseFormReturn<EditProductValues | RegisteringFormValues>;
}

export const BasketCard = ({ form }: PackageCardProps) => {
  const { availableProducts } = useAvailableProducts();
  const purchases = form.watch("products");
  const ids = purchases.map((purchase) => purchase.product.id);

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

  const selectedPerProduct: Record<string, string[]> = {};
  Object.entries(groupedByProductId).forEach(([productId, products]) => {
    selectedPerProduct[productId] = products
      .filter((product) => ids.includes(product.id))
      .map((product) => product.id);
  });

  // Check if at least one required product is selected
  const requiredProducts = Object.entries(groupedByProductId).filter(
    ([_, products]) => products[0].product.required,
  );
  const hasRequiredProductSelected = requiredProducts.some(
    ([productId]) =>
      selectedPerProduct[productId] && selectedPerProduct[productId].length > 0,
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
    <div className="space-y-4 overflow-y-auto pr-2">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">Ta formule :</h2>
      </div>
      {form.formState.errors.products && (
        <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 rounded p-3">
          {form.formState.errors.products.message}
        </div>
      )}
      {Object.entries(groupedByProductId).map(([productId, products]) => {
        const product = products[0];
        const purchase = purchases.find((p) => p.product.id === product.id);
        return (
          <div
            key={productId}
            className={`${
              product.product.required
                ? "border-2 border-red-200 bg-red-50 rounded-lg p-4"
                : ""
            }`}
          >
            {product.product.required && (
              <div className="mb-2 text-red-600 text-sm font-semibold flex items-center gap-1">
                <span className="text-red-500">⚠️</span> Produit obligatoire
              </div>
            )}
            <StyledFormField
              className={product.product.required ? "text-black" : ""}
              form={form}
              label={`${product.product.name}${product.product.required ? " *" : ""}`}
              id={`products[${productId}]`}
              input={(field) => (
                <>
                  {products.length > 1 ? (
                    <div className="flex items-center space-x-2 pt-2">
                      <RadioGroup
                        onValueChange={(value) => {
                          form.setValue("products", [
                            ...purchases.filter(
                              (purchase) =>
                                purchase.product.id !==
                                selectedPerProduct[productId][0],
                            ),
                            {
                              product: availableProducts?.find(
                                (product) => product.id === value,
                              )!,
                              quantity: 1,
                            },
                          ]);
                        }}
                        defaultValue={selectedPerProduct[productId][0] || ""}
                        value={selectedPerProduct[productId][0] || ""}
                      >
                        {products.map((variant) => (
                          <div
                            className="flex items-center space-x-2"
                            key={variant.id}
                          >
                            <RadioGroupItem
                              className={
                                product.product.required ? "border-black" : ""
                              }
                              value={variant.id}
                              id={`product-${variant.id}`}
                              onClick={(e) => {
                                // Allow unselecting for non-required products
                                if (
                                  !variant.product.required &&
                                  selectedPerProduct[productId][0] ===
                                    variant.id
                                ) {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  form.setValue(
                                    "products",
                                    purchases.filter(
                                      (purchase) =>
                                        purchase.product.id !== variant.id,
                                    ),
                                  );
                                }
                              }}
                            />
                            <Label htmlFor={`product-${variant.id}`}>
                              {variant.name} - {variant.price / 100}€
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      <>
                        {!product.unique && ids.includes(product.id) && (
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
                                  p.product.id === product.id
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
                          product.product.required ? "border-black" : ""
                        }
                        id={`products[${productId}]`}
                        value={product.id}
                        checked={ids.includes(product.id)}
                        onCheckedChange={() => {
                          if (ids.includes(product.id)) {
                            form.setValue(
                              "products",
                              purchases.filter(
                                (purchase) =>
                                  purchase.product.id !== product.id,
                              ),
                            );
                            return;
                          }
                          form.setValue("products", [
                            ...purchases.filter(
                              (purchase) => purchase.product.id !== productId,
                            ),
                            {
                              product: product,
                              quantity: 1,
                            },
                          ]);
                        }}
                      />
                      <Label htmlFor={`products[${productId}]`}>
                        {product.name} - {product.price / 100}€
                      </Label>
                      {!product.unique && ids.includes(product.id) && (
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
                                p.product.id === product.id
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
