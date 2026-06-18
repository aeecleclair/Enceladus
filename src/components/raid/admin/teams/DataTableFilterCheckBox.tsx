import { Column } from "@tanstack/react-table";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

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
      <Checkbox
        checked={isSelected}
        className="mr-2"
        onCheckedChange={toggleValue}
      />
      {title}
    </Button>
  );
}
