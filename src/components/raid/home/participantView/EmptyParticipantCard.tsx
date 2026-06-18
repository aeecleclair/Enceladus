import { RaidTeam } from "@/api";
import { LoadingButton } from "@/components/common/LoadingButton";
import { useInviteToken } from "@/hooks/raid/useInviteToken";

import { useState } from "react";
import { HiPlus } from "react-icons/hi";

import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface EmptyParticipantCardProps {
  team?: RaidTeam;
}

export const EmptyParticipantCard = ({ team }: EmptyParticipantCardProps) => {
  const { toast } = useToast();
  const { createInviteToken, isCreationLoading } = useInviteToken();
  const [invitationLink, setInvitationLink] = useState<string | null>(null);
  function createInviteLink() {
    if (team === undefined) {
      return;
    }
    createInviteToken(team.id, async (token) => {
      const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
      if (!frontendUrl) {
        console.error("Frontend URL is not defined");
        return;
      }
      const splitURL = frontendUrl.split("://");
      const inviteLink = `${splitURL[0]}://raid-registering.${splitURL[1]}?invite=${token.token}`;
      setInvitationLink(inviteLink);
      try {
        await navigator.clipboard.writeText(inviteLink);
        toast({
          title: "Invitation envoyée",
          description: `Le lien d'invitation a été copié dans le presse-papier.`,
        });
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: `Impossible de copier le lien d'invitation dans le presse-papier.`,
        });
      }
    });
  }
  return (
    <Card className="w-full">
      <CardContent className="w-full h-full">
        <div className="flex m-auto h-full mt-3 flex-col">
          <div className="flex m-auto flex-col items-center">
            <LoadingButton
              isLoading={isCreationLoading}
              onClick={createInviteLink}
              className="w-50"
              variant="outline"
            >
              <>
                <HiPlus className="inline mr-4" />
                <span>Inviter un participant</span>
              </>
            </LoadingButton>
            {invitationLink && (
              <span className="text-sm text-muted-foreground mt-4">
                {invitationLink}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
