import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { useEdition } from "@/src/hooks/useEdition";
import { toast } from "../../ui/use-toast";
import { useSportSchools } from "@/src/hooks/useSportSchools";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { Download, School, Loader2 } from "lucide-react";
import { Separator } from "../../ui/separator";

export const SchoolUsersExport = () => {
  const { edition } = useEdition();
  const { token } = useAuth();
  const { sportSchools } = useSportSchools();
  const [isExporting, setIsExporting] = useState(false);
  const [exportParams, setExportParams] = useState<{
    schoolId: string;
    excludeNonValidated: boolean;
    participants: boolean;
    purchases: boolean;
    payments: boolean;
  }>({
    schoolId: "",
    excludeNonValidated: false,
    participants: true,
    purchases: true,
    payments: true,
  });

  const exportResult = async () => {
    if (!exportParams.schoolId) {
      toast({
        description: "Veuillez sélectionner une école",
        variant: "destructive",
      });
      return;
    }
    setIsExporting(true);
    const school = sportSchools?.find(
      (s) => s.school_id === exportParams.schoolId,
    );
    const schoolName = school?.school.name
      ? formatSchoolName(school.school.name)
      : exportParams.schoolId;
    let params = "";
    if (exportParams.excludeNonValidated) {
      params += `exclude_non_validated=true&`;
    }
    if (exportParams.participants) {
      params += `included_fields=participants&`;
    }
    if (exportParams.purchases) {
      params += `included_fields=purchases&`;
    }
    if (exportParams.payments) {
      params += `included_fields=payments&`;
    }
    if (params.endsWith("&")) {
      params = params.slice(0, -1);
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://hyperion.myecl.fr"}/competition/data-export/schools/${exportParams.schoolId}/users${params ? "?" + params : ""}`,
        {
          method: "GET",
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Erreur lors du téléchargement");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `export_ecole_${schoolName}_utilisateurs_${edition?.name || "competition"}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        description: "Export des utilisateurs de l'école réussi",
        variant: "default",
      });
    } catch (error) {
      toast({
        description: (error as Error).message || "Erreur lors de l'export",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <School className="h-5 w-5 text-primary" />
          Utilisateurs par école
        </CardTitle>
        <CardDescription>
          Exporte les utilisateurs d&apos;une école avec options personnalisées
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Select
          value={exportParams.schoolId}
          onValueChange={(value) =>
            setExportParams({ ...exportParams, schoolId: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une école" />
          </SelectTrigger>
          <SelectContent>
            {sportSchools?.map((school) => (
              <SelectItem key={school.school_id} value={school.school_id}>
                {school.school.name
                  ? formatSchoolName(school.school.name)
                  : school.school_id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="exclude_non_validated"
              checked={exportParams.excludeNonValidated}
              onCheckedChange={(value) =>
                setExportParams({
                  ...exportParams,
                  excludeNonValidated: value as boolean,
                })
              }
            />
            <Label
              htmlFor="exclude_non_validated"
              className="cursor-pointer text-sm font-normal"
            >
              Exclure les inscrits non validés
            </Label>
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              Données à inclure
            </p>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="participants"
                checked={exportParams.participants}
                onCheckedChange={(value) =>
                  setExportParams({
                    ...exportParams,
                    participants: value as boolean,
                  })
                }
              />
              <Label
                htmlFor="participants"
                className="cursor-pointer text-sm font-normal"
              >
                Inscriptions
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="purchases"
                checked={exportParams.purchases}
                onCheckedChange={(value) =>
                  setExportParams({
                    ...exportParams,
                    purchases: value as boolean,
                  })
                }
              />
              <Label
                htmlFor="purchases"
                className="cursor-pointer text-sm font-normal"
              >
                Achats
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="payments"
                checked={exportParams.payments}
                onCheckedChange={(value) =>
                  setExportParams({
                    ...exportParams,
                    payments: value as boolean,
                  })
                }
              />
              <Label
                htmlFor="payments"
                className="cursor-pointer text-sm font-normal"
              >
                Paiements
              </Label>
            </div>
          </div>
        </div>

        <Button
          className="w-full gap-2"
          type="button"
          onClick={exportResult}
          disabled={isExporting || !exportParams.schoolId}
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Export en cours...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Exporter
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
