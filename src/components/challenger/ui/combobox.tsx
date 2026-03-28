"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./command";

interface ComboboxProps {
  values: { value: string; label: string }[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isSearchable?: boolean;
}

export function Combobox({
  values,
  value,
  onChange,
  placeholder,
  isSearchable,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground",
          )}
        >
          <span>
            {value ? values.find((v) => v.value === value)?.label : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          {isSearchable && (
            <>
              <CommandInput placeholder={placeholder} />
              <CommandEmpty>No framework found.</CommandEmpty>
            </>
          )}
          <CommandGroup>
            {values.map((v) => (
              <CommandItem
                key={v.value}
                value={v.value}
                onSelect={(currentValue) => {
                  onChange(currentValue);
                  setOpen(false);
                }}
                className="w-full text-left"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === v.value ? "opacity-100" : "opacity-0",
                  )}
                />
                {v.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
