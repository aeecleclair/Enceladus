"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "../../ui/checkbox";
import { Badge } from "../../ui/badge";
import { DataTableColumnHeader } from "./DataTableColumnHeader";
import { DataTableRowActions } from "./DataTableRowActions";
import { CircularProgressBar } from "../../custom/CircularProgressBar";
import { ProgressBadge } from "../../custom/ProgressBadge";
import { ParticipantInfo, Team } from "@/src/api/hyperionSchemas";

export type Participant = {
  firstname: string;
  name: string;
  sport: string;
  license?: string;
  validated: boolean;
};

export const columns: ColumnDef<Participant>[] = [
  {
    accessorKey: "firstname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prénom" />
    ),
    cell: ({ row }) => <div>{row.getValue("firstname")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom" />
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "sport",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sport" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2 max-lg:hidden">
          <Badge variant="outline">{row.getValue("sport")}</Badge>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "license",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Licence" />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getValue("license") != ""}
        disabled
        className="cursor-not-allowed"
      />
    ),
    enableSorting: false,
    filterFn: (row, id, value) => {
      const license = row.getValue(id) as string | undefined;
      return value === (license != "");
    },
  },
  {
    accessorKey: "validated",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Validé" />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getValue("validated") as boolean}
        disabled
        className="cursor-not-allowed"
      />
    ),
    enableSorting: false,
    filterFn: (row, id, value) => {
      const validated = row.getValue(id) as boolean | undefined;
      return value === validated;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
