"use client";

import { RaidParticipantRestricted } from "@/api";
import { PageHeader } from "@/components/raid/admin/PageHeader";
import { StatsView } from "@/components/raid/admin/StatsView";
import { TeamsPreview } from "@/components/raid/admin/TeamsPreview";
import { TeamInfoCard } from "@/components/raid/home/teamCard/TeamInfoCard";
import { useAdminVolunteers } from "@/hooks/raid/useAdminVolunteers";
import { useEdition } from "@/hooks/raid/useEdition";
import { useTeams } from "@/hooks/raid/useTeams";
import { formatDate, getDaysLeft } from "@/lib/dateFormat";

import { useTranslations } from "next-intl";

import { LayoutDashboard } from "lucide-react";

const Dashboard = () => {
  const t = useTranslations("raid.admin.dashboard");
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
      ) as RaidParticipantRestricted[]) ?? [];

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
        title: t("registeredParticipants"),
        value: allParticipants?.length.toString() || "0",
        description: t("registeredParticipantsDesc"),
        accent: "emerald",
      },
      {
        title: t("formedTeams"),
        value: twoMembersTeam.length.toString() || "0",
        description: t("formedTeamsDesc", {
          count: allParticipants.length - 2 * twoMembersTeam.length,
        }),
        accent: "emerald",
      },
      {
        title: t("paymentsDone"),
        value: allPayments?.toString() || "0",
        description: t("paymentsDoneDesc", {
          count: allParticipants.length - allPayments,
        }),
        accent: "violet",
      },
      {
        title: t("validatedTeams"),
        value:
          teams
            ?.filter((team) => team.validation_progress === 100)
            .length.toString() || "0",
        description: t("validatedTeamsDesc"),
        accent: "emerald",
      },
      {
        title: t("volunteers"),
        value: validatedVolunteers.toString(),
        description: t("volunteersDesc", { count: pendingVolunteers }),
        accent: "orange",
      },
      {
        title: t("registeringDeadline"),
        value: edition?.registering_end_date
          ? formatDate(edition.registering_end_date)
          : t("noDeadline"),
        description: edition?.registering_end_date
          ? isRegisteringOpen
            ? t("daysLeft", {
                count: getDaysLeft(edition.registering_end_date),
              })
            : t("registrationsClosed")
          : t("noEndDate"),
        accent: isRegisteringOpen ? "amber" : "rose",
      },
    ];

  return (
    <div className="flex flex-1 flex-col gap-5 md:gap-6">
      <PageHeader
        icon={LayoutDashboard}
        title={t("title")}
        description={t("description")}
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
