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
import { useTranslations } from "next-intl";

interface TeamStatusBannerProps {
  team: RaidTeam;
}

const statusConfig: Record<
  RaidRegistrationStatus,
  {
    variant: "default" | "secondary" | "destructive" | "outline";
    Icon: typeof CheckCircle2;
  }
> = {
  draft: {
    variant: "secondary",
    Icon: FileEdit,
  },
  submitted: {
    variant: "outline",
    Icon: Clock,
  },
  validated: {
    variant: "default",
    Icon: CheckCircle2,
  },
  cancelled: {
    variant: "destructive",
    Icon: XCircle,
  },
};

export const TeamStatusBanner = ({ team }: TeamStatusBannerProps) => {
  const t = useTranslations("raid.team.status");
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
  const label = t(status);
  const description = t(`${status}Description`);

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
                {t("title")}
                <Badge variant={config.variant}>{label}</Badge>
              </CardTitle>
              <CardDescription>{description}</CardDescription>
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
                  {t("submit")}
                </LoadingButton>
              )}
              {status === "draft" && (team.validation_progress ?? 0) < 100 && (
                <span className="text-sm text-muted-foreground">
                  {t("progressHint", {
                    progress: (team.validation_progress ?? 0).toFixed(0),
                  })}
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
                  {t("reopen")}
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
