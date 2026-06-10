"use client";

import { LoadingButton } from "@/components/common/LoadingButton";
import { DatePicker } from "@/components/common/DatePicker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { EditionFormSchema } from "@/forms/raid/edition";
import { useTranslations } from "next-intl";

interface EditionFormProps {
  form: UseFormReturn<EditionFormSchema>;
  isLoading: boolean;
  onSubmit: (values: EditionFormSchema) => void;
  submitLabel: string;
}

export const EditionForm = ({
  form,
  isLoading,
  onSubmit,
  submitLabel,
}: EditionFormProps) => {
  const t = useTranslations("raid.admin.editions");
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("name")}</FormLabel>
              <FormControl>
                <Input placeholder={t("namePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("startDate")}</FormLabel>
                <FormControl>
                  <DatePicker date={field.value} setDate={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("endDate")}</FormLabel>
                <FormControl>
                  <DatePicker date={field.value} setDate={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="registeringEndDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("registeringEndDate")}</FormLabel>
                <FormControl>
                  <DatePicker date={field.value} setDate={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <LoadingButton isLoading={isLoading} type="submit" className="w-full">
          {submitLabel}
        </LoadingButton>
      </form>
    </Form>
  );
};
