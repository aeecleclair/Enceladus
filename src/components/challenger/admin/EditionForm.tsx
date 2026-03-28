"use client";

import { LoadingButton } from "@/src/components/custom/LoadingButton";
import { StyledFormField } from "@/src/components/custom/StyledFormField";
import { Form, FormDescription } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { EditionFormSchema } from "@/src/forms/edition";
import { DatePicker } from "../custom/DatePicker";
import { DateRangePicker } from "../custom/DateRangePicker";

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
  const now = new Date();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <StyledFormField
          form={form}
          label="Nom de l'édition"
          id="name"
          input={(field) => (
            <Input placeholder="Ex: Challenge 2025" {...field} />
          )}
        />

        <div className="space-y-2">
          <DateRangePicker
            startDate={form.getValues("startDate")}
            endDate={form.getValues("endDate")}
            onDateRangeChange={(startDate, endDate) => {
              if (startDate) {
                form.setValue("startDate", startDate, { shouldValidate: true });
              }
              if (endDate) {
                form.setValue("endDate", endDate, { shouldValidate: true });
              }
              // If only start date is selected, clear end date
              if (startDate && !endDate) {
                form.setValue("endDate", undefined as any, {
                  shouldValidate: true,
                });
              }
            }}
            fromDate={now}
            toDate={
              new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
            }
            label="Période de l'édition"
            id="dateRange"
          />
          <FormDescription className="text-sm text-muted-foreground">
            Sélectionnez la date de début, puis la date de fin de l&apos;édition
          </FormDescription>
          {/* Display form validation errors */}
          {form.formState.errors.startDate && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.startDate.message}
            </p>
          )}
          {form.formState.errors.endDate && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.endDate.message}
            </p>
          )}
        </div>

        <LoadingButton
          type="submit"
          className="w-full mt-6"
          isLoading={isLoading}
        >
          {submitLabel}
        </LoadingButton>
      </form>
    </Form>
  );
};

export default EditionForm;
