import { CoreGroupSimple } from "@/api";
import { LoadingButton } from "@/components/common/LoadingButton";
import { StyledFormField } from "@/components/common/StyledFormField";
import { teamFormSchema } from "@/forms/myDocuments/team";

import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TeamsFormProps {
  form: UseFormReturn<z.infer<typeof teamFormSchema>>;
  groups: CoreGroupSimple[];
  isLoading: boolean;
  onSubmit: (values: z.infer<typeof teamFormSchema>) => void;
  submitLabel: string;
}

export const TeamsForm = ({
  form,
  groups,
  isLoading,
  onSubmit,
  submitLabel,
}: TeamsFormProps) => {
  const t = useTranslations("myDocuments");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <StyledFormField
            form={form}
            label={t("team.name")}
            id="name"
            input={(field) => (
              <Input placeholder={t("team.namePlaceholder")} {...field} />
            )}
          />

          <StyledFormField
            form={form}
            label={t("team.group")}
            id="group_id"
            input={(field) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <StyledFormField
            form={form}
            label={t("team.apiKey")}
            id="api_key"
            input={(field) => (
              <Input placeholder={t("team.apiKeyPlaceholder")} {...field} />
            )}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <LoadingButton type="submit" className="flex-1" isLoading={isLoading}>
            {submitLabel || t("team.submit")}
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};
