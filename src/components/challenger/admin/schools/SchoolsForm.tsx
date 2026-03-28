import { LoadingButton } from "@/src/components/custom/LoadingButton";
import { StyledFormField } from "@/src/components/custom/StyledFormField";
import { Form } from "@/src/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { SchoolFormValues } from "@/src/forms/schools";
import { Checkbox } from "@/src/components/ui/checkbox";
import { CoreSchool } from "@/src/api/hyperionSchemas";
import { Input } from "../../ui/input";

interface SchoolsFormProps {
  form: UseFormReturn<SchoolFormValues>;
  isLoading: boolean;
  onSubmit: (values: SchoolFormValues) => void;
  submitLabel: string;
  schools: CoreSchool[];
  isEdit?: boolean;
}

export const SchoolsForm = ({
  form,
  isLoading,
  onSubmit,
  submitLabel,
  schools,
  isEdit = false,
}: SchoolsFormProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <StyledFormField
            form={form}
            label="Établissement"
            id="schools"
            input={(field) => (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isEdit}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un établissement" />
                </SelectTrigger>
                <SelectContent>
                  {schools &&
                    schools.map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        {formatSchoolName(school.name)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StyledFormField
              form={form}
              label="École Lyonnaise"
              id="fromLyon"
              input={(field) => (
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <span className="text-sm text-muted-foreground">
                    Cette école fait partie du campus lyonnais
                  </span>
                </div>
              )}
            />

            <StyledFormField
              form={form}
              label="École Active"
              id="active"
              input={(field) => (
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <span className="text-sm text-muted-foreground">
                    L&apos;école peut participer à la compétition
                  </span>
                </div>
              )}
            />
          </div>

          <StyledFormField
            form={form}
            label="Inscriptions Ouvertes"
            id="inscription_enabled"
            input={(field) => (
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <span className="text-sm text-muted-foreground">
                  Les étudiants de cette école peuvent s&apos;inscrire
                </span>
              </div>
            )}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <LoadingButton type="submit" className="flex-1" isLoading={isLoading}>
            {submitLabel || "Ajouter l'école"}
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};
