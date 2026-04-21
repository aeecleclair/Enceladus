import { CoreSchool } from "@/api";
import { LoadingButton } from "@/components/common/LoadingButton";
import { StyledFormField } from "@/components/common/StyledFormField";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SchoolFormValues } from "@/forms/challenger/schools";
import { formatSchoolName } from "@/lib/challenger/schoolFormatting";
import { UseFormReturn } from "react-hook-form";

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
