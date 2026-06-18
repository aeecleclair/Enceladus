import {
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface StyledFormFieldProps<
  T extends FieldValues,
  TTransformed extends FieldValues = T,
> {
  label?: string;
  id: string;
  form: UseFormReturn<T, unknown, TTransformed>;
  input: (field: ControllerRenderProps<FieldValues, string>) => React.ReactNode;
  className?: string;
}

export const StyledFormField = <
  T extends FieldValues,
  TTransformed extends FieldValues = T,
>({
  form,
  label,
  id,
  input,
  className = "",
}: StyledFormFieldProps<T, TTransformed>) => {
  return (
    <FormField
      control={form.control}
      name={id as FieldPath<T>}
      render={({ field }) => (
        <FormItem className="w-full">
          <div className={className}>
            <div className="grid gap-2">
              {label ?? <FormLabel>{label}</FormLabel>}
              <FormControl>
                {input(field as ControllerRenderProps<FieldValues, string>)}
              </FormControl>
              <FormMessage />
            </div>
          </div>
        </FormItem>
      )}
    />
  );
};
