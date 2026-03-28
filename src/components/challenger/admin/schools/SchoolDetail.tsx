"use client";

import { SchoolExtension, SportQuotaInfo } from "@/src/api/hyperionSchemas";
import Link from "next/link";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { getSchoolType } from "@/src/utils/schools";
import { useSchoolsSportQuota } from "@/src/hooks/useSchoolsSportQuota";
import { useSports } from "@/src/hooks/useSports";
import { useState, useMemo } from "react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/src/components/ui/tooltip";
import { useSchoolsGeneralQuota } from "@/src/hooks/useSchoolsGeneralQuota";
import {
  QuotaWithSport,
  SportQuotaDataTable,
} from "./sport/SportQuotaDataTable";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { GeneralQuotaDialog } from "./GeneralQuotaDialog";
import { GeneralQuotaFormValues } from "@/src/forms/generalQuota";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  MapPin,
  Users,
  School,
  Trophy,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { ProductQuotaDataTable } from "./product/ProductQuotaDataTable";
import { useSchoolsProductQuota } from "@/src/hooks/useSchoolsProductQuota";
import { SportQuotaCard } from "./sport/SportQuotaCard";
import { ProductQuotaCard } from "./product/ProductQuotaCard";

interface SchoolDetailProps {
  school: SchoolExtension;
  onEdit?: () => void;
  onDelete?: () => void;
}

const SchoolDetail = ({ school, onEdit, onDelete }: SchoolDetailProps) => {
  const {
    createQuota: createGeneralQuota,
    updateQuota: updateGeneralQuota,
    isCreateLoading: isGeneralQuotaLoading,
    isUpdateLoading: isGeneralQuotaUpdateLoading,
    schoolsGeneralQuota,
  } = useSchoolsGeneralQuota({ schoolId: school.school_id });

  const [isGeneralQuotaDialogOpen, setIsGeneralQuotaDialogOpen] =
    useState(false);

  const handleGeneralQuotaSubmit = (values: GeneralQuotaFormValues) => {
    if (schoolsGeneralQuota) {
      updateGeneralQuota(values, () => {
        setIsGeneralQuotaDialogOpen(false);
      });
    } else {
      createGeneralQuota(values, () => {
        setIsGeneralQuotaDialogOpen(false);
      });
    }
  };

  const {
    deleteQuota: deleteSportQuota,
    isDeleteLoading: isDeleteSportLoading,
  } = useSchoolsSportQuota({
    schoolId: school.school_id,
  });

  const { sports } = useSports();

  const schoolType = getSchoolType(school);

  const [isDeleteSportQuotaDialogOpen, setIsDeleteSportQuotaDialogOpen] =
    useState(false);
  const [selectedSportForDelete, setSelectedSportForDelete] = useState<
    string | null
  >(null);

  const handleDeleteSportQuota = () => {
    if (selectedSportForDelete) {
      deleteSportQuota(selectedSportForDelete, () => {
        setSelectedSportForDelete(null);
      });
    }
  };

  const getSportName = (sportId: string) => {
    return sports?.find((s) => s.id === sportId)?.name || sportId;
  };

  return (
    <TooltipProvider>
      <div className="flex w-full flex-col space-y-6">
        {/* Header with breadcrumb-style navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {formatSchoolName(school.school.name)}
              </h1>
              {schoolsGeneralQuota && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-2 py-1 text-xs"
                    >
                      Quota général
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <div className="space-y-1">
                      {Object.entries(schoolsGeneralQuota).map(
                        ([key, value]) => (
                          <div key={key} className="flex justify-between gap-2">
                            <span className="font-medium text-xs text-muted-foreground">
                              {key.replace(/_/g, " ")}
                            </span>
                            <span className="text-xs">{value ?? 0}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge
                variant={schoolType.variant}
                className={`gap-1 ${schoolType.className}`}
              >
                <MapPin className="h-3 w-3" />
                {schoolType.label}
              </Badge>
              <Badge
                variant={school.active ? "default" : "destructive"}
                className="gap-1"
              >
                {school.active ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <XCircle className="h-3 w-3" />
                )}
                {school.active ? "Active" : "Inactive"}
              </Badge>
              <Badge
                variant={school.inscription_enabled ? "default" : "secondary"}
                className="gap-1"
              >
                <Users className="h-3 w-3" />
                Inscriptions{" "}
                {school.inscription_enabled ? "ouvertes" : "fermées"}
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
            {/* Render the GeneralQuotaDialog */}
            <GeneralQuotaDialog
              isOpen={isGeneralQuotaDialogOpen}
              onOpenChange={setIsGeneralQuotaDialogOpen}
              onSubmit={handleGeneralQuotaSubmit}
              existingQuota={schoolsGeneralQuota}
              title={
                schoolsGeneralQuota
                  ? "Modifier le quota général"
                  : "Ajouter un quota général"
              }
              description="Définissez les quotas généraux pour cette école."
              submitLabel={schoolsGeneralQuota ? "Modifier" : "Valider"}
              isLoading={
                schoolsGeneralQuota
                  ? isGeneralQuotaUpdateLoading
                  : isGeneralQuotaLoading
              }
            />
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

        <SportQuotaCard
          school={school}
          setIsDeleteDialogOpen={setIsDeleteSportQuotaDialogOpen}
        />

        <ProductQuotaCard school={school} />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          isOpen={isDeleteSportQuotaDialogOpen}
          onOpenChange={setIsDeleteSportQuotaDialogOpen}
          title="Supprimer le quota"
          description={`Êtes-vous sûr de vouloir supprimer le quota pour ${
            selectedSportForDelete ? getSportName(selectedSportForDelete) : ""
          } ? Cette action est irréversible.`}
          onConfirm={handleDeleteSportQuota}
          onCancel={() => setSelectedSportForDelete(null)}
          isLoading={isDeleteSportLoading}
        />
      </div>
    </TooltipProvider>
  );
};

export default SchoolDetail;
