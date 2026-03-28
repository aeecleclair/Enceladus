import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface PhoneCustomInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const PhoneCustomInput = ({
  value,
  onChange,
}: PhoneCustomInputProps) => {
  return (
    <PhoneInput
      value={value}
      onChange={onChange}
      country={"fr"}
      enableSearch
      specialLabel=""
      placeholder="+33 6 06 06 06 06"
      inputClass="flex h-10 w-full border-none bg-background rounded-md px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none focus-visible:ring-[2px] disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-[0px_0px_1px_1px_var(--neutral-700)] group-hover/input:shadow-none transition duration-400 text-black"
      dropdownClass="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
    />
  );
};
