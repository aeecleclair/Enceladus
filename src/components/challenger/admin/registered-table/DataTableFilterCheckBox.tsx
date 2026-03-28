import * as React from "react";
import { Column } from "@tanstack/react-table";

import { Checkbox } from "../../ui/checkbox";
import { Button } from "../../ui/button";

interface DataTableFilterCheckBoxProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
}

export function DataTableFilterCheckBox<TData, TValue>({
  column,
  title,
}: DataTableFilterCheckBoxProps<TData, TValue>) {
  // Get the current filter value (true or undefined)
  const filterValue = column?.getFilterValue() as boolean | undefined;
  const isSelected = filterValue === true;

  const toggleValue = () => {
    // Toggle between true and undefined
    column?.setFilterValue(isSelected ? undefined : true);
  };

  // Add a custom filter function to the column if it doesn't already have one
  React.useEffect(() => {
    if (column && !column.getFilterFn()) {
      // @ts-ignore - We know this is a valid filter function
      column.columnDef.filterFn = (row, columnId, filterValue) => {
        const value = row.getValue(columnId);
        // If filter value is true, only show rows where the column value is true
        return filterValue === true ? Boolean(value) === true : true;
      };
    }
  }, [column]);

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
