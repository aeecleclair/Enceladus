"use client";

import { RaidParticipant } from "@/api";
import { StatsView } from "@/components/raid/admin/StatsView";
import { TeamsPreview } from "@/components/raid/admin/TeamsPreview";
import { TopBar } from "@/components/raid/admin/TopBar";
import { TeamInfoCard } from "@/components/raid/home/teamCard/TeamInfoCard";
import { useHasRaidPermission } from "@/hooks/raid/useHasRaidPermission";
import { useInformation } from "@/hooks/raid/useInformation";
import { useTeams } from "@/hooks/raid/useTeams";
import { useRouter } from "@/i18n/navigation";
import { formatDate, getDaysLeft } from "@/lib/dateFormat";

const Dashboard = () => {
  const { isRaidAdmin } = useHasRaidPermission();
  const { teams, isLoading } = useTeams();
  const { information } = useInformation();
  const router = useRouter();

  const twoMembersTeam = teams?.filter((team) => team.second !== null);

  const allParticipants =
    (teams
      ?.map((team) => [team.captain, team.second])
      .flat(1)
      .filter((participant) => participant !== null) as RaidParticipant[]) ??
    [];

  const allPayments = allParticipants
    ?.map((participant) => (participant.payment ? 1 : 0))
    .reduce<number>((a, b) => a + b, 0);

  const isRegisteringOpen = information?.raid_registering_end_date
    ? getDaysLeft(information?.raid_registering_end_date) >= 0
    : false;

  const informationCard = [
    {
      title: "Participants inscrits",
      value: allParticipants?.length.toString() || "0",
      description: "inscriptions débutées",
      unit: undefined,
    },
    {
      title: "Binômes constitués",
      value: twoMembersTeam?.length.toString() || "0",
      description: `${
        allParticipants?.length - 2 * (twoMembersTeam?.length || 0)
      } participants sans binôme`,
      unit: undefined,
    },
    {
      title: "Paiements efectués",
      value: allPayments?.toString() || "0",
      description: `${
        allParticipants?.length - allPayments
      } paiements manquants`,
      unit: undefined,
    },
    {
      title: "Equipes validées",
      value:
        teams
          ?.filter((team) => team.validation_progress === 100)
          .length.toString() || "0",
      description: "dossiers complets validés et payés",
      unit: undefined,
    },
    {
      title: "Cloture des inscriptions",
      value: information?.raid_registering_end_date
        ? formatDate(information?.raid_registering_end_date)
        : "Date non renseignée",
      description: information?.raid_registering_end_date
        ? isRegisteringOpen
          ? `${getDaysLeft(
              information?.raid_registering_end_date,
            )} jours restants`
          : "Inscriptions fermées"
        : "Date de fin non renseignée",
      unit: undefined,
    },
  ];

  if (!isRaidAdmin && typeof window !== "undefined") {
    router.replace("/?redirect=/admin");
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <TopBar />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-3 md:gap-8 lg:grid-cols-5">
          {informationCard.map((info) => (
            <TeamInfoCard info={info} key={info.title} isLoaded={!isLoading} />
          ))}
        </div>
        <div className="grid gap-4 md:gap-8 xl:grid-cols-3">
          <TeamsPreview teams={teams} isLoading={isLoading} />
          <StatsView teams={teams} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
