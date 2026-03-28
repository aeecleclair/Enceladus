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
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { Badge } from "@/src/components/ui/badge";
import { DataTablePagination } from "@/src/components/ui/data-table-pagination";
import { SportsDataTableToolbar } from "./SportsDataTableToolbar";
import { TeamSportResultComplete } from "@/src/api/hyperionSchemas";
import { useSportSchools } from "@/src/hooks/useSportSchools";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { PodiumTeamsDialog } from "./PodiumTeamsDialog";

// Sport data for the table
export interface SportData {
  id: string;
  name: string;
  active: boolean;
  firstPlace?: string | null;
  secondPlace?: string | null;
  thirdPlace?: string | null;
  others: TeamSportResultComplete[];
}

interface SportsDataTableProps {
  data: SportData[];
}

export function SportsDataTable({ data }: SportsDataTableProps) {
  const { sportSchools } = useSportSchools();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  // Helper function to get school name
  const getSchoolName = (schoolId: string) => {
    const school = sportSchools?.find((s) => s.school_id === schoolId);
    return formatSchoolName(school?.school.name) || "École inconnue";
  };

  // Helper function to get team and school info from results
  const getTeamInfo = (results: TeamSportResultComplete[], rank: number) => {
    const result = results.find((r) => r.rank === rank);
    if (!result) return null;

    return {
      teamName: result.team.name,
      schoolName: getSchoolName(result.school_id),
      points: result.points,
    };
  };

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
      cell: ({ row }) => {
        const teamInfo = getTeamInfo(row.original.others, 1);
        return (
          <div className="font-medium text-center">
            {teamInfo ? (
              <div className="flex flex-col items-center justify-center gap-1">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-yellow-500">🥇</span>
                  <span>{teamInfo.teamName}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {teamInfo.schoolName}
                </div>
              </div>
            ) : (
              <span className="text-muted-foreground italic">Non définie</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "secondPlace",
      header: () => (
        <div className="flex items-center justify-center">🥈 2ème place</div>
      ),
      cell: ({ row }) => {
        const teamInfo = getTeamInfo(row.original.others, 2);
        return (
          <div className="font-medium text-center">
            {teamInfo ? (
              <div className="flex flex-col items-center justify-center gap-1">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-gray-400">🥈</span>
                  <span>{teamInfo.teamName}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {teamInfo.schoolName}
                </div>
              </div>
            ) : (
              <span className="text-muted-foreground italic">Non définie</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "thirdPlace",
      header: () => (
        <div className="flex items-center justify-center">🥉 3ème place</div>
      ),
      cell: ({ row }) => {
        const teamInfo = getTeamInfo(row.original.others, 3);
        return (
          <div className="font-medium text-center">
            {teamInfo ? (
              <div className="flex flex-col items-center justify-center gap-1">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-amber-600">🥉</span>
                  <span>{teamInfo.teamName}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {teamInfo.schoolName}
                </div>
              </div>
            ) : (
              <span className="text-muted-foreground italic">Non définie</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "others",
      header: ({ column }) => (
        <div className="flex items-center justify-center">Suite</div>
      ),
      cell: ({ row }) => {
        const sport = row.original;

        return (
          <div className="flex justify-center">
            {sport.others.length > 3 ? (
              <PodiumTeamsDialog
                results={sport.others}
                sportName={sport.name}
                triggerText="Voir tous"
              />
            ) : (
              <span className="text-sm text-muted-foreground">-</span>
            )}
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
