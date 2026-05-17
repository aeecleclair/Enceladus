"use client";

import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { DataTableFilterCheckBox } from "./DataTableFilterCheckBox";
import { DataTableViewOptions } from "./DataTableViewOptions";

import { RaidTeamPreview } from "@/api";
import { LoadingButton } from "@/components/common/LoadingButton";
import { WarningDialog } from "@/components/common/WarningDialog";
import { useTeams } from "@/hooks/raid/useTeams";
import { difficulties, meetingPlaces } from "@/lib/raid/comboboxValues";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { MergeIcon, Trash2Icon } from "lucide-react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const {
    refetchTeams,
    mergeTeams,
    isMergeLoading,
    deleteAllTeams,
    isDeletionLoading,
  } = useTeams();
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <>
      {isDeleteAllDialogOpen && (
        <WarningDialog
          isOpened={isDeleteAllDialogOpen}
          setIsOpened={setIsDeleteAllDialogOpen}
          isLoading={isDeletionLoading}
          title="Suppression de toutes les équipes"
          description="Êtes-vous sûr de vouloir supprimer TOUTES les équipes ? Cette action est irréversible et supprimera définitivement toutes les équipes existantes."
          validateLabel="Supprimer tout"
          callback={() =>
            deleteAllTeams(() => {
              refetchTeams();
              setIsDeleteAllDialogOpen(false);
            })
          }
          width="w-[150px]"
        />
      )}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 bg-muted/20 p-2">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <Input
            placeholder="Filtrer les équipes..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="h-8 w-37.5 bg-background lg:w-62.5"
          />
          {table.getColumn("difficulty") && (
            <DataTableFacetedFilter
              column={table.getColumn("difficulty")}
              title="Parcours"
              options={difficulties}
            />
          )}
          {table.getColumn("meeting_place") && (
            <DataTableFacetedFilter
              column={table.getColumn("meeting_place")}
              title="Lieu de rendez-vous"
              options={meetingPlaces}
            />
          )}
          {table.getColumn("second") && (
            <DataTableFilterCheckBox
              column={table.getColumn("second")}
              title="Equipe sans coéquipier"
            />
          )}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Supprimer
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
          {(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) && (
            <div className="">
              <LoadingButton
                onClick={() => {
                  const selectedTeams = Object.keys(
                    table.getState().rowSelection,
                  ).map((key) => table.getRow(key).original as RaidTeamPreview);
                  const teamIds = selectedTeams.map((team) => team.id);
                  mergeTeams(teamIds[0], teamIds[1], () => {
                    refetchTeams();
                    table.resetRowSelection();
                  });
                }}
                className="h-8 px-2 lg:px-3 lg:w-26.25 w-10"
                disabled={
                  Object.keys(table.getState().rowSelection).length !== 2
                }
                isLoading={isMergeLoading}
              >
                <>
                  <span className="max-lg:hidden">Fusionner</span>
                  <MergeIcon className="lg:ml-2 h-4 w-4" />
                </>
              </LoadingButton>
              <Button
                variant="ghost"
                onClick={() => {
                  table.resetRowSelection();
                }}
                className="ml-2 h-8 px-2 lg:px-3 lg:w-26.25 w-10"
              >
                <span className="max-lg:hidden">Annuler</span>
                <Cross2Icon className="lg:ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => setIsDeleteAllDialogOpen(true)}
            variant="destructive"
            size="sm"
            className="h-8 px-2 flex items-center"
          >
            <Trash2Icon className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Supprimer toutes les équipes</span>
            <span className="md:hidden">Tout supprimer</span>
          </Button>
          <DataTableViewOptions table={table} />
        </div>
      </div>
    </>
  );
}
