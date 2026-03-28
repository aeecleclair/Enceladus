"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  purchaseEditFormSchema,
  PurchaseEditFormValues,
} from "@/src/forms/purchase";
import { AppModulesSportCompetitionSchemasSportCompetitionPurchaseComplete } from "@/src/api/hyperionSchemas";
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
import { LoadingButton } from "@/src/components/custom/LoadingButton";
import { StyledFormField } from "@/src/components/custom/StyledFormField";

interface EditPurchaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  purchase: AppModulesSportCompetitionSchemasSportCompetitionPurchaseComplete;
  onSubmit: (variantId: string, quantity: number) => void;
  isLoading: boolean;
}

export const EditPurchaseDialog = ({
  isOpen,
  onClose,
  purchase,
  onSubmit: onSubmitProp,
  isLoading,
}: EditPurchaseDialogProps) => {
  const form = useForm<PurchaseEditFormValues>({
    resolver: zodResolver(purchaseEditFormSchema),
    mode: "onBlur",
    defaultValues: {
      quantity: purchase.quantity,
    },
  });

  async function handleSubmit(values: PurchaseEditFormValues) {
    onSubmitProp(purchase.product_variant_id, values.quantity);
    form.reset({ quantity: values.quantity });
  }

  function handleClose() {
    if (!isLoading) {
      onClose();
      form.reset({ quantity: purchase.quantity });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Modifier l&apos;achat</DialogTitle>
          <DialogDescription>
            Modifier la quantité pour{" "}
            <span className="font-semibold">
              {purchase.product_variant.name}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
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
                Enregistrer
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
