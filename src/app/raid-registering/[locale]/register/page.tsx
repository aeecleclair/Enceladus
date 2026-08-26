"use client";

import { useAuth } from "@/app/authContext";
import { UserShell } from "@/components/raid/home/UserShell";
import { ParticipantRegisterCard } from "@/components/raid/register/ParticipantRegisterCard";
import { useMeParticipant } from "@/hooks/raid/useMeParticipant";
import { useMeVolunteer } from "@/hooks/raid/useMeVolunteer";
import { useRouter } from "@/i18n/navigation";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

const ParticipantRegisterPage = () => {
  const { isTokenQueried, token } = useAuth();
  const { me } = useMeParticipant();
  const { meVolunteer } = useMeVolunteer();
  const router = useRouter();
  const t = useTranslations("raid.register.page");

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

  const hasExistingRole = !!me || !!meVolunteer;

  return (
    <UserShell>
      <main className="mx-auto w-full py-4 sm:py-5">
        {hasExistingRole ? (
          <p className="text-center text-muted-foreground">
            {t("redirecting")}
          </p>
        ) : (
          <ParticipantRegisterCard />
        )}
      </main>
    </UserShell>
  );
};

export default ParticipantRegisterPage;
