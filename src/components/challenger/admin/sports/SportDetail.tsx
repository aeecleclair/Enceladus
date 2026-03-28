"use client";

import { Sport, SportQuotaInfo } from "@/src/api/hyperionSchemas";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { QuotaDialog } from "./QuotaDialog";
import { QuotaDataTable } from "./QuotaDataTable";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { useSportsQuota } from "@/src/hooks/useSportsQuota";
import { useSchools } from "@/src/hooks/useSchools";
import { SportQuotaFormValues } from "@/src/forms/sportQuota";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { sportCategories } from "@/src/forms/sport";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Users,
  UserPlus,
  Trophy,
  Plus,
  Edit,
  Trash2,
  Target,
} from "lucide-react";
import { useSportSchools } from "@/src/hooks/useSportSchools";

interface SportDetailProps {
  sport: Sport;
  onEdit?: () => void;
  onDelete?: () => void;
}

const SportDetail = ({ sport, onEdit, onDelete }: SportDetailProps) => {
  const {
    sportsQuota,
    isCreateLoading,
    createQuota,
    createQuotaForAllSchools,
    isUpdateLoading,
    updateQuota,
    isDeleteLoading,
    deleteQuota,
  } = useSportsQuota({
    sportId: sport.id,
  });

  const { sportSchools } = useSportSchools();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [selectedSchoolForDelete, setSelectedSchoolForDelete] = useState<
    string | null
  >(null);

  const categoryLabel =
    sportCategories.find((cat) => cat.value === sport.sport_category)?.label ||
    sport.sport_category;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "masculine":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "feminine":
        return "bg-pink-100 text-pink-800 border-pink-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleEditQuota = (schoolId: string) => {
    const currentQuota = sportsQuota?.find((q) => q.school_id === schoolId);
    if (currentQuota) {
      setSelectedSchool(schoolId);
      setIsAddDialogOpen(true);
    }
  };

  const existingQuota = sportsQuota?.find(
    (q) => q.school_id === selectedSchool,
  );

  const handleQuotaSubmit = (values: SportQuotaFormValues) => {
    if (!selectedSchool) return;

    const quotaInfo: SportQuotaInfo = {
      participant_quota: values.participant_quota,
      team_quota: values.team_quota,
    };

    if (existingQuota) {
      updateQuota(selectedSchool, quotaInfo, () => {
        setIsAddDialogOpen(false);
        setSelectedSchool(null);
      });
    } else {
      createQuota(selectedSchool, quotaInfo, () => {
        setIsAddDialogOpen(false);
        setSelectedSchool(null);
      });
    }
  };

  const handleQuotaSubmitAll = (values: SportQuotaFormValues) => {
    if (!sportSchools) return;

    const quotaInfo: SportQuotaInfo = {
      participant_quota: values.participant_quota,
      team_quota: values.team_quota,
    };

    // Only target schools that don't already have quotas
    const schoolIdsWithoutQuotas = sportSchools
      .filter(
        (school) =>
          !sportsQuota?.some((quota) => quota.school_id === school.school_id),
      )
      .map((school) => school.school_id);

    if (schoolIdsWithoutQuotas.length === 0) {
      // All schools already have quotas
      return;
    }

    createQuotaForAllSchools(schoolIdsWithoutQuotas, quotaInfo, () => {
      setIsAddDialogOpen(false);
      setSelectedSchool(null);
    });
  };

  const handleDeleteQuota = () => {
    if (selectedSchoolForDelete) {
      deleteQuota(selectedSchoolForDelete, () => {
        setSelectedSchoolForDelete(null);
        setIsDeleteDialogOpen(false);
      });
    }
  };

  const getSchoolName = (schoolId: string) => {
    return (
      formatSchoolName(
        sportSchools?.find((s) => s.school_id === schoolId)?.school.name,
      ) || schoolId
    );
  };

  return (
    <div className="flex w-full flex-col space-y-6">
      {/* Header with breadcrumb-style navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            {sport.name}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge
              variant="outline"
              className={`gap-1 ${getCategoryColor(sport.sport_category || "")}`}
            >
              <Users className="h-3 w-3" />
              {categoryLabel || "Mixte"}
            </Badge>
            <Badge
              variant={sport.active ? "default" : "destructive"}
              className="gap-1"
            >
              {sport.active ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <XCircle className="h-3 w-3" />
              )}
              {sport.active ? "Actif" : "Inactif"}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          {onEdit && (
            <Button variant="outline" onClick={onEdit} className="gap-2">
              <Edit className="h-4 w-4" />
              Modifier
            </Button>
          )}
          {onDelete && (
            <Button
              variant="destructive"
              onClick={onDelete}
              className="gap-2 hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </Button>
          )}
        </div>
      </div>

      {/* Sport Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Titulaires
                </p>
                <p className="text-2xl font-bold">{sport.team_size}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Remplaçants max
                </p>
                <p className="text-2xl font-bold">
                  {sport.substitute_max || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Quotas définis
                </p>
                <p className="text-2xl font-bold">{sportsQuota?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quotas Management Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Quotas pour le sport {sport.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Gérez les quotas de participants et d&apos;équipes pour chaque
                école dans ce sport spécifique
              </p>
            </div>
            <QuotaDialog
              isOpen={isAddDialogOpen}
              onOpenChange={setIsAddDialogOpen}
              onSubmit={handleQuotaSubmit}
              onSubmitAll={handleQuotaSubmitAll}
              schools={sportSchools}
              selectedSchool={selectedSchool}
              setSelectedSchool={setSelectedSchool}
              existingQuota={existingQuota}
              existingQuotas={sportsQuota}
              title={
                selectedSchool &&
                sportsQuota?.find((q) => q.school_id === selectedSchool)
                  ? "Modifier le quota de l'école"
                  : "Ajouter un quota pour une école"
              }
              description={`Définissez le nombre de participants et d'équipes autorisés pour cette école dans le sport ${sport.name}.`}
              submitLabel={
                selectedSchool &&
                sportsQuota?.find((q) => q.school_id === selectedSchool)
                  ? "Modifier"
                  : "Ajouter"
              }
              isLoading={isCreateLoading || isUpdateLoading}
            />
          </div>
        </CardHeader>

        <CardContent>
          {sportsQuota && sportsQuota.length > 0 ? (
            <QuotaDataTable
              data={sportsQuota.map((quota) => ({
                school_id: quota.school_id,
                schoolName: getSchoolName(quota.school_id),
                participant_quota: quota.participant_quota || 0,
                team_quota: quota.team_quota || 0,
                sport_id: quota.sport_id,
              }))}
              sportName={sport.name || ""}
              onEditQuota={handleEditQuota}
              onDeleteQuota={(schoolId) => {
                setSelectedSchoolForDelete(schoolId);
                setIsDeleteDialogOpen(true);
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-muted rounded-lg">
              <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Aucun quota configuré pour {sport.name}
              </h3>
              <p className="text-muted-foreground mb-4">
                Commencez par ajouter des quotas pour les écoles qui participent
                à ce sport
              </p>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Ajouter le premier quota
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Supprimer le quota de l'école"
        description={`Êtes-vous sûr de vouloir supprimer le quota pour ${
          selectedSchoolForDelete ? getSchoolName(selectedSchoolForDelete) : ""
        } dans le sport ${sport.name} ? Cette action est irréversible et supprimera toutes les restrictions de participation pour cette école.`}
        onConfirm={handleDeleteQuota}
        onCancel={() => setSelectedSchoolForDelete(null)}
        isLoading={isDeleteLoading}
      />
    </div>
  );
};

export default SportDetail;
