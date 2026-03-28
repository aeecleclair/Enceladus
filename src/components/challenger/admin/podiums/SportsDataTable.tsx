"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/src/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { ArrowUpDown, Edit, Trash2, MoreHorizontal } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Badge } from "@/src/components/ui/badge";
import { DataTablePagination } from "@/src/components/ui/data-table-pagination";
import { SportsDataTableToolbar } from "./SportsDataTableToolbar";

// Sport data for the table
export interface SportData {
  id: string;
  name: string;
  active: boolean;
  firstPlace?: string | null;
  secondPlace?: string | null;
  thirdPlace?: string | null;
}

interface SportsDataTableProps {
  data: SportData[];
  onEditSport: (sportId: string) => void;
  onDeletePodium: (sportId: string) => void;
  isLoading: boolean;
  isDeleteLoading: boolean;
}

export function SportsDataTable({
  data,
  onEditSport,
  onDeletePodium,
  isLoading,
  isDeleteLoading,
}: SportsDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  // Create a virtual column for search
  const columns: ColumnDef<SportData>[] = [
    {
      id: "searchField",
      accessorFn: (row) => `${row.name}`.toLowerCase(),
      filterFn: (row, columnId, filterValue) => {
        const searchTerm = filterValue.toLowerCase();
        const name = row.getValue<string>("name").toLowerCase();
        return name.includes(searchTerm);
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center justify-center w-full"
        >
          Sport
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium text-center">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "firstPlace",
      header: () => (
        <div className="flex items-center justify-center">🥇 1ère place</div>
      ),
      cell: ({ row }) => (
        <div className="font-medium text-center">
          {row.getValue("firstPlace") ? (
            <div className="flex items-center justify-center gap-2">
              <span className="text-yellow-500">🥇</span>
              <span>{row.getValue("firstPlace")}</span>
            </div>
          ) : (
            <span className="text-muted-foreground italic">Non définie</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "secondPlace",
      header: () => (
        <div className="flex items-center justify-center">🥈 2ème place</div>
      ),
      cell: ({ row }) => (
        <div className="font-medium text-center">
          {row.getValue("secondPlace") ? (
            <div className="flex items-center justify-center gap-2">
              <span className="text-gray-400">🥈</span>
              <span>{row.getValue("secondPlace")}</span>
            </div>
          ) : (
            <span className="text-muted-foreground italic">Non définie</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "thirdPlace",
      header: () => (
        <div className="flex items-center justify-center">🥉 3ème place</div>
      ),
      cell: ({ row }) => (
        <div className="font-medium text-center">
          {row.getValue("thirdPlace") ? (
            <div className="flex items-center justify-center gap-2">
              <span className="text-amber-600">🥉</span>
              <span>{row.getValue("thirdPlace")}</span>
            </div>
          ) : (
            <span className="text-muted-foreground italic">Non définie</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "active",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center justify-center w-full"
        >
          Statut
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("active") ? (
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 hover:bg-green-200"
            >
              Actif
            </Badge>
          ) : (
            <Badge variant="destructive">Inactif</Badge>
          )}
        </div>
      ),
      filterFn: (row, id, filterValue) => {
        if (filterValue === undefined) return true;
        const value = row.getValue<boolean>(id);
        return filterValue === true ? value === true : !value;
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const sport = row.original;

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  disabled={isLoading || isDeleteLoading}
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Ouvrir le menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onEditSport(sport.id)}
                  disabled={isLoading}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Gérer le podium
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDeletePodium(sport.id)}
                  disabled={isDeleteLoading}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer le podium
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  // Setup column visibility to hide the searchField column
  React.useEffect(() => {
    setColumnVisibility((prev) => ({
      ...prev,
      searchField: false,
    }));
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div>
      <SportsDataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  // Don't render the searchField column header
                  if (header.id === "searchField") return null;

                  return (
                    <TableHead
                      key={header.id}
                      className={header.id === "actions" ? "text-right" : ""}
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
              table
                .getRowModel()
                .rows.sort((a, b) =>
                  (a.getValue("name") as string).localeCompare(
                    b.getValue("name") as string,
                  ),
                )
                .map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      // Don't render the searchField column cell
                      if (cell.column.id === "searchField") return null;

                      return (
                        <TableCell
                          key={cell.id}
                          className={
                            cell.column.id === "actions" ? "text-right" : ""
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
                  colSpan={columns.length - 1} // Subtract 1 for the hidden searchField column
                  className="text-center py-4 text-muted-foreground"
                >
                  Aucun sport trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4">
        <DataTablePagination
          table={table}
          selectedLabel="sport(s) sélectionné(s)"
          itemsPerPageLabel="Sports par page"
          showSelectedCount={false}
        />
      </div>
    </div>
  );
}
