"use client";

import { RaidParticipantPreview, RaidRegistrationStatus } from "@/api";
import { ParticipantRowActions } from "@/components/raid/admin/participants/ParticipantRowActions";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTeams } from "@/hooks/raid/useTeams";
import { useRouter } from "@/i18n/navigation";
import { useMemo, useState } from "react";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/raid/admin/PageHeader";

type StatusFilter = RaidRegistrationStatus | "all";

type ParticipantRow = {
  participant: RaidParticipantPreview;
  teamId: string;
  teamName: string;
};

const statusClass: Record<RaidRegistrationStatus, string> = {
  draft:
    "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/40 dark:text-slate-300 dark:border-slate-800",
  submitted:
    "bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
  validated:
    "bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
  cancelled:
    "bg-rose-100 text-rose-900 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900",
};

const statusLabel: Record<RaidRegistrationStatus, string> = {
  draft: "Brouillon",
  submitted: "Soumis",
  validated: "Validé",
  cancelled: "Annulé",
};

const ParticipantsAdminPage = () => {
  const { teams, isLoading } = useTeams();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const rows = useMemo<ParticipantRow[]>(() => {
    if (!teams) return [];
    const out: ParticipantRow[] = [];
    for (const team of teams) {
      if (team.captain) {
        out.push({
          participant: team.captain,
          teamId: team.id,
          teamName: team.name,
        });
      }
      if (team.second) {
        out.push({
          participant: team.second,
          teamId: team.id,
          teamName: team.name,
        });
      }
    }
    return out;
  }, [teams]);

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
        title="Participants"
        description="Suivez les dossiers participants et gérez leur cycle de vie."
        accent="emerald"
      />
      <Card className="border-border/70 bg-card/95 shadow-sm">
        <CardHeader>
          <CardTitle>Liste des participants</CardTitle>
          <CardDescription>
            Pilotez le cycle de vie : soumettre, valider, rouvrir, annuler.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-muted/20 p-2">
            <Input
              placeholder="Rechercher un participant ou une équipe…"
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
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="submitted">Soumis</SelectItem>
                <SelectItem value="validated">Validé</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
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
                    <TableHead>Participant</TableHead>
                    <TableHead>Équipe</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Paiement</TableHead>
                    <TableHead>T-shirt</TableHead>
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
                        Aucun participant.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map(({ participant, teamId, teamName }) => (
                      <TableRow key={participant.user_id}>
                        <TableCell>
                          <div className="font-medium">
                            {participant.user.firstname} {participant.user.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {participant.user.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => openTeam(teamId)}
                            className="text-primary underline-offset-4 hover:underline"
                          >
                            {teamName}
                          </button>
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
                              Payé
                            </Badge>
                          ) : (
                            <Badge variant="outline">Non payé</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {participant.t_shirt_size ? (
                            participant.t_shirt_payment ? (
                              <Badge
                                variant="outline"
                                className="bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                              >
                                {participant.t_shirt_size} payé
                              </Badge>
                            ) : (
                              <Badge variant="outline">
                                {participant.t_shirt_size} non payé
                              </Badge>
                            )
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              —
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
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
    </div>
  );
};

export default ParticipantsAdminPage;
