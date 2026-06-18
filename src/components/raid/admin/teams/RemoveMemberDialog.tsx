import { RaidParticipantPreview, RaidTeamPreview } from "@/api";
import { LoadingButton } from "@/components/common/LoadingButton";

import { DialogDescription } from "@radix-ui/react-dialog";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RemoveMemberDialogProps {
  isOpened: boolean;
  setIsOpened: (value: boolean) => void;
  isLoading: boolean;
  title: string;
  team: RaidTeamPreview;
  validateLabel: string;
  callback: (participantId: string) => void;
}

const RemoveParticipantCard = (
  participant: RaidParticipantPreview,
  selectedMember: RaidParticipantPreview | null,
  setSelectedMember: (value: RaidParticipantPreview | null) => void,
) => {
  return (
    <Card
      className={
        selectedMember === participant ? "border-2 border-primary " : "my-px"
      }
      onClick={() => setSelectedMember(participant)}
    >
      <CardContent className="flex flex-col justify-between items-center">
        <div className="h-5"></div>
        <p className="text-lg font-semibold">
          {participant.user.firstname} {participant.user.name}
        </p>
        <p className="text-sm text-foreground-muted">
          {participant.user.email}
        </p>
      </CardContent>
    </Card>
  );
};

export const RemoveMemberDialog = ({
  isOpened,
  setIsOpened,
  isLoading,
  title,
  team,
  validateLabel,
  callback,
}: RemoveMemberDialogProps) => {
  const [selectedMember, setSelectedMember] =
    useState<RaidParticipantPreview | null>(null);

  function closeDialog(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setIsOpened(false);
  }

  function onValidate(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    if (!selectedMember) return;
    callback(selectedMember?.user_id);
  }

  return (
    <Dialog open={isOpened} onOpenChange={setIsOpened}>
      <DialogContent
        className="sm:max-w-150"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="grid gap-4 grid-cols-2 mt-2">
            {team.captain &&
              RemoveParticipantCard(
                team.captain,
                selectedMember,
                setSelectedMember,
              )}
            {team.second &&
              RemoveParticipantCard(
                team.second,
                selectedMember,
                setSelectedMember,
              )}
          </div>
        </DialogDescription>
        <div className="flex justify-end mt-2 space-x-4">
          <Button
            variant="outline"
            onClick={closeDialog}
            disabled={isLoading}
            className="w-25"
          >
            Annuler
          </Button>
          <LoadingButton
            isLoading={isLoading}
            onClick={onValidate}
            className="w-25"
            disabled={!selectedMember}
          >
            {validateLabel}
          </LoadingButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};
