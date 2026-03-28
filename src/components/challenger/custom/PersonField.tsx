import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "../ui/form";
import { Input } from "../ui/input";

interface PersonFieldProps {
  label: string;
  id: string;
  placeholder?: string;
  form: any;
}

export const PersonField = ({
  form,
  label,
  id,
  placeholder,
}: PersonFieldProps) => {
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
