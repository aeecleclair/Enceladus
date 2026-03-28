import { ControllerRenderProps, FieldValues } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

interface StyledFormFieldProps {
  label?: string;
  id: string;
  form: any;
  input: (field: ControllerRenderProps<FieldValues, string>) => React.ReactNode;
  className?: string;
}

export const StyledFormField = ({
  form,
  label,
  id,
  input,
  className = "",
}: StyledFormFieldProps) => {
  return (
    <FormField
      control={form.control}
      name={id}
      render={({ field }) => (
        <FormItem className="w-full">
          <div className={className}>
            <div className="grid gap-2">
              {label ?? <FormLabel>{label}</FormLabel>}
              <FormControl>{input(field)}</FormControl>
              <FormMessage />
            </div>
          </div>
        </FormItem>
      )}
    />
  );
};
