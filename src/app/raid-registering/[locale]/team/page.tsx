"use client";

import { ParticipantCard } from "@/components/raid/home/participantView/ParicipantCard";
import { RegisteringCompleteDialog } from "@/components/raid/home/RegisteringCompleteDialog";
import { TeamCard } from "@/components/raid/home/teamCard/TeamCard";
import { UserShell } from "@/components/raid/home/UserShell";
import { DocumentsSummaryCard } from "@/components/raid/team/DocumentsSummaryCard";
import { EmptyParticipantCard } from "@/components/raid/team/EmptyParticipantCard";
import { TeamStatusBanner } from "@/components/raid/team/TeamStatusBanner";
import { UserStatusBadges } from "@/components/raid/home/UserStatusBadges";
import { Skeleton } from "@/components/ui/skeleton";
import { useMeParticipant } from "@/hooks/raid/useMeParticipant";
import { useMeTeam } from "@/hooks/raid/useMeTeam";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { useTranslations } from "next-intl";

const TeamPage = () => {
  const t = useTranslations("raid.team.page");
  const { isTokenQueried, token } = useAuth();
  const { me, isFetched } = useMeParticipant();
  const { team, isLoading: isTeamLoading } = useMeTeam();
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isTokenQueried && token === null) {
      router.replace("/login");
    }
  }, [isTokenQueried, token, router]);

  useEffect(() => {
    if (isFetched && me === undefined) {
      router.replace("/register");
    }
  }, [isFetched, me, router]);

  const isLoading = !isFetched || isTeamLoading;

  return (
    <UserShell>
      {team?.validation_progress === 100 && (
        <RegisteringCompleteDialog
          isOpened={isCompleteDialogOpen}
          setIsOpened={setIsCompleteDialogOpen}
        />
      )}
      <main className="mx-auto flex w-full flex-col gap-5 py-4 sm:py-5">
        <section className="rounded-2xl border border-border/70 bg-card/85 p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                {t("title")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("subtitle")}
              </p>
              <UserStatusBadges />
            </div>
          </div>
        </section>
        {isLoading ? (
          <>
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : (
          <>
            <TeamCard team={team} />
            {team && <TeamStatusBanner team={team} />}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
              <ParticipantCard participant={team?.captain} isCaptain />
              {team?.second ? (
                <ParticipantCard participant={team.second} isCaptain={false} />
              ) : (
                <EmptyParticipantCard team={team} />
              )}
            </div>
            {team && <DocumentsSummaryCard team={team} />}
          </>
        )}
      </main>
    </UserShell>
  );
};

export default TeamPage;
