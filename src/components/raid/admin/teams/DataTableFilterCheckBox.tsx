import { Column } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import { Check } from "lucide-react";

interface DataTableFilterCheckBoxProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
}

export function DataTableFilterCheckBox<TData, TValue>({
  column,
  title,
}: DataTableFilterCheckBoxProps<TData, TValue>) {
  const filterValues = Array.from(new Set(column?.getFilterValue() as null[]));
  const isSelected = filterValues.length > 0;

  const toggleValue = () => {
    const nextValues = new Set(column?.getFilterValue() as null[]);
    if (isSelected) {
      nextValues.delete(null);
    } else {
      nextValues.add(null);
    }
    const updatedValues = Array.from(nextValues);
    column?.setFilterValue(updatedValues.length ? updatedValues : undefined);
  };

  return (
    <Button
      variant="ghost"
      className="h-8 border-dashed border"
      onClick={toggleValue}
    >
      <span
        aria-hidden
        className={`mr-2 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border ${isSelected ? "bg-primary text-primary-foreground border-primary" : "border-input dark:bg-input/30"}`}
      >
        {isSelected && <Check className="h-3 w-3" />}
      </span>
      {title}
    </Button>
  );
}
