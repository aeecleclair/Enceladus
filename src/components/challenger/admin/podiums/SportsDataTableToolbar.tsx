"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

interface SportsDataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function SportsDataTableToolbar<TData>({
  table,
}: SportsDataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-4">
      <div className="flex flex-1 items-center gap-2 flex-wrap">
        <Input
          placeholder="Rechercher un sport..."
          value={
            (table.getColumn("searchField")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("searchField")?.setFilterValue(event.target.value)
          }
          className="h-8 max-w-sm"
        />

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Réinitialiser
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
