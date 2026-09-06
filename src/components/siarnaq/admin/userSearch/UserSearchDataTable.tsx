"use client";

import { columns } from "./Columns";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableToolbar } from "./DataTableToolbar";

import { CdrUserPreview, CoreUserSimple } from "@/api";
import { useUsers } from "@/hooks/siarnaq/useCdrUsers";
import { usePendingUsers } from "@/hooks/siarnaq/usePendingUsers";
import { useRouter } from "@/i18n/navigation";
import { fuzzyFilter } from "@/lib/utils";

import { RankingInfo } from "@tanstack/match-sorter-utils";
import {
  ColumnFiltersState,
  FilterFn,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Extend the FilterFns and FilterMeta interfaces to include our custom filter function and meta
declare module "@tanstack/react-table" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

export function UserSearch() {
  const { users } = useUsers();
  const { pendingUsers } = usePendingUsers();
  const t = useTranslations("siarnaq");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [showPendingUsers, setShowPendingUsers] = React.useState(false);

  const userId = searchParams.get("userId");

  const data = showPendingUsers ? pendingUsers : users;

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
      sorting,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: "fuzzy",
    onGlobalFilterChange: setGlobalFilter,
  });
  React.useEffect(() => {
    if (userId && !table.getIsSomeRowsSelected()) {
      const userIndex = users.findIndex(
        (user) => (user as CoreUserSimple).id === userId,
      );
      if (userIndex !== -1) {
        const row = table.getRow(userIndex.toString(), true);
        if (row) {
          row.toggleSelected(true);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getRowModel().rows, userId]);

  function onUserSelect(row: Row<CdrUserPreview>) {
    if (table.getSelectedRowModel().rows.length) {
      setRowSelection({});
    }
    const id = (row.original as CoreUserSimple).id;
    if (id === userId) {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.delete("userId");
      const query = current.toString();
      router.push(`/admin?${query}`);
      return;
    }
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("userId", id);
    const query = current.toString();
    router.push(`/admin?${query}`);
    row.toggleSelected(true);
  }

  return (
    <div className="flex flex-col items-center m-2">
      <div className="space-y-4 w-full">
        <DataTableToolbar
          table={table}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          accountTypes={[
            "student",
            "staff",
            "other_school_student",
            "external",
          ]}
          showPendingUsers={showPendingUsers}
          setShowPendingUsers={setShowPendingUsers}
        />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
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
              {table.getRowModel().rows?.length ? (
                <>
                  {table
                    .getSelectedRowModel()
                    .rows.filter(
                      (row) => !table.getRowModel().rows.includes(row),
                    )
                    .map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={"selected"}
                        onClick={() => onUserSelect(row)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  {table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() => onUserSelect(row)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {t("dataTable.noResult")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
