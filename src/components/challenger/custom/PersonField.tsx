import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PersonFieldProps<T extends FieldValues> {
  label: string;
  id: FieldPath<T>;
  placeholder?: string;
  form: UseFormReturn<T>;
}

export const PersonField = <T extends FieldValues>({
  form,
  label,
  id,
  placeholder,
}: PersonFieldProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={id}
      render={({ field }) => (
        <FormItem>
          <div className="grid grid-cols-5 items-center gap-4">
            <FormLabel className="text-right">{label}</FormLabel>
            <div className="col-span-4">
              <FormMessage />
              <FormControl>
                <Input placeholder={placeholder} {...field} />
              </FormControl>
            </div>
          </div>
        </FormItem>
      )}
    />
  );
};
