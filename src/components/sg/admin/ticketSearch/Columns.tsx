"use client";

import { DataTableColumnHeader } from "./DataTableColumnHeader";

import { AppModulesTicketingSchemasTicketingTicketSimple } from "@/api";

import { ColumnDef } from "@tanstack/react-table";

import { fuzzySort } from "@/lib/utils";

export const columns: ColumnDef<AppModulesTicketingSchemasTicketingTicketSimple>[] = [
  {
    id: "name",
    accessorFn: (row) => row.user.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="name" />
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
    enableSorting: true,
    filterFn: "fuzzy",
    sortingFn: fuzzySort,
  },
  {
    id: "firstname",
    accessorFn: (row) => row.user.firstname,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="firstname" />
    ),
    cell: ({ row }) => <div>{row.getValue("firstname")}</div>,
    enableSorting: true,
    filterFn: "fuzzy",
    sortingFn: fuzzySort,
  },
  {
    id: "nickname",
    accessorFn: (row) => row.user.nickname ?? "—",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="nickname" />
    ),
    cell: ({ row }) => <div>{row.getValue("nickname")}</div>,
    enableSorting: false,
    filterFn: "fuzzy",
    sortingFn: fuzzySort,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="status" />
    ),
    cell: ({ row }) => <div>{row.getValue("status")}</div>,
  },
  {
    accessorKey: "nb_scan",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="nb_scan" />
    ),
    cell: ({ row }) => <div>{row.getValue("nb_scan")}</div>,
  },
];
