"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
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
import { Input } from "@/src/components/ui/input";
import { DataTablePagination } from "@/src/components/ui/data-table-pagination";
import { ArrowUpDown, Search } from "lucide-react";
import { VolunteerShiftCompleteWithVolunteers } from "@/src/api/hyperionSchemas";
import VolunteerDetailDialog, { VolunteerRow } from "./VolunteerDetailDialog";

function aggregateVolunteers(
  shifts: VolunteerShiftCompleteWithVolunteers[],
): VolunteerRow[] {
  const volunteerMap = new Map<string, VolunteerRow>();

  for (const shift of shifts) {
    for (const reg of shift.registrations ?? []) {
      const existing = volunteerMap.get(reg.user_id);
      const entry = { shift, registration: reg };

      if (existing) {
        existing.shiftCount += 1;
        existing.validatedCount += reg.validated ? 1 : 0;
        existing.points += reg.validated ? shift.value : 0;
        existing.potentialPoints += shift.value;
        existing.registrations.push(entry);
      } else {
        volunteerMap.set(reg.user_id, {
          userId: reg.user_id,
          fullName: `${reg.user.firstname} ${reg.user.name}`,
          email: reg.user.email,
          schoolName: reg.user.school?.name ?? "-",
          shiftCount: 1,
          validatedCount: reg.validated ? 1 : 0,
          points: reg.validated ? shift.value : 0,
          potentialPoints: shift.value,
          registrations: [entry],
        });
      }
    }
  }

  return Array.from(volunteerMap.values());
}

interface VolunteerDataTableProps {
  volunteerShifts: VolunteerShiftCompleteWithVolunteers[];
}

export default function VolunteerDataTable({
  volunteerShifts,
}: VolunteerDataTableProps) {
  const data = React.useMemo(
    () => aggregateVolunteers(volunteerShifts),
    [volunteerShifts],
  );

  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "points", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [selectedVolunteer, setSelectedVolunteer] =
    React.useState<VolunteerRow | null>(null);

  const columns: ColumnDef<VolunteerRow>[] = [
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
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("fullName")}</div>
      ),
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
        <div className="text-sm text-muted-foreground">
          {row.getValue("email")}
        </div>
      ),
    },
    {
      accessorKey: "shiftCount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Créneaux
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const total = row.original.shiftCount;
        const validated = row.original.validatedCount;
        return (
          <div className="text-center">
            <span className="font-medium">{total}</span>
            {validated < total && (
              <span className="text-xs text-muted-foreground ml-1">
                ({validated} validé{validated > 1 ? "s" : ""})
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "points",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Points
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const points = row.original.points;
        const potential = row.original.potentialPoints;
        return (
          <div className="text-center">
            <span className="font-bold text-lg">{points}</span>
            {potential > points && (
              <span className="text-xs text-muted-foreground ml-1">
                / {potential}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "searchField",
      accessorFn: (row) => `${row.fullName} ${row.email}`.toLowerCase(),
      enableHiding: true,
      filterFn: (row, columnId, filterValue) => {
        const search = filterValue.toLowerCase();
        const name = row.original.fullName.toLowerCase();
        const email = row.original.email.toLowerCase();
        return name.includes(search) || email.includes(search);
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility: { searchField: false },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un bénévole..."
            value={
              (table.getColumn("searchField")?.getFilterValue() as string) ?? ""
            }
            onChange={(e) =>
              table.getColumn("searchField")?.setFilterValue(e.target.value)
            }
            className="pl-9"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {data.length} bénévole{data.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (header.id === "searchField") return null;
                  return (
                    <TableHead key={header.id} className="text-center">
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
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedVolunteer(row.original)}
                >
                  {row.getVisibleCells().map((cell) => {
                    if (cell.column.id === "searchField") return null;
                    return (
                      <TableCell key={cell.id} className="text-center">
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
                  className="text-center py-8 text-muted-foreground"
                >
                  Aucun bénévole trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <DataTablePagination
        table={table}
        selectedLabel="bénévole(s) sélectionné(s)"
        itemsPerPageLabel="Bénévoles par page"
        showSelectedCount={false}
      />

      {/* Detail Dialog */}
      {selectedVolunteer && (
        <VolunteerDetailDialog
          volunteer={selectedVolunteer}
          open={!!selectedVolunteer}
          onClose={() => setSelectedVolunteer(null)}
        />
      )}
    </div>
  );
}
