"use client";

import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { DataTableViewOptions } from "./DataTableViewOptions";

import { AccountType } from "@/api";
import { AddUserWithCurriculum } from "@/components/siarnaq/custom/User/AddUserWithCurriculum";
import { useCurriculums } from "@/hooks/siarnaq/useCurriculums";

import { Table } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { Input } from "@/components/ui/input";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  accountTypes: AccountType[];
}

export function DataTableToolbar<TData>({
  table,
  globalFilter,
  setGlobalFilter,
  accountTypes,
}: DataTableToolbarProps<TData>) {
  const t = useTranslations("siarnaq");
  const { curriculums } = useCurriculums();
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
        {table.getColumn("curriculum") && (
          <DataTableFacetedFilter
            column={table.getColumn("curriculum")}
            title={t("dataTableToolbar.curriculum")}
            options={(
              curriculums.map((curriculum) => ({
                value: curriculum.id,
                label: curriculum.name,
              })) as { value: string; label: string }[]
            ).concat({
              value: "",
              label: t("dataTableToolbar.noCurriculum"),
            })}
          />
        )}
        {table.getColumn("account_type") && (
          <DataTableFacetedFilter
            column={table.getColumn("account_type")}
            title={t("dataTableToolbar.accountType")}
            options={accountTypes.map((accountType) => ({
              value: accountType,
              label: t(`accountType.${accountType}`),
            }))}
          />
        )}
        <AddUserWithCurriculum />
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
