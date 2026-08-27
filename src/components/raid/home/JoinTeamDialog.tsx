import { LoadingButton } from "@/components/common/LoadingButton";
import { useInviteToken } from "@/hooks/raid/useInviteToken";
import { useMeTeam } from "@/hooks/raid/useMeTeam";
import { useInviteTokenStore } from "@/stores/raid/inviteTokenStore";

import { DialogDescription } from "@radix-ui/react-dialog";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface JoinTeamDialogProps {
  isOpened: boolean;
  setIsOpened: (value: boolean) => void;
}

export const JoinTeamDialog = ({
  isOpened,
  setIsOpened,
}: JoinTeamDialogProps) => {
  const { inviteToken, resetInviteToken } = useInviteTokenStore();
  const { joinTeam, isJoinLoading } = useInviteToken();
  const { refetchTeam } = useMeTeam();

  function closeDialog() {
    setIsOpened(false);
    resetInviteToken();
  }

  function onJoinTeam() {
    if (inviteToken === undefined) return;
    joinTeam(inviteToken, () => {
      refetchTeam();
      closeDialog();
    });
  }

  return (
    <Dialog open={isOpened} onOpenChange={setIsOpened}>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle>Rejoindre une équipe</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Vous vous apprêtez à rejoindre une équipe et quitter votre équipe
          actuelle. Toutes vos informations seront transférées à votre nouvelle
          équipe.
        </DialogDescription>
        <div className="flex justify-end mt-2 space-x-4">
          <Button
            variant="outline"
            onClick={closeDialog}
            disabled={isJoinLoading}
          >
            Annuler
          </Button>
          <LoadingButton
            isLoading={isJoinLoading}
            onClick={onJoinTeam}
            className="w-35"
          >
            Rejoindre l&apos;équipe
          </LoadingButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};
