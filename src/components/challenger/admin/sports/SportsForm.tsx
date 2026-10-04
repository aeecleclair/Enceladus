import { LoadingButton } from "@/components/common/LoadingButton";
import { StyledFormField } from "@/components/common/StyledFormField";
import { sportCategories, sportFormSchema } from "@/forms/challenger/sport";

import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SportsFormProps {
  form: UseFormReturn<z.infer<typeof sportFormSchema>>;
  isLoading: boolean;
  onSubmit: (values: z.infer<typeof sportFormSchema>) => void;
  submitLabel: string;
}

export const SportsForm = ({
  form,
  isLoading,
  onSubmit,
  submitLabel,
}: SportsFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <StyledFormField
            form={form}
            label="Nom du sport"
            id="name"
            input={(field) => (
              <Input placeholder="Ex: Football, Basketball, etc." {...field} />
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StyledFormField
              form={form}
              label="Catégorie"
              id="sportCategory"
              input={(field) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {sportCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <StyledFormField
              form={form}
              label="Nombre de titulaires par équipe"
              id="teamSize"
              input={(field) => (
                <Input
                  type="number"
                  min="1"
                  placeholder="Nombre de joueurs"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 1)
                  }
                />
              )}
            />

            <StyledFormField
              form={form}
              label="Nombre de remplaçants max"
              id="substituteMax"
              input={(field) => (
                <Input
                  type="number"
                  min="0"
                  placeholder="Nombre de remplaçants"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 0)
                  }
                />
              )}
            />
          </div>

          <StyledFormField
            form={form}
            label="Sport Actif"
            id="active"
            input={(field) => (
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="active_checkbox"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label
                  className="text-sm text-muted-foreground"
                  htmlFor="active_checkbox"
                >
                  Ce sport peut être utilisé dans la compétition
                </Label>
              </div>
            )}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <LoadingButton type="submit" className="flex-1" isLoading={isLoading}>
            {submitLabel || "Ajouter le sport"}
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};
