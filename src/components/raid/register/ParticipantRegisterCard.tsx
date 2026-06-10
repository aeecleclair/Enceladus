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
import { useTranslations } from "next-intl";

export const ParticipantRegisterCard = () => {
  const t = useTranslations("raid.register.participantCard");
  const steps: RegisterStep[] = [
    { id: "identity", label: t("stepIdentity") },
    { id: "confirm", label: t("stepTeam") },
  ];
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
        title: t("alreadyVolunteerTitle"),
        description: t("alreadyVolunteerDescription"),
        variant: "destructive",
      });
      router.replace("/volunteer");
      return;
    }
    createParticipant(() => {
      if (inviteToken) {
        joinTeam(inviteToken, () => {
          resetInviteToken();
          toast({ title: t("teamJoined") });
          router.push("/team");
        });
      } else if (user) {
        createTeam(
          {
            name: t("teamNameDefault", {
              firstname: user.firstname,
              name: user.name,
            }),
          },
          () => {
            toast({ title: t("teamCreated") });
            router.push("/team");
          },
        );
      }
    });
  };

  const currentStep: RegisterStepId = identityConfirmed
    ? "confirm"
    : "identity";

  const stepMeta: Record<RegisterStepId, { title: string; subtitle: string }> =
    {
      identity: {
        title: t("identityTitle"),
        subtitle: t("identitySubtitle"),
      },
      confirm: {
        title: inviteToken ? t("joinTitle") : t("createTitle"),
        subtitle: inviteToken ? t("joinSubtitle") : t("createSubtitle"),
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
          {inviteToken ? t("joinButton") : t("createButton")}
        </LoadingButton>
        <WarningDialog
          isOpened={isAlertOpen}
          setIsOpened={setIsAlertOpen}
          isLoading={
            isCreationLoading || isTeamCreationLoading || isJoinLoading
          }
          title={inviteToken ? t("joinButton") : t("createButton")}
          description={
            inviteToken
              ? t("confirmJoinDescription")
              : t("confirmCreateDescription")
          }
          validateLabel={inviteToken ? t("confirmJoin") : t("confirmCreate")}
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
              {t("cardTitle")}
            </CardTitle>
            <CardDescription>{t("cardDescription")}</CardDescription>
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
