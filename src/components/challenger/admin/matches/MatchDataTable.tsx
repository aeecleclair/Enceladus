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
import { Input } from "@/src/components/ui/input";
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
  Calendar,
  Edit,
  Flag,
  MapPin,
  MoreHorizontal,
  Trophy,
} from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { DataTablePagination } from "@/src/components/ui/data-table-pagination";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Match, MatchComplete } from "@/src/api/hyperionSchemas";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useSports } from "@/src/hooks/useSports";
import { DataTableFacetedFilter } from "@/src/components/admin/registered-table/DataTableFacetedFilter";

interface MatchDataTableProps {
  data: MatchComplete[];
  onDelete: (matchId: string) => void;
}

export function MatchDataTable({ data, onDelete }: MatchDataTableProps) {
  const router = useRouter();
  const { sports } = useSports();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const sportOptions = React.useMemo(() => {
    return (
      sports?.map((sport) => ({
        label: sport.name,
        value: sport.id,
      })) || []
    );
  }, [sports]);

  const sportNameById = React.useMemo(() => {
    const lookup: Record<string, string> = {};
    sports?.forEach((sport) => {
      lookup[sport.id] = sport.name;
    });
    return lookup;
  }, [sports]);

  const columns: ColumnDef<MatchComplete>[] = [
    {
      accessorKey: "name",
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
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "sport_id",
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
      filterFn: (row, id, value: string[]) => {
        return value.includes(row.getValue(id));
      },
      cell: ({ row }) => {
        const sportId = row.getValue("sport_id") as string;
        return (
          <div className="flex items-center">
            <Flag className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{sportNameById[sportId] || sportId}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "teams",
      header: "Équipes",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.team1.name}</div>
          <div className="text-muted-foreground">vs</div>
          <div className="font-medium">{row.original.team2.name}</div>
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue("date") as string;
        if (!date)
          return <div className="text-muted-foreground">Non définie</div>;

        return (
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            {format(new Date(date), "dd/MM/yyyy HH:mm", { locale: fr })}
          </div>
        );
      },
    },
    {
      accessorKey: "location_id",
      header: "Lieu",
      cell: ({ row }) => {
        const location = row.getValue("location_id") as string;
        if (!location)
          return <div className="text-muted-foreground">Non défini</div>;

        return (
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            {location}
          </div>
        );
      },
    },
    {
      accessorKey: "score",
      header: "Score",
      cell: ({ row }) => {
        const score1 = row.original.score_team1;
        const score2 = row.original.score_team2;

        if (score1 === null || score2 === null) {
          return <div className="text-muted-foreground">Non défini</div>;
        }

        return (
          <div className="font-medium">
            {score1} - {score2}
          </div>
        );
      },
    },
    {
      accessorKey: "ended",
      header: "Statut",
      cell: ({ row }) => {
        const ended = row.getValue("ended") as boolean;

        if (ended) {
          const winnerId = row.original.winner_id;
          if (winnerId) {
            const winnerName =
              winnerId === row.original.team1_id
                ? row.original.team1.name
                : row.original.team2.name;
            return (
              <Badge className="bg-green-100 text-green-800">
                <Trophy className="h-3 w-3 mr-1" />
                Terminé ({winnerName})
              </Badge>
            );
          }
          return (
            <Badge className="bg-green-100 text-green-800">
              <Trophy className="h-3 w-3 mr-1" />
              Terminé (match nul)
            </Badge>
          );
        }

        return <Badge variant="outline">À venir</Badge>;
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <span className="sr-only">Ouvrir le menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    router.push(`/admin/matches?match_id=${row.original.id}`)
                  }
                >
                  Voir les détails
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    router.push(
                      `/admin/matches/edit?match_id=${row.original.id}`,
                    )
                  }
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(row.original.id)}
                  className="text-red-600"
                >
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filtrer par nom..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(e) =>
              table.getColumn("name")?.setFilterValue(e.target.value)
            }
            className="h-8 max-w-sm"
          />
          {sportOptions.length > 0 && table.getColumn("sport_id") && (
            <DataTableFacetedFilter
              column={table.getColumn("sport_id")}
              title="Sports"
              options={sportOptions}
            />
          )}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
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
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/admin/matches?match_id=${row.original.id}`)
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={
                        cell.column.id === "actions" ? "text-right" : ""
                      }
                      onClick={(e) => {
                        if (cell.column.id === "actions") {
                          e.stopPropagation();
                        }
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-4 text-muted-foreground"
                >
                  Aucun match trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4">
        <DataTablePagination
          table={table}
          selectedLabel="match(s) sélectionné(s)"
          itemsPerPageLabel="Matchs par page"
          showSelectedCount={false}
        />
      </div>
    </div>
  );
}
