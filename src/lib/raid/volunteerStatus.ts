import { RaidVolunteer } from "@/api";

export interface VolunteerStatusLabels {
  cancelled: string;
  validated: string;
  pending: string;
}

export interface VolunteerStatusBadge {
  label: string;
  className: string;
}

export const getVolunteerStatus = (
  v: Pick<RaidVolunteer, "cancelled" | "validated">,
  labels: VolunteerStatusLabels,
): VolunteerStatusBadge => {
  if (v.cancelled) {
    return {
      label: labels.cancelled,
      className:
        "bg-rose-100 text-rose-900 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300",
    };
  }
  if (v.validated) {
    return {
      label: labels.validated,
      className:
        "bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
    };
  }
  return {
    label: labels.pending,
    className:
      "bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
  };
};
