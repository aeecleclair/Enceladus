import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productFormSchema,
  ProductFormValues,
} from "@/forms/challenger/product";
import { useProducts } from "@/hooks/challenger/useProducts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/challenger/custom/LoadingButton";
import { StyledFormField } from "@/components/challenger/custom/StyledFormField";
import { Checkbox } from "@/components/ui/checkbox";

interface AddProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddProductDialog = ({
  isOpen,
  onClose,
}: AddProductDialogProps) => {
  const { createProduct, isCreateLoading } = useProducts();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: ProductFormValues) {
    createProduct(values, () => {
      onClose();
      form.reset();
    });
  }

  function handleClose() {
    if (!isCreateLoading) {
      onClose();
      form.reset();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Créer un nouveau produit</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau produit à votre catalogue. Vous pourrez ensuite
            créer des variantes pour ce produit.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <StyledFormField
              form={form}
              label="Nom du produit"
              id="name"
              input={(field) => (
                <Input
                  placeholder="Ex: T-shirt, Sweat-shirt, Accessoire..."
                  {...field}
                />
              )}
            />

            <StyledFormField
              form={form}
              label="Description"
              id="description"
              input={(field) => (
                <Textarea
                  placeholder="Description du produit (optionnel)"
                  className="min-h-20"
                  {...field}
                />
              )}
            />

            <StyledFormField
              form={form}
              label="Produit obligatoire"
              id="required"
              input={(field) => (
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                  />
                  <span className="text-sm text-muted-foreground">
                    Ce produit doit être sélectionné lors de l&apos;inscription
                  </span>
                </div>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isCreateLoading}
              >
                Annuler
              </Button>
              <LoadingButton type="submit" isLoading={isCreateLoading}>
                Créer le produit
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
