import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
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

export const SchoolQuotasExport = () => {
  const { edition } = useEdition();
  const { token } = useAuth();
  const { sportSchools } = useSportSchools();
  const [schoolId, setSchoolId] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const exportResult = async () => {
    if (!schoolId) {
      toast({
        description: "Veuillez sélectionner une école",
        variant: "destructive",
      });
      return;
    }
    setIsExporting(true);
    const school = sportSchools?.find((s) => s.school_id === schoolId);
    const schoolName = school?.school.name
      ? formatSchoolName(school.school.name)
      : schoolId;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://hyperion.myecl.fr"}/competition/data-export/schools/${schoolId}/quotas`,
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
      link.download = `export_ecole_${schoolName}_quotas_${edition?.name || "competition"}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        description: "Export des quotas de l'école réussi",
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
          Quotas par école
        </CardTitle>
        <CardDescription>
          Exporte les quotas d&apos;une école spécifique
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={schoolId} onValueChange={(value) => setSchoolId(value)}>
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

        <Button
          className="w-full gap-2"
          type="button"
          onClick={exportResult}
          disabled={isExporting || !schoolId}
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
