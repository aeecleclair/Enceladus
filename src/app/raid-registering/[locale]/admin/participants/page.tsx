"use client";

import { RaidParticipantPreview, RaidRegistrationStatus } from "@/api";
import { PageHeader } from "@/components/raid/admin/PageHeader";
import { ParticipantRowActions } from "@/components/raid/admin/participants/ParticipantRowActions";
import { ParticipantSheet } from "@/components/raid/admin/participants/ParticipantSheet";
import { useAdminParticipants } from "@/hooks/raid/useAdminParticipants";
import { useTeams } from "@/hooks/raid/useTeams";
import { useRouter } from "@/i18n/navigation";
import { participantStatusClass as statusClass } from "@/lib/raid/participantStatus";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Users } from "lucide-react";

type StatusFilter = RaidRegistrationStatus | "all";

type ParticipantRow = {
  participant: RaidParticipantPreview;
  teamId?: string;
  teamName: string;
};

const ParticipantsAdminPage = () => {
  const { teams, isLoading: isTeamsLoading } = useTeams();
  const { participants, isLoading: isParticipantsLoading } =
    useAdminParticipants();
  const isLoading = isTeamsLoading || isParticipantsLoading;
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [openParticipant, setOpenParticipant] = useState<{
    userId: string;
    teamId?: string;
  } | null>(null);
  const t = useTranslations("raid.admin.participants");
  const ts = useTranslations("raid.common.status");

  const statusLabel: Record<RaidRegistrationStatus, string> = {
    draft: ts("draft"),
    submitted: ts("submitted"),
    validated: ts("validated"),
    cancelled: ts("cancelled"),
  };

  const rows = useMemo<ParticipantRow[]>(() => {
    if (!participants) return [];
    const teamByParticipant = new Map<string, { id: string; name: string }>();
    for (const team of teams ?? []) {
      teamByParticipant.set(team.captain_id, { id: team.id, name: team.name });
      if (team.second_id) {
        teamByParticipant.set(team.second_id, {
          id: team.id,
          name: team.name,
        });
      }
    }
    return participants.map((participant) => {
      const team = teamByParticipant.get(participant.user_id);
      return {
        participant,
        teamId: team?.id,
        teamName: team?.name ?? "—",
      };
    });
  }, [participants, teams]);

  const filtered = useMemo(() => {
    return rows.filter(({ participant, teamName }) => {
      if (statusFilter !== "all" && participant.status !== statusFilter)
        return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        participant.user.firstname.toLowerCase().includes(q) ||
        participant.user.name.toLowerCase().includes(q) ||
        participant.user.email.toLowerCase().includes(q) ||
        teamName.toLowerCase().includes(q)
      );
    });
  }, [rows, search, statusFilter]);

  const openTeam = (teamId: string) => {
    router.push(`/admin/teams?teamId=${teamId}`);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        icon={Users}
        title={t("title")}
        description={t("subtitle")}
        accent="emerald"
      />
      <Card className="border-border/70 bg-card/95 shadow-sm">
        <CardHeader>
          <CardTitle>{t("listTitle")}</CardTitle>
          <CardDescription>{t("listSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-muted/20 p-2">
            <Input
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm bg-background"
            />
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as StatusFilter)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filterAll")}</SelectItem>
                <SelectItem value="draft">{ts("draft")}</SelectItem>
                <SelectItem value="submitted">{ts("submitted")}</SelectItem>
                <SelectItem value="validated">{ts("validated")}</SelectItem>
                <SelectItem value="cancelled">{ts("cancelled")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border/60">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("columns.participant")}</TableHead>
                    <TableHead>{t("columns.team")}</TableHead>
                    <TableHead>{t("columns.status")}</TableHead>
                    <TableHead>{t("columns.payment")}</TableHead>
                    <TableHead>{t("columns.tshirt")}</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground"
                      >
                        {t("empty")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map(({ participant, teamId, teamName }) => (
                      <TableRow
                        key={participant.user_id}
                        className="cursor-pointer"
                        onClick={() =>
                          setOpenParticipant({
                            userId: participant.user_id,
                            teamId,
                          })
                        }
                      >
                        <TableCell>
                          <div className="font-medium">
                            {participant.user.firstname} {participant.user.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {participant.user.email}
                          </div>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          {teamId ? (
                            <button
                              onClick={() => openTeam(teamId)}
                              className="text-primary underline-offset-4 hover:underline"
                            >
                              {teamName}
                            </button>
                          ) : (
                            <span className="text-muted-foreground">
                              {teamName}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={statusClass[participant.status]}
                          >
                            {statusLabel[participant.status]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {participant.payment ? (
                            <Badge
                              variant="outline"
                              className="bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                            >
                              {t("paid")}
                            </Badge>
                          ) : (
                            <Badge variant="outline">{t("unpaid")}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {participant.t_shirt_size ? (
                            participant.t_shirt_payment ? (
                              <Badge
                                variant="outline"
                                className="bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                              >
                                {t("tshirtPaid", {
                                  size: participant.t_shirt_size,
                                })}
                              </Badge>
                            ) : (
                              <Badge variant="outline">
                                {t("tshirtUnpaid", {
                                  size: participant.t_shirt_size,
                                })}
                              </Badge>
                            )
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              —
                            </span>
                          )}
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <ParticipantRowActions
                            participant={participant}
                            teamId={teamId}
                            onOpenTeam={openTeam}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      <ParticipantSheet
        isOpened={!!openParticipant}
        onClose={() => setOpenParticipant(null)}
        userId={openParticipant?.userId ?? null}
        teamId={openParticipant?.teamId}
        onOpenTeam={openTeam}
      />
    </div>
  );
};

export default ParticipantsAdminPage;
