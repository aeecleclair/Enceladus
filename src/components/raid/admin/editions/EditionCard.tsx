"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RaidEdition } from "@/api";
import { formatDate } from "@/lib/dateFormat";
import { useEditions } from "@/hooks/raid/useEditions";
import { LoadingButton } from "@/components/common/LoadingButton";

interface EditionCardProps {
  edition: RaidEdition;
  onDelete: (edition: RaidEdition) => void;
  onEdit: (edition: RaidEdition) => void;
}

export const EditionCard = ({
  edition,
  onDelete,
  onEdit,
}: EditionCardProps) => {
  const { activateEdition, updateEdition, isUpdateLoading, isDeleteLoading } =
    useEditions();

  const toggleInscription = () => {
    updateEdition(edition.id, {
      inscription_enabled: !edition.inscription_enabled,
    });
  };

  return (
    <Card
      className={`shadow-sm ${
        edition.active
          ? "border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/10"
          : "border-border/70 bg-card/95"
      }`}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <CardTitle>{edition.name}</CardTitle>
            <CardDescription>Année {edition.year}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            {edition.active && (
              <Badge
                variant="outline"
                className="bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
              >
                Active
              </Badge>
            )}
            {edition.inscription_enabled && (
              <Badge
                variant="outline"
                className="bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300"
              >
                Inscriptions ouvertes
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-muted-foreground">Début</span>
          <span className="font-medium">
            {edition.start_date ? formatDate(edition.start_date) : "—"}
          </span>
          <span className="text-muted-foreground">Fin</span>
          <span className="font-medium">
            {edition.end_date ? formatDate(edition.end_date) : "—"}
          </span>
          <span className="text-muted-foreground">Fin des inscriptions</span>
          <span className="font-medium">
            {edition.registering_end_date
              ? formatDate(edition.registering_end_date)
              : "—"}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {!edition.active && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => activateEdition(edition.id)}
            >
              Activer
            </Button>
          )}
          <LoadingButton
            size="sm"
            variant="outline"
            isLoading={isUpdateLoading}
            onClick={toggleInscription}
          >
            {edition.inscription_enabled
              ? "Fermer les inscriptions"
              : "Ouvrir les inscriptions"}
          </LoadingButton>
          <Button size="sm" variant="outline" onClick={() => onEdit(edition)}>
            Modifier
          </Button>
          <LoadingButton
            size="sm"
            variant="destructive"
            isLoading={isDeleteLoading}
            onClick={() => onDelete(edition)}
          >
            Supprimer
          </LoadingButton>
        </div>
      </CardContent>
    </Card>
  );
};
