"use client";

import { useAuth } from "@/app/authContext";
import { LoadingButton } from "@/components/common/LoadingButton";
import { WarningDialog } from "@/components/common/WarningDialog";
import { UserShell } from "@/components/raid/home/UserShell";
import { IdentityForm } from "@/components/raid/register/IdentityForm";
import {
  RegisterStep,
  RegisterStepId,
  RegisterSteps,
} from "@/components/raid/register/RegisterSteps";
import { useMeParticipant } from "@/hooks/raid/useMeParticipant";
import { useMeVolunteer } from "@/hooks/raid/useMeVolunteer";
import { useMeUser } from "@/hooks/useMeUser";
import { useRouter } from "@/i18n/navigation";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

import { ArrowLeft, HeartHandshake } from "lucide-react";

const VolunteerRegisterPage = () => {
  const t = useTranslations("raid.volunteer.registerPage");
  const steps: RegisterStep[] = [
    { id: "identity", label: t("stepIdentity") },
    { id: "confirm", label: t("stepConfirm") },
  ];
  const { isTokenQueried, token } = useAuth();
  const { user } = useMeUser();
  const { me } = useMeParticipant();
  const {
    meVolunteer,
    createMeVolunteer,
    isCreateLoading: isVolunteerCreating,
  } = useMeVolunteer();
  const { toast } = useToast();
  const router = useRouter();

  const hasIdentity = !!user?.phone && !!user?.birthday;
  const [identityConfirmed, setIdentityConfirmed] = useState(hasIdentity);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // Adjust state during render (React-recommended) rather than in an effect.
  if (hasIdentity && !identityConfirmed) {
    setIdentityConfirmed(true);
  }

  useEffect(() => {
    if (isTokenQueried && token === null) {
      router.replace("/login");
    }
  }, [isTokenQueried, token, router]);

  useEffect(() => {
    if (me) router.replace("/team");
  }, [me, router]);

  useEffect(() => {
    if (meVolunteer) router.replace("/volunteer");
  }, [meVolunteer, router]);

  const handleCreateVolunteer = () => {
    if (me) {
      toast({
        title: t("alreadyParticipantTitle"),
        description: t("alreadyParticipantDescription"),
        variant: "destructive",
      });
      router.replace("/team");
      return;
    }
    createMeVolunteer(
      {
        has_car: false,
        is_special_driver: false,
        is_utility_vehicle_driver: false,
        is_parcours_helper: false,
      },
      () => router.push("/volunteer"),
    );
  };

  const hasExistingRole = !!me || !!meVolunteer;
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
        title: t("confirmTitle"),
        subtitle: t("confirmSubtitle"),
      },
    };

  const renderStepBody = () => {
    if (!identityConfirmed) {
      return <IdentityForm onComplete={() => setIdentityConfirmed(true)} />;
    }
    return (
      <div className="space-y-3">
        <LoadingButton
          isLoading={isVolunteerCreating}
          onClick={() => setIsAlertOpen(true)}
          className="w-full"
        >
          {t("confirmButton")}
        </LoadingButton>
        <WarningDialog
          isOpened={isAlertOpen}
          setIsOpened={setIsAlertOpen}
          isLoading={isVolunteerCreating}
          title={t("dialogTitle")}
          description={t("dialogDescription")}
          validateLabel={t("dialogValidate")}
          callback={handleCreateVolunteer}
          width="w-35"
        />
      </div>
    );
  };

  return (
    <UserShell>
      <main className="mx-auto w-full max-w-3xl py-4 sm:py-5">
        {hasExistingRole ? (
          <p className="text-center text-muted-foreground">
            {t("redirecting")}
          </p>
        ) : (
          <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
            <CardHeader className="gap-5 border-b border-border/60 bg-muted/20 pb-6">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-700 dark:text-orange-400">
                    <HeartHandshake className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-xl tracking-tight sm:text-2xl">
                      {t("cardTitle")}
                    </CardTitle>
                    <CardDescription>{t("cardDescription")}</CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t("changeRole")}
                </Button>
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
        )}
      </main>
    </UserShell>
  );
};

export default VolunteerRegisterPage;
