"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { HiTrash } from "react-icons/hi2";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MergeIcon, UserRoundMinusIcon } from "lucide-react";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const t = useTranslations("siarnaq");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">{t("dataTableRowActions.openMenu")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-45">
        {row.getValue("second") === null ? (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              row.toggleSelected(!row.getIsSelected());
            }}
          >
            {row.getIsSelected()
              ? t("dataTableRowActions.cancelMerge")
              : t("dataTableRowActions.mergeWithTeam")}
            <DropdownMenuShortcut>
              <MergeIcon className="h-4 w-4" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {t("dataTableRowActions.removeMember")}
            <DropdownMenuShortcut>
              <UserRoundMinusIcon className="h-4 w-4" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {t("dataTableRowActions.deleteTeam")}
          <DropdownMenuShortcut>
            <HiTrash className="h-4 w-4" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
