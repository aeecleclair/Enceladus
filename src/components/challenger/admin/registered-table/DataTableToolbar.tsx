"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { DataTableFilterCheckBox } from "./DataTableFilterCheckBox";
import { LoadingButton } from "../../custom/LoadingButton";
import { icons, MergeIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { WarningDialog } from "../../custom/WarningDialog";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filtrer les participants..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("sport") && (
          <DataTableFacetedFilter
            column={table.getColumn("sport")}
            title="Sport"
            options={Array.from(
              table.getColumn("sport")?.getFacetedUniqueValues().keys() ?? [],
            ).map((value) => ({
              value: String(value),
              label: String(value),
              icon: undefined,
            }))}
          />
        )}
        {table.getColumn("license") && (
          <DataTableFilterCheckBox
            column={table.getColumn("license")}
            title="Licence"
          />
        )}
        {table.getColumn("validated") && (
          <DataTableFilterCheckBox
            column={table.getColumn("validated")}
            title="Inscription validée"
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Supprimer
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
