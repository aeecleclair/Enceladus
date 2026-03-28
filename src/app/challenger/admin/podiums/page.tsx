"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Plus } from "lucide-react";
import { useSports } from "@/src/hooks/useSports";
import { useSchools } from "@/src/hooks/useSchools";
import { usePompomsPodiums } from "@/src/hooks/usePompomsPodiums";
import { useSportPodiums } from "@/src/hooks/useSportsPodiums";
import { usePodiums } from "@/src/hooks/usePodiums";
import { SportsDataTable } from "@/src/components/admin/podiums/SportsDataTable";
import { PodiumRankingsForm } from "@/src/components/admin/podiums/PodiumRankingsForm";
import { GlobalPodiumCard } from "@/src/components/admin/podiums/GlobalPodiumCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

export default function PodiumsPage() {
  const { sports, error: sportsError } = useSports();
  const { schools } = useSchools();
  const {
    pompomsResults,
    isPompomsLoading,
    isDeleteLoading: isPompomsDeleteLoading,
    deletePompomsPodium,
  } = usePompomsPodiums();
  const { podiumsBySport } = useSportPodiums({
    sportIds:
      sports?.filter((sport) => sport.active).map((sport) => sport.id) || [],
  });
  const {
    globalPodium,
    isGlobalLoading,
    deleteSportPodium,
    isDeleteLoading: isRegularDeleteLoading,
  } = usePodiums();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSportForEdit, setSelectedSportForEdit] = useState<string>("");

  const openEditDialog = (sportId: string) => {
    setSelectedSportForEdit(sportId);
    setEditDialogOpen(true);
  };

  const handleDeletePodium = (sportId: string) => {
    if (sportId === "pompoms") {
      deletePompomsPodium(() => {
        // Successfully deleted
      });
    } else {
      deleteSportPodium(sportId, () => {
        // Successfully deleted
      });
    }
  };

  if (sportsError) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-destructive mb-2">
            Erreur de chargement des sports
          </h2>
          <p className="text-muted-foreground">
            Impossible de charger les sports. Vérifiez votre connexion ou
            contactez l&apos;administration.
          </p>
        </div>
      </div>
    );
  }

  // Helper function to get school name by ID
  const getSchoolName = (schoolId: string) => {
    const school = schools?.find((s) => s.id === schoolId);
    return school?.name || "École inconnue";
  };

  // Prepare data for the unified table
  const tableData = [
    // Add Pompoms as first entry
    {
      id: "pompoms",
      name: "Pompoms",
      active: true,
      isPompoms: true,
      firstPlace: pompomsResults?.sort(
        (a, b) => b.total_points - a.total_points,
      )[0]
        ? getSchoolName(
            pompomsResults.sort((a, b) => b.total_points - a.total_points)[0]
              .school_id,
          )
        : null,
      secondPlace: pompomsResults?.sort(
        (a, b) => b.total_points - a.total_points,
      )[1]
        ? getSchoolName(
            pompomsResults.sort((a, b) => b.total_points - a.total_points)[1]
              .school_id,
          )
        : null,
      thirdPlace: pompomsResults?.sort(
        (a, b) => b.total_points - a.total_points,
      )[2]
        ? getSchoolName(
            pompomsResults.sort((a, b) => b.total_points - a.total_points)[2]
              .school_id,
          )
        : null,
    },
    // Add regular sports
    ...(sports
      ?.filter((sport) => sport.active)
      .map((sport) => {
        const podiumData = podiumsBySport[sport.id];
        const sortedPodium = podiumData
          ? [...podiumData].sort((a, b) => a.rank - b.rank)
          : [];

        return {
          id: sport.id,
          name: sport.name,
          active: sport.active ?? true,
          isPompoms: false,
          firstPlace:
            sortedPodium.find((p) => p.rank === 1)?.team?.name || null,
          secondPlace:
            sortedPodium.find((p) => p.rank === 2)?.team?.name || null,
          thirdPlace:
            sortedPodium.find((p) => p.rank === 3)?.team?.name || null,
        };
      }) || []),
  ];

  return (
    <div className="space-y-6">
      {/* Header with title and action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Podiums</h1>
          <p className="text-muted-foreground">Gestion des podiums</p>
        </div>
        <Dialog
          open={editDialogOpen}
          onOpenChange={(open) => {
            setEditDialogOpen(open);
            if (!open) {
              setSelectedSportForEdit("");
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Gérer un podium
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Gérer le podium d&apos;un sport</DialogTitle>
              <DialogDescription>
                Sélectionnez un sport et configurez son podium.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Sport</label>
                <Select
                  value={selectedSportForEdit}
                  onValueChange={setSelectedSportForEdit}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un sport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pompoms">Pompoms</SelectItem>
                    {sports
                      ?.filter((sport) => sport.active)
                      .map((sport) => (
                        <SelectItem key={sport.id} value={sport.id}>
                          {sport.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedSportForEdit && (
                <PodiumRankingsForm
                  sportId={selectedSportForEdit}
                  isLoading={false}
                  onClose={() => {
                    setEditDialogOpen(false);
                    setSelectedSportForEdit("");
                  }}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {/* Global Podium Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Podium Global</h2>
          {isGlobalLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Chargement du podium global...
            </div>
          ) : (
            <GlobalPodiumCard
              results={globalPodium || []}
              title="Classement général des écoles"
            />
          )}
        </div>

        {/* Sports Management Table */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Gestion des podiums par sport
          </h2>
          <SportsDataTable
            data={tableData}
            onEditSport={openEditDialog}
            onDeletePodium={handleDeletePodium}
            isLoading={!sports || isPompomsLoading}
            isDeleteLoading={isPompomsDeleteLoading || isRegularDeleteLoading}
          />
        </div>
      </div>
    </div>
  );
}
