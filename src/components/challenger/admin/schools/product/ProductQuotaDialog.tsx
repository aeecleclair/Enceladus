import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SchoolProductQuotaBase,
  SchoolProductQuota,
  Product,
  AppModulesSportCompetitionSchemasSportCompetitionProductComplete,
} from "@/src/api/hyperionSchemas";
import { StyledFormField } from "@/src/components/custom/StyledFormField";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { LoadingButton } from "@/src/components/custom/LoadingButton";
import { Form } from "@/src/components/ui/form";
import { FormItem, FormLabel } from "@/src/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import {
  productQuotaFormSchema,
  ProductQuotaFormValues,
} from "@/src/forms/productQuota";

interface ProductQuotaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ProductQuotaFormValues) => void;
  products?: AppModulesSportCompetitionSchemasSportCompetitionProductComplete[];
  selectedProduct: string | null;
  setSelectedProduct: (productId: string | null) => void;
  existingQuota?: SchoolProductQuotaBase;
  title: string;
  description: string;
  submitLabel: string;
  isLoading: boolean;
}

export function ProductQuotaDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  products,
  selectedProduct,
  setSelectedProduct,
  existingQuota,
  title,
  description,
  submitLabel,
  isLoading,
}: ProductQuotaDialogProps) {
  const quotaForm = useForm<ProductQuotaFormValues>({
    resolver: zodResolver(productQuotaFormSchema),
    defaultValues: {
      quota: undefined,
    },
  });

  useEffect(() => {
    if (existingQuota) {
      quotaForm.reset({
        quota: existingQuota.quota || undefined,
      });
    }
  }, [existingQuota, quotaForm]);

  const handleCancel = () => {
    onOpenChange(false);
    quotaForm.reset();
    setSelectedProduct(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Ajouter un quota
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...quotaForm}>
          <form
            onSubmit={quotaForm.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            {selectedProduct ? (
              <FormItem className="w-full">
                <FormLabel>Product</FormLabel>
                <div className="p-2 border rounded-md bg-muted/50">
                  {products?.find((product) => product.id === selectedProduct)
                    ?.name || selectedProduct}
                </div>
              </FormItem>
            ) : (
              <FormItem className="w-full">
                <FormLabel>Produit</FormLabel>
                <Select
                  value={selectedProduct || ""}
                  onValueChange={(value) => setSelectedProduct(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez un product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products?.map((product) => {
                      const hasQuota = !!existingQuota;
                      if (!hasQuota) {
                        return (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        );
                      }
                      return null;
                    })}
                  </SelectContent>
                </Select>
              </FormItem>
            )}

            <StyledFormField
              form={quotaForm}
              label="Quota"
              id="quota"
              input={(field) => (
                <Input
                  type="number"
                  min="0"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
              <LoadingButton type="submit" isLoading={isLoading}>
                {submitLabel}
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
