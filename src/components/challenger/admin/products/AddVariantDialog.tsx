import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { variantFormSchema, VariantFormValues } from "@/src/forms/variant";
import { useProducts } from "@/src/hooks/useProducts";
import { AppModulesSportCompetitionSchemasSportCompetitionProductVariantBase } from "@/src/api/hyperionSchemas";
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
import { Checkbox } from "@/src/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { LoadingButton } from "@/src/components/custom/LoadingButton";
import { StyledFormField } from "@/src/components/custom/StyledFormField";
import { CurrencyInput } from "@/src/components/custom/CurrencyInput";

interface AddVariantDialogProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AddVariantDialog = ({
  productId,
  isOpen,
  onClose,
}: AddVariantDialogProps) => {
  const { createVariant, isCreateVariantLoading } = useProducts();

  const form = useForm<VariantFormValues>({
    resolver: zodResolver(variantFormSchema),
    mode: "onBlur",
    defaultValues: {
      enabled: true,
      unique: "multiple",
      publicType: "none",
    },
  });

  const schoolTypes = [
    { value: "none", label: "Toutes écoles" },
    { value: "centrale", label: "Centrale" },
    { value: "from_lyon", label: "De Lyon" },
    { value: "others", label: "Autres" },
  ];

  const publicTypes = [
    { value: "none", label: "Tous" },
    { value: "pompom", label: "Pompom" },
    { value: "fanfare", label: "Fanfare" },
    { value: "cameraman", label: "Cameraman" },
    { value: "athlete", label: "Athlète" },
    { value: "volunteer", label: "Bénévole" },
  ];

  async function onSubmit(values: VariantFormValues) {
    const body: AppModulesSportCompetitionSchemasSportCompetitionProductVariantBase =
      {
        ...values,
        price: Math.round(parseFloat(values.price) * 100),
        unique: values.unique === "unique",
        enabled: values.enabled || true,
        school_type: values.schoolType === "none" ? null : values.schoolType,
        public_type: values.publicType === "none" ? null : values.publicType,
        product_id: productId,
      };

    createVariant(productId, body, () => {
      onClose();
      form.reset();
    });
  }

  function handleClose() {
    if (!isCreateVariantLoading) {
      onClose();
      form.reset();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter une variante</DialogTitle>
          <DialogDescription>
            Créez une nouvelle variante pour ce produit avec ses propres
            caractéristiques et tarif.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <StyledFormField
              form={form}
              label="Nom"
              id="name"
              input={(field) => (
                <Input placeholder="Nom de la variante" {...field} />
              )}
            />

            <StyledFormField
              form={form}
              label="Description"
              id="description"
              input={(field) => (
                <Textarea
                  placeholder="Description (optionnelle)"
                  className="min-h-20"
                  {...field}
                />
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <StyledFormField
                form={form}
                label="Prix"
                id="price"
                input={(field) => <CurrencyInput id="price" {...field} />}
              />

              <StyledFormField
                form={form}
                label="Type d'école"
                id="schoolType"
                input={(field) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un type d'école" />
                    </SelectTrigger>
                    <SelectContent>
                      {schoolTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <StyledFormField
              form={form}
              label="Type de public (optionnel)"
              id="publicType"
              input={(field) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type de public" />
                  </SelectTrigger>
                  <SelectContent>
                    {publicTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <StyledFormField
              form={form}
              label="Achat"
              id="unique"
              input={(field) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unique" id="unique" />
                    <Label htmlFor="unique">
                      Ne peux être acheté qu&apos;une seule fois
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="multiple" id="multiple" />
                    <Label htmlFor="multiple">
                      Peux être acheté autant de fois que souhaité
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />

            <StyledFormField
              form={form}
              label="Activé"
              id="enabled"
              input={(field) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="enabled"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label htmlFor="enabled">
                    Cette variante est activée et disponible à l&apos;achat
                  </Label>
                </div>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isCreateVariantLoading}
              >
                Annuler
              </Button>
              <LoadingButton type="submit" isLoading={isCreateVariantLoading}>
                Ajouter la variante
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
