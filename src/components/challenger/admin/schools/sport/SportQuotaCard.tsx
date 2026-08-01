"use client";

import { DeleteConfirmationDialog } from "../DeleteConfirmationDialog";
import { SportQuotaDataTable } from "./SportQuotaDataTable";
import { SportQuotaDialog } from "./SportQuotaDialog";

import { SchoolExtension, SportQuotaInfo } from "@/api";
import { SportQuotaFormValues } from "@/forms/challenger/sportQuota";
import { useSchoolsSportQuota } from "@/hooks/challenger/useSchoolsSportQuota";
import { useSports } from "@/hooks/challenger/useSports";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Plus, Trophy } from "lucide-react";

interface SportQuotaCardProps {
  school: SchoolExtension;
}

export const SportQuotaCard = ({ school }: SportQuotaCardProps) => {
  const {
    schoolsSportQuota,
    isCreateLoading,
    createQuota,
    isUpdateLoading,
    updateQuota,
    isDeleteLoading,
    deleteQuota,
  } = useSchoolsSportQuota({
    schoolId: school.school_id,
  });
  const { sports } = useSports();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSportForDelete, setSelectedSportForDelete] = useState<
    string | null
  >(null);

  const handleEditQuota = (sportId: string) => {
    const currentQuota = schoolsSportQuota?.find((q) => q.sport_id === sportId);
    if (currentQuota) {
      setSelectedSport(sportId);
      setIsAddDialogOpen(true);
    }
  };
  const existingQuota = schoolsSportQuota?.find(
    (q) => q.sport_id === selectedSport,
  );

  const handleQuotaSubmit = (values: SportQuotaFormValues) => {
    if (!selectedSport) return;

    const quotaInfo: SportQuotaInfo = {
      participant_quota: values.participant_quota,
      team_quota: values.team_quota,
    };

    if (existingQuota) {
      updateQuota(selectedSport, quotaInfo, () => {
        setIsAddDialogOpen(false);
        setSelectedSport(null);
      });
    } else {
      createQuota(selectedSport, quotaInfo, () => {
        setIsAddDialogOpen(false);
        setSelectedSport(null);
      });
    }
  };

  const getSportName = (sportId: string) => {
    return sports?.find((s) => s.id === sportId)?.name || sportId;
  };

  const handleDeleteQuota = () => {
    if (!selectedSportForDelete) return;

    deleteQuota(selectedSportForDelete, () => {
      setSelectedSportForDelete(null);
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Quotas par sport
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Gérez les quotas de participants et d&apos;équipes pour chaque
              sport
            </p>
          </div>
          <SportQuotaDialog
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onSubmit={handleQuotaSubmit}
            sports={sports}
            selectedSport={selectedSport}
            setSelectedSport={setSelectedSport}
            existingQuota={existingQuota}
            title={
              selectedSport &&
              schoolsSportQuota?.find((q) => q.sport_id === selectedSport)
                ? "Modifier le quota"
                : "Ajouter un quota"
            }
            description="Définissez le nombre de participants et d'équipes autorisés pour ce sport."
            submitLabel={
              selectedSport &&
              schoolsSportQuota?.find((q) => q.sport_id === selectedSport)
                ? "Modifier"
                : "Ajouter"
            }
            isLoading={isCreateLoading || isUpdateLoading}
          />
        </div>
      </CardHeader>

      <CardContent>
        {schoolsSportQuota && schoolsSportQuota.length > 0 ? (
          <SportQuotaDataTable
            data={schoolsSportQuota.map((quota) => ({
              sport_id: quota.sport_id,
              sportName: getSportName(quota.sport_id),
              participant_quota: quota.participant_quota || 0,
              team_quota: quota.team_quota || 0,
              school_id: quota.school_id,
            }))}
            onEditQuota={handleEditQuota}
            onDeleteQuota={(sportId) => {
              setSelectedSportForDelete(sportId);
              setIsDeleteDialogOpen(true);
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-muted rounded-lg">
            <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Aucun quota configuré
            </h3>
            <p className="text-muted-foreground mb-4">
              Commencez par ajouter des quotas pour les sports de cette école
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un quota
            </Button>
          </div>
        )}
      </CardContent>

      {/* The dialog lives here, next to the state it reads: when it was rendered
          by SchoolDetail, the selected sport was stored in this component and
          the parent confirmed a sport it never received. */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Supprimer le quota"
        description={`Êtes-vous sûr de vouloir supprimer le quota de ${
          selectedSportForDelete ? getSportName(selectedSportForDelete) : ""
        } pour cette école ? Cette action est irréversible.`}
        onConfirm={handleDeleteQuota}
        onCancel={() => setSelectedSportForDelete(null)}
        isLoading={isDeleteLoading}
      />
    </Card>
  );
};
