"use client";

import { DataTableViewOptions } from "./DataTableViewOptions";

import { Table } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

export function DataTableToolbar<TData>({
  table,
  globalFilter,
  setGlobalFilter,
}: DataTableToolbarProps<TData>) {
  const t = useTranslations("sg");
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={t("dataTableToolbar.filter")}
          value={globalFilter}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setGlobalFilter(event.target.value)
          }
          className="h-8 w-37.5 lg:w-62.5"
        />
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
