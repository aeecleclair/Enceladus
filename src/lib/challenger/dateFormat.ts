import { differenceInDays, format } from "date-fns";
import { fr } from "date-fns/locale";

export function getDaysLeft(dateString: string) {
  const date = new Date(dateString).setHours(0, 0, 0, 0);
  const now = new Date().setHours(0, 0, 0, 0);
  return differenceInDays(date, now);
}

export function formatDate(date: string) {
  return format(date, "PPP", { locale: fr });
}

export function formatDateRange(start: string, end: string) {
  const startDateDay = format(start, "dd", { locale: fr });
  const startDateMonth = format(start, "MMMM", { locale: fr });
  const endDateDay = format(end, "dd", { locale: fr });
  const endDateMonth = format(end, "MMMM", { locale: fr });
  const startDateYear = format(start, "yyyy", { locale: fr });
  const endDateYear = format(end, "yyyy", { locale: fr });
  if (startDateYear !== endDateYear) {
    return `${startDateDay} ${startDateMonth} ${startDateYear} - ${endDateDay} ${endDateMonth} ${endDateYear}`;
  }
  if (startDateMonth !== endDateMonth) {
    return `${startDateDay} ${startDateMonth} - ${endDateDay} ${endDateMonth} ${startDateYear}`;
  }
  return `${startDateDay} - ${endDateDay} ${startDateMonth} ${startDateYear}`;
}

export function apiFormatDate(date: Date | undefined) {
  return date ? format(date, "yyyy-MM-dd", { locale: fr }) : undefined;
}
