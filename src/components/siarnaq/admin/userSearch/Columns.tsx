"use client";

import { DataTableColumnHeader } from "./DataTableColumnHeader";

import { AccountType, CdrUserPreview, CurriculumComplete } from "@/api";
import { fuzzySort } from "@/lib/utils";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";

// Account types excluded from the student search by default: students from
// other schools are not relevant to most CDR searches. The set of all possible
// account types isn't hardcoded here — it's derived from whichever types are
// actually present in the loaded users, so new account types don't require a
// code change to show up.
export const DEFAULT_EXCLUDED_ACCOUNT_TYPES: AccountType[] = [
  "other_school_student",
];

const AccountTypeCell = ({ accountType }: { accountType: AccountType }) => {
  const t = useTranslations("siarnaq");
  return <Badge variant="outline">{t(`accountType.${accountType}`)}</Badge>;
};

export const columns: ColumnDef<CdrUserPreview>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="name" />
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
    enableSorting: false,
    filterFn: "fuzzy", //using our custom fuzzy filter function
    // filterFn: fuzzyFilter, //or just define with the function
    sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
  },
  {
    accessorKey: "firstname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="firstname" />
    ),
    cell: ({ row }) => <div>{row.getValue("firstname")}</div>,
    enableSorting: false,
    filterFn: "fuzzy", //using our custom fuzzy filter function
    // filterFn: fuzzyFilter, //or just define with the function
    sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
  },
  {
    accessorKey: "nickname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="nickname" />
    ),
    cell: ({ row }) => <div>{row.getValue("nickname")}</div>,
    enableSorting: false,
    filterFn: "fuzzy", //using our custom fuzzy filter function
    // filterFn: fuzzyFilter, //or just define with the function
    sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
  },
  {
    accessorKey: "curriculum",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="curriculum" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Badge variant="outline">
          {row.getValue("curriculum") && row.getValue("curriculum") !== ""
            ? (row.getValue("curriculum") as CurriculumComplete).name
            : " — "}
        </Badge>
      </div>
    ),
    filterFn: (row, id, value) => {
      if (!row.getValue(id)) return value.includes("");
      return value.includes((row.getValue(id) as CurriculumComplete).id);
    },
  },
  {
    accessorKey: "promo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="promo" />
    ),
    cell: ({ row }) => <div>{row.getValue("promo")}</div>,
  },
  {
    accessorKey: "account_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="accountType" />
    ),
    cell: ({ row }) => (
      <AccountTypeCell accountType={row.getValue("account_type")} />
    ),
    enableSorting: false,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
];
