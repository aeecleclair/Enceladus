import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Button } from "../../ui/button";
import { useAuth } from "@/src/hooks/useAuth";
import { useEdition } from "@/src/hooks/useEdition";
import { toast } from "../../ui/use-toast";
import { Download, Users2, Loader2 } from "lucide-react";
import { useState } from "react";

export const CaptainsExport = () => {
  const { edition } = useEdition();
  const { token } = useAuth();
  const [isExporting, setIsExporting] = useState(false);

  const exportResult = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://hyperion.myecl.fr"}/competition/data-export/participants/captains`,
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
      link.download = `export_capitaines_${edition?.name || "competition"}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        description: "Export des capitaines réussi",
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
          <Users2 className="h-5 w-5 text-primary" />
          Export des capitaines
        </CardTitle>
        <CardDescription>
          Exporte la liste de tous les capitaines d&apos;équipe
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          className="w-full gap-2"
          type="button"
          onClick={exportResult}
          disabled={isExporting}
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
