"use client";

import { useMeParticipant } from "@/hooks/raid/useMeParticipant";
import { useMeVolunteer } from "@/hooks/raid/useMeVolunteer";
import { useRouter } from "@/i18n/navigation";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";

export const RoleConflictBanner = () => {
  const t = useTranslations("raid.common");
  const { me } = useMeParticipant();
  const { meVolunteer } = useMeVolunteer();
  const router = useRouter();

  if (!me || !meVolunteer || meVolunteer.cancelled) return null;

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{t("doubleRegistrationTitle")}</AlertTitle>
      <AlertDescription className="flex items-start justify-between gap-4 flex-wrap">
        <span>{t("doubleRegistrationDescription")}</span>
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
