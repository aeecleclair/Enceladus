import React from "react";
import InputMask from "react-input-mask";
import createNumberMask from "text-mask-addons/dist/createNumberMask";

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

const defaultMaskOptions = {
  prefix: "",
  suffix: "€",
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: " ",
  allowDecimal: true,
  decimalSymbol: ".",
  decimalLimit: 2,
  integerLimit: 7,
  allowNegative: false,
  allowLeadingZeroes: false,
};

export const CurrencyInput = React.forwardRef<
  HTMLInputElement,
  CurrencyInputProps
>(({ value, onChange, id }, ref) => {
  const currencyMask = createNumberMask(defaultMaskOptions);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = event.target.value;
    if (
      event.nativeEvent instanceof InputEvent &&
      event.nativeEvent.data === ","
    ) {
      rawValue += ".";
      const input = event.target as HTMLInputElement;
      const end = input.value.length;
      input.setSelectionRange(end, end);
    }
    const numericValue = rawValue.replace(/[^0-9.]/g, "");
    console.log(numericValue);
    onChange(numericValue);
  };

  return (
    <InputMask
      mask={currencyMask}
      value={value}
      onChange={handleChange}
      id={id}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      inputRef={ref as React.Ref<HTMLInputElement>}
    />
  );
});

CurrencyInput.displayName = "CurrencyInput";
