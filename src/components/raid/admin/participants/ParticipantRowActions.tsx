"use client";
import { RaidParticipantPreview } from "@/api";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useParticipantLifecycle } from "@/hooks/raid/useParticipantLifecycle";
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
  const {
    validateParticipant,
    cancelParticipant,
    reopenParticipant,
    submitParticipant,
  } = useParticipantLifecycle();

  const status = participant.status;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {status === "draft" && (
          <DropdownMenuItem
            onClick={() => submitParticipant(participant.user_id)}
          >
            Soumettre
          </DropdownMenuItem>
        )}
        {status === "submitted" && (
          <DropdownMenuItem
            onClick={() => validateParticipant(participant.user_id)}
          >
            Valider
          </DropdownMenuItem>
        )}
        {(status === "submitted" || status === "validated") && (
          <DropdownMenuItem
            onClick={() => reopenParticipant(participant.user_id)}
          >
            Rouvrir
          </DropdownMenuItem>
        )}
        {status !== "cancelled" && (
          <DropdownMenuItem
            onClick={() => cancelParticipant(participant.user_id)}
            className="text-destructive"
          >
            Annuler
          </DropdownMenuItem>
        )}
        {teamId && onOpenTeam && (
          <DropdownMenuItem onClick={() => onOpenTeam(teamId)}>
            Voir l&apos;équipe
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
