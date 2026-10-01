import { RaidVolunteer } from "@/api";

// French Excel expects a semicolon as list separator, and a UTF-8 BOM so it
// detects the encoding instead of mangling accented names.
const SEPARATOR = ";";

const HEADERS = [
  "Nom",
  "Prénom",
  "Email",
  "Téléphone",
  "Contact d'urgence",
  "Téléphone urgence",
  "Voiture",
  "Places voiture",
  "Conducteur spécial",
  "Conducteur utilitaire",
  "Aide parcours",
  "Validé",
  "Annulé",
  "Payé",
] as const;

const boolLabel = (value: boolean | null | undefined) =>
  value ? "OUI" : "NON";

const escapeCsvField = (value: string): string => {
  if (
    value.includes(SEPARATOR) ||
    value.includes('"') ||
    value.includes("\n") ||
    value.includes("\r")
  ) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
};

export const buildVolunteersCsv = (volunteers: RaidVolunteer[]): string => {
  const rows = [...volunteers]
    .sort(
      (a, b) =>
        a.user.name.localeCompare(b.user.name, "fr") ||
        a.user.firstname.localeCompare(b.user.firstname, "fr"),
    )
    .map((v) => [
      v.user.name,
      v.user.firstname,
      v.user.email,
      v.user.phone ?? "",
      v.emergency_person_name ?? "",
      v.emergency_person_phone ?? "",
      boolLabel(v.has_car),
      v.has_car && v.car_seats != null ? String(v.car_seats) : "",
      boolLabel(v.is_special_driver),
      boolLabel(v.is_utility_vehicle_driver),
      boolLabel(v.is_parcours_helper),
      boolLabel(v.validated),
      boolLabel(v.cancelled),
      boolLabel(v.payment),
    ]);

  return [HEADERS, ...rows]
    .map((row) => row.map(escapeCsvField).join(SEPARATOR))
    .join("\r\n");
};

/**
 * Download the given volunteers as a CSV file.
 *
 * Callers pass the rows currently displayed (after search/status filters) so
 * the export matches what the admin sees.
 */
export const downloadVolunteersCsv = (volunteers: RaidVolunteer[]) => {
  const csv = buildVolunteersCsv(volunteers);
  const blob = new Blob([`\uFEFF${csv}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `benevoles_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
