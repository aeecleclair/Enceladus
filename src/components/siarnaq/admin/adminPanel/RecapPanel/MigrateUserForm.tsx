import { LoadingButton } from "@/components/common/LoadingButton";
import { StyledFormField } from "@/components/siarnaq/custom/StyledFormField";
import _migrateUserFormSchema from "@/forms/siarnaq/migrateUserFormSchema";
import { useYear } from "@/hooks/siarnaq/useYear";
import { useCoreVariables } from "@/hooks/useCoreVariables";

import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MigrateUserFormProps {
  form: UseFormReturn<z.infer<ReturnType<typeof _migrateUserFormSchema>>>;
  isLoading: boolean;
  setIsOpened: (value: boolean) => void;
  closeDialog: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const MigrateUserForm = ({
  form,
  isLoading,
  closeDialog,
}: MigrateUserFormProps) => {
  const { year } = useYear();
  const possiblePromos = Array.from({ length: 5 }).map((_, index) => {
    return (year - index).toString();
  });

  const t = useTranslations("siarnaq");

  const { variables } = useCoreVariables();

  return (
    <div className="grid gap-6 mt-4">
      <StyledFormField
        form={form}
        label={t("migrateUserForm.nickname")}
        id="nickname"
        input={(field) => <Input {...field} />}
      />
      <StyledFormField
        form={form}
        label={t("migrateUserForm.eclEmail")}
        id="email"
        input={(field) => <Input {...field} type="email" />}
      />
      <div className="flex flex-row gap-2 w-full">
        <StyledFormField
          form={form}
          label={t("migrateUserForm.floor")}
          id="floor"
          input={(field) =>
            variables?.main_activation_form.floor_choices ? (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="top">
                  {variables?.main_activation_form.floor_choices.map(
                    (floor) => (
                      <SelectItem key={floor} value={floor}>
                        <div className="flex items-center flex-row gap-2">
                          {floor}
                        </div>
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            ) : (
              <Input {...field} />
            )
          }
        />
        {
          <StyledFormField
            form={form}
            label="Promo"
            id="promo"
            input={(field) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="top">
                  {["null", ...possiblePromos].map((promo) => (
                    <SelectItem key={promo} value={promo}>
                      <div className="flex items-center flex-row gap-2">
                        {promo === "null" ? "Aucune" : `Promotion ${promo}`}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        }
      </div>
      {/* <div className="flex flex-row gap-2 w-full">
        <StyledFormField
          form={form}
          label="Date de naissance"
          id="birthday"
          input={(field) => (
            <DatePicker
              date={field.value}
              setDate={field.onChange}
              defaultDate={field.value || addYears(new Date(), -21)}
            />
          )}
        />

        <StyledFormField
          form={form}
          label="Numéro de téléphone"
          id="phone"
          input={(field) => <PhoneCustomInput {...field} />}
        />
      </div> */}

      <div className="flex justify-end mt-2 space-x-4">
        <Button
          variant="outline"
          onClick={closeDialog}
          disabled={isLoading}
          className="w-25"
        >
          {t("migrateUserForm.cancel")}
        </Button>
        <LoadingButton isLoading={isLoading} className="w-25" type="submit">
          {t("migrateUserForm.edit")}
        </LoadingButton>
      </div>
    </div>
  );
};
