"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
  showPendingUsers: boolean;
  setShowPendingUsers: (value: boolean) => void;
}

export function DataTableViewOptions<TData>({
  table,
  showPendingUsers,
  setShowPendingUsers,
}: DataTableViewOptionsProps<TData>) {
  const t = useTranslations("siarnaq");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="hidden h-8 lg:flex">
          <MixerHorizontalIcon className="mr-2 h-4 w-4" />
          {t("dataTableViewOptions.parameters")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-45">
        <DropdownMenuLabel>
          {t("dataTableViewOptions.pendingUsers")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={showPendingUsers}
          onCheckedChange={(value) => setShowPendingUsers(!!value)}
        >
          {t("dataTableViewOptions.showPendingUsers")}
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>
          {t("dataTableViewOptions.activateColumns")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide(),
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {t(
                  `dataTableViewOptions.${
                    column.id as
                      | "name"
                      | "firstname"
                      | "nickname"
                      | "curriculum"
                      | "promo"
                      | "account_type"
                  }`,
                )}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
