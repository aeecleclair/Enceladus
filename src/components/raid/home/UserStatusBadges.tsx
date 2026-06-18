"use client";

import { useHasRaidPermission } from "@/hooks/raid/useHasRaidPermission";
import { useMeParticipant } from "@/hooks/raid/useMeParticipant";
import { useMeVolunteer } from "@/hooks/raid/useMeVolunteer";

import { useTranslations } from "next-intl";

export const UserStatusBadges = () => {
  const t = useTranslations("raid.home.badges");
  const { me } = useMeParticipant();
  const { meVolunteer } = useMeVolunteer();
  const { isRaidAdmin } = useHasRaidPermission();

  const badges: { label: string; className: string }[] = [];

  if (me) {
    badges.push({
      label: t("participant"),
      className:
        "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300",
    });
    if (me.status === "validated") {
      badges.push({
        label: t("registrationValidated"),
        className:
          "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300",
      });
    } else if (me.status === "submitted") {
      badges.push({
        label: t("registrationSubmitted"),
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300",
      });
    }
  }

  if (meVolunteer) {
    badges.push({
      label: t("volunteer"),
      className:
        "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300",
    });
    if (meVolunteer.cancelled) {
      badges.push({
        label: t("volunteerCancelled"),
        className:
          "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300",
      });
    }
  }

  if (isRaidAdmin) {
    badges.push({
      label: t("admin"),
      className:
        "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300",
    });
  }

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <span
          key={badge.label}
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${badge.className}`}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
};
