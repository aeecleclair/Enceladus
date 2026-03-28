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
import {
  ArrowUpDown,
  CheckCircle,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Badge } from "@/src/components/ui/badge";
import { DataTablePagination } from "@/src/components/ui/data-table-pagination";
import { DataTableToolbar } from "./DataTableToolbar";
import { CertificateLicense, ParticipantData } from "./CertificateLicense";

interface ParticipantDataTableProps {
  data: ParticipantData[];
  onValidateParticipant: (
    userId: string,
    sportId: string,
    isValid: boolean,
  ) => void;
  isLoading: boolean;
}

export function ParticipantDataTable({
  data,
  onValidateParticipant,
  isLoading,
}: ParticipantDataTableProps) {
  console.log("ParticipantDataTable data", data);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const columns: ColumnDef<ParticipantData>[] = [
    {
      id: "searchField",
      accessorFn: (row) => `${row.fullName} ${row.email}`.toLowerCase(),
      filterFn: (row, columnId, filterValue) => {
        const searchTerm = filterValue.toLowerCase();
        const fullName = row.getValue<string>("fullName").toLowerCase();
        const email = row.getValue<string>("email").toLowerCase();
        return fullName.includes(searchTerm) || email.includes(searchTerm);
      },
    },
    {
      accessorKey: "fullName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Nom
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const fullName = row.getValue("fullName") as string;

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
          className="flex items-center"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "sportName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Sport
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          {row.getValue("sportName")}
        </Badge>
      ),
    },
    {
      accessorKey: "license",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Licence
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const license = row.original.license;
        const certificateFileId = row.original.certificateFileId;
        console.log("license", row.original);
        const participant = row.original;
        if (!certificateFileId && !license) {
          return <div className="text-center">Aucune license</div>;
        }

        if (license) {
          return <div className="text-center">{license}</div>;
        }

        return <CertificateLicense participant={participant} />;
      },
      filterFn: (row, id, filterValue) => {
        if (filterValue === undefined) return true;
        const value = row.getValue<string>(id);
        return filterValue === true ? Boolean(value) : true;
      },
    },
    {
      accessorKey: "isValidated",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Validé
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          {row.getValue("isValidated") ? (
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 hover:bg-green-200"
            >
              Oui
            </Badge>
          ) : (
            <Badge variant="destructive">Non</Badge>
          )}
        </div>
      ),
      filterFn: (row, id, filterValue) => {
        if (filterValue === undefined) return true;
        const value = row.getValue<boolean>(id);
        return filterValue === true ? value === false : true;
      },
      sortingFn: (rowA, rowB) => {
        const a = rowA.original;
        const b = rowB.original;
        if (a.isValidated === b.isValidated) return 0;
        if (a.isValidated) return -1;
        return 1;
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const participant = row.original;

        return (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  disabled={isLoading}
                >
                  <span className="sr-only">Ouvrir le menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    onValidateParticipant(
                      participant.userId,
                      participant.sportId,
                      !participant.isValidated,
                    )
                  }
                  disabled={isLoading}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {participant.isValidated ? "Invalider" : "Valider"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

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
                  Aucun participant trouvé pour cette école
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4">
        <DataTablePagination
          table={table}
          selectedLabel="participant(s) sélectionné(s)"
          itemsPerPageLabel="Participants par page"
          showSelectedCount={false}
        />
      </div>
    </div>
  );
}
