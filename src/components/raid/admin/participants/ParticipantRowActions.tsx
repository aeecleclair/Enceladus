"use client";
import { RaidParticipantPreview } from "@/api";
import { useParticipantLifecycle } from "@/hooks/raid/useParticipantLifecycle";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal } from "lucide-react";

interface ParticipantRowActionsProps {
  participant: RaidParticipantPreview;
  teamId?: string;
  onOpenTeam?: (teamId: string) => void;
}

export const ParticipantRowActions = ({
  participant,
  teamId,
  onOpenTeam,
}: ParticipantRowActionsProps) => {
  const { validateParticipant, cancelParticipant, reopenParticipant } =
    useParticipantLifecycle();
  const t = useTranslations("raid.admin.participants");

  const status = participant.status;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {status === "submitted" && (
          <DropdownMenuItem
            onClick={() => validateParticipant(participant.user_id)}
          >
            {t("actions.validate")}
          </DropdownMenuItem>
        )}
        {(status === "submitted" || status === "validated") && (
          <DropdownMenuItem
            onClick={() => reopenParticipant(participant.user_id)}
          >
            {t("actions.reopen")}
          </DropdownMenuItem>
        )}
        {status !== "cancelled" && (
          <DropdownMenuItem
            onClick={() => cancelParticipant(participant.user_id)}
            className="text-destructive"
          >
            {t("actions.cancel")}
          </DropdownMenuItem>
        )}
        {teamId && onOpenTeam && (
          <DropdownMenuItem onClick={() => onOpenTeam(teamId)}>
            {t("viewTeam")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
