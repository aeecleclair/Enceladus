import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface EditUserInfoFieldProps<T extends FieldValues> {
  label: string;
  id: FieldPath<T>;
  placeholder?: string;
  form: UseFormReturn<T>;
}

export const EditUserInfoField = <T extends FieldValues>({
  form,
  label,
  id,
  placeholder,
}: EditUserInfoFieldProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={id}
      render={({ field }) => (
        <FormItem>
          <div className="flex flex-col space-y-1.5">
            <FormLabel className="text-left font-bold">{label} :</FormLabel>
            <div>
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
