"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, DownloadIcon, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableToolbar } from "./DataTableToolbar";
import { fuzzyFilter, fuzzySort } from "@/lib/utils";
import { AppCoreDocumentsSchemasDocumentsDocument } from "@/api";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Checkbox } from "../ui/checkbox";

export interface TemplateDocuments extends AppCoreDocumentsSchemasDocumentsDocument {
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}

interface ParticipantDataTableProps {
  data: TemplateDocuments[];
}

export function DocumentDataTable({ data }: ParticipantDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const statusOrder = ["PENDING", "REJECTED", "COMPLETED"];

  const columns: ColumnDef<TemplateDocuments>[] = [
    {
      id: "searchField",
      accessorFn: (row) =>
        `${row.user.fullName} ${row.user.email}`.toLowerCase(),
      filterFn: (row, columnId, filterValue) => {
        const searchTerm = filterValue.toLowerCase();
        const fullName = row.original.user.fullName.toLowerCase();
        const email = row.original.user.email.toLowerCase();
        return fullName.includes(searchTerm) || email.includes(searchTerm);
      },
    },
    {
      id: "select-col",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    },
    {
      accessorKey: "fullName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center w-full   "
        >
          Nom
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      sortingFn: (rowA, rowB) => {
        const nameA = rowA.original.user.fullName.toLowerCase();
        const nameB = rowB.original.user.fullName.toLowerCase();
        return nameA.localeCompare(nameB);
      },
      cell: ({ row }) => {
        const fullName = row.original.user.fullName;

        return (
          <div className="font-medium text-center flex items-center justify-center gap-2">
            {fullName}
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center w-full"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      sortingFn: (rowA, rowB) => {
        const emailA = rowA.original.user.email.toLowerCase();
        const emailB = rowB.original.user.email.toLowerCase();
        return emailA.localeCompare(emailB);
      },
      cell: ({ row }) => (
        <div className="text-center">{row.original.user.email}</div>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center w-full"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          {row.original.status === "COMPLETED" ? (
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 hover:bg-green-200"
            >
              Complet
            </Badge>
          ) : row.original.status === "REJECTED" ? (
            <Badge variant="destructive">Rejeté</Badge>
          ) : (
            <Badge variant="secondary">En attente</Badge>
          )}
        </div>
      ),
      filterFn: (row, id, filterValue) => {
        const status = row.getValue(id);
        return status === filterValue;
      },
      sortingFn: (rowA, rowB) => {
        const statusA = rowA.original.status;
        const statusB = rowB.original.status;
        return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB);
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center w-full">Actions</div>,
      cell: ({ row }) => {
        const document = row.original;

        return (
          <div className="flex flex-row items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={document.status !== "COMPLETED"}
              onClick={() => {
                // Implement download logic here
                console.log("Downloading document:", document.name);
              }}
            >
              <DownloadIcon />
            </Button>
            <Button
              variant={
                document.status === "PENDING" ? "outline" : "destructive"
              }
              size="sm"
              onClick={() => {
                // Implement cancel logic here
                console.log("Cancelling document:", document.name);
              }}
            >
              {document.status === "PENDING" ? <Cross1Icon /> : <Trash />}
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableMultiRowSelection: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
  });

  return (
    <div>
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (header.id === "searchField") return null;

                  return (
                    <TableHead
                      key={header.id}
                      className={
                        header.id === "actions" ? "text-center" : "text-center"
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    if (cell.column.id === "searchField") return null;

                    return (
                      <TableCell
                        key={cell.id}
                        className={
                          cell.column.id === "actions"
                            ? "text-center"
                            : "text-center"
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length - 1}
                  className="text-center py-4 text-muted-foreground"
                >
                  Aucune donnée à afficher.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4">
        <DataTablePagination
          table={table}
          selectedLabel="document(s) sélectionné(s)"
          itemsPerPageLabel="Document(s) par page"
          showSelectedCount={false}
        />
      </div>
    </div>
  );
}
