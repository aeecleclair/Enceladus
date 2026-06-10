"use client";

import { IdentityForm } from "@/components/raid/register/IdentityForm";
import {
  RegisterStep,
  RegisterStepId,
  RegisterSteps,
} from "@/components/raid/register/RegisterSteps";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingButton } from "@/components/common/LoadingButton";
import { WarningDialog } from "@/components/common/WarningDialog";
import { useToast } from "@/components/ui/use-toast";
import { useMeParticipant } from "@/hooks/raid/useMeParticipant";
import { useMeTeam } from "@/hooks/raid/useMeTeam";
import { useMeVolunteer } from "@/hooks/raid/useMeVolunteer";
import { useInviteTokenStore } from "@/stores/raid/inviteTokenStore";
import { useInviteToken } from "@/hooks/raid/useInviteToken";
import { useMeUser } from "@/hooks/useMeUser";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { Users } from "lucide-react";

const steps: RegisterStep[] = [
  { id: "identity", label: "Informations" },
  { id: "confirm", label: "Équipe" },
];

export const ParticipantRegisterCard = () => {
  const { user } = useMeUser();
  const { createParticipant, isCreationLoading } = useMeParticipant();
  const { createTeam, isCreationLoading: isTeamCreationLoading } = useMeTeam();
  const { meVolunteer } = useMeVolunteer();
  const { joinTeam, isJoinLoading } = useInviteToken();
  const { inviteToken, resetInviteToken } = useInviteTokenStore();
  const { toast } = useToast();
  const router = useRouter();

  const hasIdentity = !!user?.phone && !!user?.birthday;
  const [identityConfirmed, setIdentityConfirmed] = useState(hasIdentity);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    if (hasIdentity) setIdentityConfirmed(true);
  }, [hasIdentity]);

  const handleCreateParticipant = () => {
    if (meVolunteer) {
      toast({
        title: "Inscription impossible",
        description:
          "Vous êtes déjà inscrit comme bénévole. Annulez cette inscription pour devenir participant.",
        variant: "destructive",
      });
      router.replace("/volunteer");
      return;
    }
    createParticipant(() => {
      if (inviteToken) {
        joinTeam(inviteToken, () => {
          resetInviteToken();
          toast({ title: "Équipe rejointe avec succès" });
          router.push("/team");
        });
      } else if (user) {
        createTeam({ name: `Équipe de ${user.firstname} ${user.name}` }, () => {
          toast({ title: "Équipe créée avec succès" });
          router.push("/team");
        });
      }
    });
  };

  const currentStep: RegisterStepId = identityConfirmed
    ? "confirm"
    : "identity";

  const stepMeta: Record<RegisterStepId, { title: string; subtitle: string }> =
    {
      identity: {
        title: "Complétez vos informations",
        subtitle:
          "Téléphone et date de naissance — nécessaires pour participer.",
      },
      confirm: {
        title: inviteToken ? "Rejoindre votre équipe" : "Créer votre équipe",
        subtitle: inviteToken
          ? "Vous allez rejoindre une équipe existante."
          : "Une équipe sera créée à votre nom. Vous pourrez ensuite inviter un coéquipier.",
      },
    };

  const renderStepBody = () => {
    if (!identityConfirmed) {
      return <IdentityForm onComplete={() => setIdentityConfirmed(true)} />;
    }
    return (
      <div className="space-y-3">
        <LoadingButton
          isLoading={
            isCreationLoading || isTeamCreationLoading || isJoinLoading
          }
          onClick={() => setIsAlertOpen(true)}
          className="w-full"
        >
          {inviteToken ? "Rejoindre l'équipe" : "Créer mon équipe"}
        </LoadingButton>
        <WarningDialog
          isOpened={isAlertOpen}
          setIsOpened={setIsAlertOpen}
          isLoading={
            isCreationLoading || isTeamCreationLoading || isJoinLoading
          }
          title={inviteToken ? "Rejoindre l'équipe" : "Créer mon équipe"}
          description={
            inviteToken
              ? "Vous allez rejoindre une équipe existante."
              : "Une nouvelle équipe sera créée à votre nom. Vous pourrez ensuite inviter un coéquipier."
          }
          validateLabel={inviteToken ? "Rejoindre" : "Créer"}
          callback={handleCreateParticipant}
          width="w-35"
        />
      </div>
    );
  };

  return (
    <Card className="mx-auto w-full max-w-3xl overflow-hidden border-border/70 bg-card shadow-sm">
      <CardHeader className="gap-5 border-b border-border/60 bg-muted/20 pb-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
            <Users className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-xl tracking-tight sm:text-2xl">
              Inscription au Raid
            </CardTitle>
            <CardDescription>
              Inscrivez-vous pour participer au Raid avec un coéquipier.
            </CardDescription>
          </div>
        </div>
        <RegisterSteps steps={steps} currentStep={currentStep} />
      </CardHeader>
      <CardContent className="space-y-6 pt-6 sm:pt-8">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">
            {stepMeta[currentStep].title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {stepMeta[currentStep].subtitle}
          </p>
        </div>
        {renderStepBody()}
      </CardContent>
    </Card>
  );
};
