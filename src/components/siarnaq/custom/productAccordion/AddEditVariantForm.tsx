import { MultiSelect } from "../MultiSelect";
import { StyledFormField } from "../StyledFormField";

import { LoadingButton } from "@/components/common/LoadingButton";
import _variantFormSchema from "@/forms/siarnaq/variantFormSchema";
import { useCurriculums } from "@/hooks/siarnaq/useCurriculums";

import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PriceInput } from "@/components/ui/priceInput";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

interface AddEditVariantFormProps {
  form: UseFormReturn<z.infer<ReturnType<typeof _variantFormSchema>>>;
  isLoading: boolean;
  setIsOpened: (value: boolean) => void;
  isEdit?: boolean;
  isInterestProduct?: boolean;
  isMembershipProduct?: boolean;
}

export const AddEditVariantForm = ({
  form,
  isLoading,
  setIsOpened,
  isEdit = false,
  isInterestProduct = false,
  isMembershipProduct = false,
}: AddEditVariantFormProps) => {
  const t = useTranslations("siarnaq");
  const { curriculums } = useCurriculums();

  function closeDialog(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setIsOpened(false);
  }
  return (
    <div className="grid gap-6 mt-4">
      <div className="flex flex-row gap-2 w-full">
        <StyledFormField
          form={form}
          label={t("addEditVariantForm.name_fr")}
          id="name_fr"
          input={(field) => <Input {...field} />}
        />
        <StyledFormField
          form={form}
          label={t("addEditVariantForm.name_en")}
          id="name_en"
          input={(field) => <Input {...field} />}
        />
      </div>
      <div className="flex flex-row gap-2">
        <StyledFormField
          form={form}
          label={t("addEditVariantForm.description_fr")}
          id="description_fr"
          input={(field) => <Textarea {...field} />}
        />
        <StyledFormField
          form={form}
          label={t("addEditVariantForm.description_en")}
          id="description_en"
          input={(field) => <Textarea {...field} />}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {!isInterestProduct && (
          <StyledFormField
            form={form}
            label={t("addEditVariantForm.price")}
            id="price"
            input={(field) => (
              <PriceInput id="price" {...field} allowNegativeValue />
            )}
          />
        )}
        <StyledFormField
          form={form}
          label={t("addEditVariantForm.allowed_curriculum")}
          id="allowed_curriculum"
          input={(field) => (
            <MultiSelect
              options={curriculums.map((curriculum) => ({
                label: curriculum.name,
                value: curriculum.id,
              }))}
              selected={field.value}
              {...field}
              className="w-64"
            />
          )}
        />
      </div>
      {isMembershipProduct && (
        <div className="grid gap-2">
          <StyledFormField
            form={form}
            label={t("addEditVariantForm.related_membership_added_duration")}
            id="related_membership_added_duration"
            input={(field) => <Input {...field} />}
          />
        </div>
      )}
      {!isInterestProduct && !isMembershipProduct && (
        <div className="grid gap-2">
          <StyledFormField
            form={form}
            label={t("addEditVariantForm.purchase")}
            id="unique"
            input={(field) => (
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unique" id="unique" />
                  <Label htmlFor="unique">
                    {t("addEditVariantForm.unique")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="multiple" id="multiple" />
                  <Label htmlFor="multiple">
                    {t("addEditVariantForm.multiple")}
                  </Label>
                </div>
              </RadioGroup>
            )}
          />
        </div>
      )}
      <div className="flex justify-end mt-2 space-x-4">
        <Button
          variant="outline"
          onClick={closeDialog}
          disabled={isLoading}
          className="w-25"
        >
          {t("addEditVariantForm.cancel")}
        </Button>
        <LoadingButton isLoading={isLoading} className="w-25" type="submit">
          {isEdit ? t("addEditVariantForm.edit") : t("addEditVariantForm.add")}
        </LoadingButton>
      </div>
    </div>
  );
};
