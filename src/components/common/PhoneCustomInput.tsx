import { normalizePhone } from "@/lib/phone";

import PhoneInput from "react-phone-input-2";

interface PhoneCustomInputProps {
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
}

export const PhoneCustomInput = ({
  value,
  onChange,
  onBlur,
  placeholder = "+33 6 06 06 06 06",
}: PhoneCustomInputProps) => {
  const handleBlur = () => {
    const raw = (value ?? "").trim();
    if (raw) {
      const normalized = normalizePhone(raw);
      if (normalized !== raw) onChange(normalized);
    }
    onBlur?.();
  };

  return (
    <PhoneInput
      value={value}
      onChange={onChange}
      onBlur={handleBlur}
      country={"fr"}
      specialLabel=""
      placeholder={placeholder}
      inputClass="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      dropdownClass="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
    />
  );
};
