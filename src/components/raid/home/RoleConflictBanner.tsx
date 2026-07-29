"use client";

import { useMeParticipant } from "@/hooks/raid/useMeParticipant";
import { useMeVolunteer } from "@/hooks/raid/useMeVolunteer";
import { useRouter } from "@/i18n/navigation";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import { AlertTriangle } from "lucide-react";

export const RoleConflictBanner = () => {
  const { me } = useMeParticipant();
  const { meVolunteer } = useMeVolunteer();
  const router = useRouter();

  if (!me || !meVolunteer) return null;

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Double inscription détectée</AlertTitle>
      <AlertDescription className="flex items-start justify-between gap-4 flex-wrap">
        <span>
          Vous êtes inscrit à la fois comme participant et comme bénévole. Ce
          cas n&apos;est pas supporté — contactez les organisateurs ou annulez
          l&apos;une des deux inscriptions.
        </span>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push("/team")}
          >
            Voir l&apos;équipe
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push("/volunteer")}
          >
            Voir le bénévolat
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
