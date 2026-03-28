import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productFormSchema, ProductFormValues } from "@/src/forms/product";
import { useProducts } from "@/src/hooks/useProducts";
import { AppModulesSportCompetitionSchemasSportCompetitionProductComplete } from "@/src/api/hyperionSchemas";
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
import { Textarea } from "@/src/components/ui/textarea";
import { LoadingButton } from "@/src/components/custom/LoadingButton";
import { StyledFormField } from "@/src/components/custom/StyledFormField";
import { Checkbox } from "../../ui/checkbox";

interface EditProductDialogProps {
  product: AppModulesSportCompetitionSchemasSportCompetitionProductComplete;
  isOpen: boolean;
  onClose: () => void;
}

export const EditProductDialog = ({
  product,
  isOpen,
  onClose,
}: EditProductDialogProps) => {
  const { updateProduct, isUpdateLoading } = useProducts();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    mode: "onBlur",
    defaultValues: {
      name: product.name,
      description: product.description || "",
      required: product.required || false,
    },
  });

  async function onSubmit(values: ProductFormValues) {
    updateProduct(product.id, values, () => {
      onClose();
    });
  }

  function handleClose() {
    if (!isUpdateLoading) {
      onClose();
      form.reset({
        name: product.name,
        description: product.description || "",
        required: product.required || false,
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier le produit</DialogTitle>
          <DialogDescription>
            Modifiez les informations de votre produit.
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
                disabled={isUpdateLoading}
              >
                Annuler
              </Button>
              <LoadingButton type="submit" isLoading={isUpdateLoading}>
                Enregistrer
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
