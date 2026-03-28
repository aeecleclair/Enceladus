"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/src/components/ui/button";
import React, { useMemo } from "react";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/src/components/ui/select";
import { DataTableFacetedFilter } from "../registered-table/DataTableFacetedFilter";
import { DataTableFilterCheckBox } from "../registered-table/DataTableFilterCheckBox";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  sports: {
    label: string;
    value: string;
  }[];
  typeOptions: {
    label: string;
    value: string;
  }[];
  products: {
    label: string;
    value: string;
  }[];
}

export function DataTableToolbar<TData>({
  table,
  typeOptions,
  sports,
  products,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-4">
      <div className="flex flex-1 items-center gap-2 flex-wrap">
        <Input
          placeholder="Rechercher par nom ou email..."
          value={
            (table.getColumn("searchField")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("searchField")?.setFilterValue(event.target.value)
          }
          className="h-8 max-w-sm"
        />

        {table.getColumn("sportName") && (
          <DataTableFacetedFilter
            column={table.getColumn("sportName")}
            title="Sport"
            options={sports}
          />
        )}

        {table.getColumn("participantType") && (
          <DataTableFacetedFilter
            column={table.getColumn("participantType")}
            title="Type"
            options={typeOptions}
          />
        )}

        {table.getColumn("productNames") && products.length > 0 && (
          <DataTableFacetedFilter
            column={table.getColumn("productNames")}
            title="Produits obligatoires"
            options={products}
          />
        )}

        {table.getColumn("isLicenseValid") && (
          <DataTableFilterCheckBox
            column={table.getColumn("isLicenseValid")}
            title="Licence valide"
          />
        )}

        {table.getColumn("isCaptain") && (
          <DataTableFilterCheckBox
            column={table.getColumn("isCaptain")}
            title="Capitaine"
          />
        )}

        {table.getColumn("isSubstitute") && (
          <DataTableFilterCheckBox
            column={table.getColumn("isSubstitute")}
            title="Remplaçant"
          />
        )}

        {table.getColumn("isValidated") && (
          <DataTableFilterCheckBox
            column={table.getColumn("isValidated")}
            title="Inscription validée"
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Supprimer les filtres
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
