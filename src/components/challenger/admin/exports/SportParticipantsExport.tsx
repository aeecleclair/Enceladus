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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { useSports } from "@/src/hooks/useSports";
import { Download, Trophy, Loader2 } from "lucide-react";

export const SportParticipantsExport = () => {
  const { edition } = useEdition();
  const { token } = useAuth();
  const { sports } = useSports();
  const [sportId, setSportId] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const activeSports = sports?.filter((sport) => sport.active);

  const exportResult = async () => {
    if (!sportId) {
      toast({
        description: "Veuillez sélectionner un sport",
        variant: "destructive",
      });
      return;
    }
    setIsExporting(true);
    const sport = sports?.find((s) => s.id === sportId);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://hyperion.myecl.fr"}/competition/data-export/sports/${sportId}/participants`,
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
      link.download = `export_sport_${sport?.name ?? sportId}_participants_${edition?.name || "competition"}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        description: "Export des participants du sport réussi",
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
          <Trophy className="h-5 w-5 text-primary" />
          Participants par sport
        </CardTitle>
        <CardDescription>
          Exporte la liste des participants d&apos;un sport spécifique
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={sportId} onValueChange={(value) => setSportId(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un sport" />
          </SelectTrigger>
          <SelectContent>
            {activeSports?.map((sport) => (
              <SelectItem key={sport.id} value={sport.id}>
                {sport.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          className="w-full gap-2"
          type="button"
          onClick={exportResult}
          disabled={isExporting || !sportId}
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
