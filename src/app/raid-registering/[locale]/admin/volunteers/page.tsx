"use client";

import { RaidVolunteer } from "@/api";
import { VolunteerRowActions } from "@/components/raid/admin/volunteers/VolunteerRowActions";
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
import { useAdminVolunteers } from "@/hooks/raid/useAdminVolunteers";
import { formatDate } from "@/lib/dateFormat";
import { useMemo, useState } from "react";
import { HeartHandshake } from "lucide-react";
import { PageHeader } from "@/components/raid/admin/PageHeader";

type StatusFilter = "all" | "pending" | "validated" | "cancelled";

const getStatus = (v: RaidVolunteer) => {
  if (v.cancelled)
    return {
      label: "Annulé",
      className:
        "bg-rose-100 text-rose-900 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300",
    };
  if (v.validated)
    return {
      label: "Validé",
      className:
        "bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
    };
  return {
    label: "En attente",
    className:
      "bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
  };
};

const VolunteersAdminPage = () => {
  const { volunteers, isLoading } = useAdminVolunteers();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    if (!volunteers) return [];
    return volunteers.filter((v) => {
      if (statusFilter === "pending" && (v.validated || v.cancelled))
        return false;
      if (statusFilter === "validated" && !v.validated) return false;
      if (statusFilter === "cancelled" && !v.cancelled) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        v.user.firstname.toLowerCase().includes(q) ||
        v.user.name.toLowerCase().includes(q) ||
        v.user.email.toLowerCase().includes(q)
      );
    });
  }, [volunteers, search, statusFilter]);

  return (
    <div className="space-y-4">
      <PageHeader
        icon={HeartHandshake}
        title="Bénévoles"
        description="Gérez les validations et le suivi des inscriptions bénévoles."
        accent="orange"
      />
      <Card className="border-border/70 bg-card/95 shadow-sm">
        <CardHeader>
          <CardTitle>Liste des bénévoles</CardTitle>
          <CardDescription>
            Validez, annulez ou supprimez les inscriptions bénévoles.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-muted/20 p-2">
            <Input
              placeholder="Rechercher un bénévole…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm bg-background"
            />
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as StatusFilter)}
            >
              <SelectTrigger className="w-45">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="validated">Validés</SelectItem>
                <SelectItem value="cancelled">Annulés</SelectItem>
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
                    <TableHead>Bénévole</TableHead>
                    <TableHead>Inscrit le</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Voiture</TableHead>
                    <TableHead>Rôles</TableHead>
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
                        Aucun bénévole.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((v) => {
                      const status = getStatus(v);
                      return (
                        <TableRow key={v.user_id}>
                          <TableCell>
                            <div className="font-medium">
                              {v.user.firstname} {v.user.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {v.user.email}
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(v.created_at)}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={status.className}
                            >
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {v.has_car
                              ? `Oui (${v.car_seats ?? 0} places)`
                              : "Non"}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {v.is_special_driver && (
                                <Badge variant="outline">
                                  Véhicule spécial
                                </Badge>
                              )}
                              {v.is_utility_vehicle_driver && (
                                <Badge variant="outline">Utilitaire</Badge>
                              )}
                              {v.is_parcours_helper && (
                                <Badge variant="outline">Parcours</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <VolunteerRowActions volunteer={v} />
                          </TableCell>
                        </TableRow>
                      );
                    })
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

export default VolunteersAdminPage;
