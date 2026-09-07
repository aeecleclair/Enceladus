"use client";

import { DataTableToolbar } from "./DataTableToolbar";

import { AppCoreDocumentsSchemasDocumentsDocument, Template } from "@/api";
import { useDocument } from "@/hooks/my-documents/useDocument";
import { fuzzyFilter } from "@/lib/utils";

import { Cross1Icon } from "@radix-ui/react-icons";
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
import { useTranslations } from "next-intl";
import * as React from "react";

import { Checkbox } from "../ui/checkbox";
import { useToast } from "../ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ArrowUpDown, DownloadIcon, Trash } from "lucide-react";

export interface TemplateDocuments extends AppCoreDocumentsSchemasDocumentsDocument {
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}

interface ParticipantDataTableProps {
  template: Template;
  data: TemplateDocuments[];
}

export function DocumentDataTable({
  template,
  data,
}: ParticipantDataTableProps) {
  const t = useTranslations("myDocuments");
  const { toast } = useToast();
  const { refetchData: refetch, isDataLoading } = useDocument();
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const statusOrder = ["PENDING", "REJECTED", "COMPLETED"];

  const badgeClasses: Record<string, string> = {
    PENDING: "bg-blue-200 text-blue-800",
    COMPLETED: "bg-green-200  text-green-800",
    REJECTED: "bg-red-200    text-red-800",
    default: "bg-gray-200   text-gray-800",
  };

  function downloadDocument(targetDocument: TemplateDocuments) {
    refetch(targetDocument.id).then((response) => {
      const data = response.data as File | null;
      if (!data) {
        toast({
          title: "Erreur",
          description: "Impossible de télécharger le fichier",
          variant: "destructive",
        });
        return;
      }
      const extension = data.type.split("/")[1];
      const name = `${targetDocument.name}.${extension}`;
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", name);
      document.body.appendChild(link);
      link.click();
    });
  }

  const columns = React.useMemo<ColumnDef<TemplateDocuments>[]>(
    () => [
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
            className="border-gray-700 dark:border-gray-200"
            checked={table.getIsAllPageRowsSelected() ? true : false}
            onCheckedChange={(checked) =>
              table.toggleAllPageRowsSelected(!!checked)
            }
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            className="border-gray-700 dark:border-gray-200"
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onCheckedChange={row.getToggleSelectedHandler()}
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
            {t("template.headers.name")}
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
            {t("template.headers.email")}
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
            {t("template.headers.status")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            <Badge
              className={
                badgeClasses[row.original.status] ?? badgeClasses.default
              }
            >
              {t(`document.status.${row.original.status}`)}
            </Badge>
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
        header: () => (
          <div className="text-center w-full">
            {t("template.headers.actions")}
          </div>
        ),
        cell: ({ row }) => {
          const document = row.original;

          return (
            <div className="flex flex-row items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={document.status !== "COMPLETED" || isDataLoading}
                onClick={() => {
                  downloadDocument(document);
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
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      pagination,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: (updater) => {
      setRowSelection(updater);
      console.log("Selected rows:", rowSelection);
    },
  });

  return (
    <div>
      <DataTableToolbar table={table} template={template} />
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
                  {t("template.noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4">
        <DataTablePagination
          table={table}
          itemsPerPageLabel={t("template.itemsPerPage")}
          showSelectedCount={false}
          ofLabel={t("template.of")}
        />
      </div>
    </div>
  );
}
