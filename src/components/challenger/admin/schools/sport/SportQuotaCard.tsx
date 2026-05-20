"use client";

import { SchoolExtension, SportQuotaInfo } from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SportQuotaFormValues } from "@/forms/challenger/sportQuota";
import { useSchoolsSportQuota } from "@/hooks/challenger/useSchoolsSportQuota";
import { useSports } from "@/hooks/challenger/useSports";
import { Plus, Trophy } from "lucide-react";
import { useState } from "react";
import { SportQuotaDataTable } from "./SportQuotaDataTable";
import { SportQuotaDialog } from "./SportQuotaDialog";

interface SportQuotaCardProps {
  school: SchoolExtension;
  setIsDeleteDialogOpen: (open: boolean) => void;
}

export const SportQuotaCard = ({
  school,
  setIsDeleteDialogOpen,
}: SportQuotaCardProps) => {
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
    </Card>
  );
};
