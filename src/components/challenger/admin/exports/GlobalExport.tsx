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
import { Download, Database, Loader2 } from "lucide-react";
import { Separator } from "../../ui/separator";

export const GlobalExport = () => {
  const { edition } = useEdition();
  const { token } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [exportParams, setExportParams] = useState<{
    excludeNonValidated: boolean;
    participants: boolean;
    purchases: boolean;
    payments: boolean;
  }>({
    excludeNonValidated: false,
    participants: true,
    purchases: true,
    payments: true,
  });

  const exportResult = async () => {
    setIsExporting(true);
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://hyperion.myecl.fr"}/competition/data-export/users${params ? "?" + params : ""}`,
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
      link.download = `export_complet_${edition?.name || "competition"}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        description: "Export complet réussi",
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
          <Database className="h-5 w-5 text-primary" />
          Export complet
        </CardTitle>
        <CardDescription>
          Exporte toutes les données des utilisateurs avec options
          personnalisées
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
