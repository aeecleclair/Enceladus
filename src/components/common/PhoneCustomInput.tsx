import { normalizePhone } from "@/lib/phone";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

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
      countryCodeEditable={false}
      disableDropdown={false}
      specialLabel=""
      placeholder={placeholder}
      containerClass="!w-full"
      inputClass="!flex !h-10 !w-full !rounded-md !border !border-input !bg-background !pl-14 !pr-3 !py-2 !text-sm placeholder:text-muted-foreground focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-ring focus-visible:!ring-offset-2 disabled:!cursor-not-allowed disabled:!opacity-50"
      buttonClass="!rounded-l-md !border-input !bg-background"
      dropdownClass="!z-50 !rounded-md !border !bg-popover !text-popover-foreground !shadow-md"
    />
  );
};
