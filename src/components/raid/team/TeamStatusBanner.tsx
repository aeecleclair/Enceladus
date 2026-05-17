"use client";

import { RaidParticipant, RaidRegistrationStatus, RaidTeam } from "@/api";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingButton } from "@/components/common/LoadingButton";
import { useParticipantLifecycle } from "@/hooks/raid/useParticipantLifecycle";
import { useMeParticipant } from "@/hooks/raid/useMeParticipant";
import { CheckCircle2, Clock, FileEdit, XCircle } from "lucide-react";

interface TeamStatusBannerProps {
  team: RaidTeam;
}

const statusConfig: Record<
  RaidRegistrationStatus,
  {
    label: string;
    description: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    Icon: typeof CheckCircle2;
  }
> = {
  draft: {
    label: "Brouillon",
    description:
      "Complétez vos informations puis soumettez votre inscription.",
    variant: "secondary",
    Icon: FileEdit,
  },
  submitted: {
    label: "Soumis",
    description:
      "Votre dossier est en cours d'examen par les organisateurs.",
    variant: "outline",
    Icon: Clock,
  },
  validated: {
    label: "Validé",
    description: "Félicitations, votre inscription est validée.",
    variant: "default",
    Icon: CheckCircle2,
  },
  cancelled: {
    label: "Annulé",
    description: "Votre inscription a été annulée.",
    variant: "destructive",
    Icon: XCircle,
  },
};

export const TeamStatusBanner = ({ team }: TeamStatusBannerProps) => {
  const { me, refetch: refetchMe } = useMeParticipant();
  const {
    submitParticipant,
    reopenParticipant,
    isSubmitLoading,
    isReopenLoading,
  } = useParticipantLifecycle();

  const selfFromTeam: RaidParticipant | undefined =
    team.captain?.user_id === me?.user_id
      ? team.captain
      : team.second?.user_id === me?.user_id
        ? team.second ?? undefined
        : undefined;

  const status = selfFromTeam?.status ?? me?.status ?? "draft";
  const config = statusConfig[status];
  const Icon = config.Icon;

  const canSubmit =
    status === "draft" && (team.validation_progress ?? 0) >= 100;
  const canReopen = status === "submitted" || status === "validated";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="flex items-center gap-2">
                Statut de mon inscription
                <Badge variant={config.variant}>{config.label}</Badge>
              </CardTitle>
              <CardDescription>{config.description}</CardDescription>
            </div>
          </div>
          {me && (
            <div className="flex gap-2">
              {canSubmit && (
                <LoadingButton
                  isLoading={isSubmitLoading}
                  onClick={() =>
                    submitParticipant(me.user_id, () => refetchMe())
                  }
                >
                  Soumettre mon inscription
                </LoadingButton>
              )}
              {status === "draft" && (team.validation_progress ?? 0) < 100 && (
                <span className="text-sm text-muted-foreground">
                  Progression {(team.validation_progress ?? 0).toFixed(0)}% —
                  complétez pour soumettre
                </span>
              )}
              {canReopen && (
                <LoadingButton
                  isLoading={isReopenLoading}
                  variant="outline"
                  onClick={() =>
                    reopenParticipant(me.user_id, () => refetchMe())
                  }
                >
                  Rouvrir
                </LoadingButton>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent />
    </Card>
  );
};
