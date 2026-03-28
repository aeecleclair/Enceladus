"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { purchaseFormSchema, PurchaseFormValues } from "@/src/forms/purchase";
import { GetCompetitionProductsResponse } from "@/src/api/hyperionComponents";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Form } from "@/src/components/ui/form";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { LoadingButton } from "@/src/components/custom/LoadingButton";
import { StyledFormField } from "@/src/components/custom/StyledFormField";
import { AlertTriangle } from "lucide-react";

interface AddPurchaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  products: GetCompetitionProductsResponse;
  isUserValidated: boolean;
  onSubmit: (productVariantId: string, quantity: number) => void;
  isLoading: boolean;
}

export const AddPurchaseDialog = ({
  isOpen,
  onClose,
  products,
  isUserValidated,
  onSubmit: onSubmitProp,
  isLoading,
}: AddPurchaseDialogProps) => {
  const form = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseFormSchema),
    mode: "onBlur",
    defaultValues: {
      product_variant_id: "",
      quantity: 1,
    },
  });

  const allVariants = products.flatMap(
    (product) =>
      product.variants?.map((variant) => ({
        ...variant,
        productName: product.name,
      })) || [],
  );

  async function handleSubmit(values: PurchaseFormValues) {
    onSubmitProp(values.product_variant_id, values.quantity);
    form.reset();
  }

  function handleClose() {
    if (!isLoading) {
      onClose();
      form.reset();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un achat</DialogTitle>
          <DialogDescription>
            Ajoutez un achat pour cet utilisateur.
          </DialogDescription>
        </DialogHeader>

        {isUserValidated && (
          <div className="flex items-start gap-3 rounded-md border border-orange-300 bg-orange-50 p-4">
            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-orange-800">
              <p className="font-semibold">Attention</p>
              <p>
                Cet utilisateur est actuellement validé. L&apos;ajout d&apos;un
                achat entraînera sa dé-validation. Vous devrez le re-valider
                après cette opération.
              </p>
            </div>
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <StyledFormField
              form={form}
              label="Produit"
              id="product_variant_id"
              input={(field) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un produit" />
                  </SelectTrigger>
                  <SelectContent>
                    {allVariants.map((variant) => (
                      <SelectItem key={variant.id} value={variant.id}>
                        {variant.productName} — {variant.name} (
                        {(variant.price / 100).toFixed(2)} €)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <StyledFormField
              form={form}
              label="Quantité"
              id="quantity"
              input={(field) => (
                <Input
                  type="number"
                  min={1}
                  placeholder="Quantité"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 1)
                  }
                />
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <LoadingButton type="submit" isLoading={isLoading}>
                Ajouter
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
