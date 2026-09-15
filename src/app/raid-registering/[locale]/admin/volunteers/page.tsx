"use client";

import { RaidVolunteer } from "@/api";
import { PageHeader } from "@/components/raid/admin/PageHeader";
import { VolunteerRowActions } from "@/components/raid/admin/volunteers/VolunteerRowActions";
import { VolunteerSheet } from "@/components/raid/admin/volunteers/VolunteerSheet";
import { useAdminVolunteers } from "@/hooks/raid/useAdminVolunteers";
import { formatDate } from "@/lib/dateFormat";
import { getVolunteerStatus } from "@/lib/raid/volunteerStatus";

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

import { HeartHandshake } from "lucide-react";

type StatusFilter = "all" | "pending" | "validated" | "cancelled";

const VolunteersAdminPage = () => {
  const { volunteers, isLoading } = useAdminVolunteers();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [openVolunteer, setOpenVolunteer] = useState<RaidVolunteer | null>(
    null,
  );
  const t = useTranslations("raid.admin.volunteers");
  const td = useTranslations("raid.volunteer.dashboard");
  const statusLabels = {
    cancelled: td("cancelled"),
    validated: td("validated"),
    pending: td("pending"),
  };

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
        title={t("title")}
        description={t("subtitle")}
        accent="orange"
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
              <SelectTrigger className="w-45">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filterAll")}</SelectItem>
                <SelectItem value="pending">{t("filterPending")}</SelectItem>
                <SelectItem value="validated">
                  {t("filterValidated")}
                </SelectItem>
                <SelectItem value="cancelled">
                  {t("filterCancelled")}
                </SelectItem>
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
                    <TableHead>{t("columns.volunteer")}</TableHead>
                    <TableHead>{t("columns.registeredAt")}</TableHead>
                    <TableHead>{t("columns.status")}</TableHead>
                    <TableHead>{t("columns.payment")}</TableHead>
                    <TableHead>{t("columns.car")}</TableHead>
                    <TableHead>{t("columns.roles")}</TableHead>
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
                    filtered.map((v) => {
                      const status = getVolunteerStatus(v, statusLabels);
                      return (
                        <TableRow
                          key={v.user_id}
                          className="cursor-pointer"
                          onClick={() => setOpenVolunteer(v)}
                        >
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
                              ? t("carYes", { seats: v.car_seats ?? 0 })
                              : t("carNo")}
                          </TableCell>
                          <TableCell>
                            {v.payment ? (
                              <Badge
                                variant="outline"
                                className="text-emerald-700 dark:text-emerald-400"
                              >
                                {t("paid")}
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-amber-700 dark:text-amber-400"
                              >
                                {t("unpaid")}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {v.is_special_driver && (
                                <Badge variant="outline">
                                  {t("roleSpecial")}
                                </Badge>
                              )}
                              {v.is_utility_vehicle_driver && (
                                <Badge variant="outline">
                                  {t("roleUtility")}
                                </Badge>
                              )}
                              {v.is_parcours_helper && (
                                <Badge variant="outline">
                                  {t("roleParcours")}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
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
      <VolunteerSheet
        isOpened={!!openVolunteer}
        onClose={() => setOpenVolunteer(null)}
        volunteer={openVolunteer}
      />
    </div>
  );
};

export default VolunteersAdminPage;
