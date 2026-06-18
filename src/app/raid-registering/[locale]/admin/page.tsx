"use client";

import { RaidParticipantPreview } from "@/api";
import { PageHeader } from "@/components/raid/admin/PageHeader";
import { StatsView } from "@/components/raid/admin/StatsView";
import { TeamsPreview } from "@/components/raid/admin/TeamsPreview";
import { TeamInfoCard } from "@/components/raid/home/teamCard/TeamInfoCard";
import { useAdminVolunteers } from "@/hooks/raid/useAdminVolunteers";
import { useEdition } from "@/hooks/raid/useEdition";
import { useTeams } from "@/hooks/raid/useTeams";
import { formatDate, getDaysLeft } from "@/lib/dateFormat";

import { LayoutDashboard } from "lucide-react";

const Dashboard = () => {
  const { teams, isLoading } = useTeams();
  const { volunteers, isLoading: isVolunteersLoading } = useAdminVolunteers();
  const { edition } = useEdition();

  const twoMembersTeam = teams?.filter((team) => team.second !== null) ?? [];

  const allParticipants =
    (teams
      ?.map((team) => [team.captain, team.second])
      .flat(1)
      .filter(
        (participant) => participant !== null,
      ) as RaidParticipantPreview[]) ?? [];

  const allPayments = allParticipants
    ?.map((participant) => (participant.payment ? 1 : 0))
    .reduce<number>((a, b) => a + b, 0);

  const validatedVolunteers =
    volunteers?.filter((v) => v.validated && !v.cancelled).length ?? 0;
  const pendingVolunteers =
    volunteers?.filter((v) => !v.validated && !v.cancelled).length ?? 0;

  const isRegisteringOpen = edition?.registering_end_date
    ? getDaysLeft(edition.registering_end_date) >= 0
    : false;

  const informationCard: import("@/components/raid/home/teamCard/TeamInfoCard").TeamInfo[] =
    [
      {
        title: "Participants inscrits",
        value: allParticipants?.length.toString() || "0",
        description: "inscriptions débutées",
        accent: "emerald",
      },
      {
        title: "Binômes constitués",
        value: twoMembersTeam.length.toString() || "0",
        description: `${
          allParticipants.length - 2 * twoMembersTeam.length
        } participants sans binôme`,
        accent: "emerald",
      },
      {
        title: "Paiements effectués",
        value: allPayments?.toString() || "0",
        description: `${allParticipants.length - allPayments} paiements manquants`,
        accent: "violet",
      },
      {
        title: "Équipes validées",
        value:
          teams
            ?.filter((team) => team.validation_progress === 100)
            .length.toString() || "0",
        description: "dossiers complets validés et payés",
        accent: "emerald",
      },
      {
        title: "Bénévoles",
        value: validatedVolunteers.toString(),
        description: `${pendingVolunteers} en attente de validation`,
        accent: "orange",
      },
      {
        title: "Clôture des inscriptions",
        value: edition?.registering_end_date
          ? formatDate(edition.registering_end_date)
          : "Date non renseignée",
        description: edition?.registering_end_date
          ? isRegisteringOpen
            ? `${getDaysLeft(edition.registering_end_date)} jours restants`
            : "Inscriptions fermées"
          : "Date de fin non renseignée",
        accent: isRegisteringOpen ? "amber" : "rose",
      },
    ];

  return (
    <div className="flex flex-1 flex-col gap-5 md:gap-6">
      <PageHeader
        icon={LayoutDashboard}
        title="Tableau de bord admin"
        description="Vision globale des inscriptions participants et bénévoles."
        accent="violet"
      />
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
        {informationCard.map((info) => (
          <TeamInfoCard
            info={info}
            key={info.title}
            isLoaded={!isLoading && !isVolunteersLoading}
          />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <TeamsPreview teams={teams} isLoading={isLoading} />
        <StatsView teams={teams} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Dashboard;
