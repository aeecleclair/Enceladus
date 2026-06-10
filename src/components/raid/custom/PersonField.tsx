import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PersonFieldProps {
  label: string;
  id: string;
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
