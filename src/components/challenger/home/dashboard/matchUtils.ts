"use client";

export const openMap = (location: { name: string; address?: string | null }) => {
  const query = location.address
    ? `${location.name}, ${location.address}`
    : location.name;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  const isMobile =
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  if (isMobile) {
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      window.open(
        `maps://maps.apple.com/?q=${encodeURIComponent(query)}`,
        "_system",
      );
      setTimeout(() => window.open(googleMapsUrl, "_blank"), 500);
    } else {
      window.open(`geo:0,0?q=${encodeURIComponent(query)}`, "_system");
      setTimeout(() => window.open(googleMapsUrl, "_blank"), 500);
    }
  } else {
    window.open(googleMapsUrl, "_blank");
  }
};

export const getTimeBadgeClass = (
  dateStr: string | null | undefined,
  currentTime: Date,
): string => {
  if (!dateStr) return "bg-secondary text-secondary-foreground";
  const mins = (new Date(dateStr).getTime() - currentTime.getTime()) / 60000;
  if (mins < 30) return "bg-red-100 text-red-700";
  if (mins < 120) return "bg-orange-100 text-orange-700";
  if (mins < 1440) return "bg-blue-100 text-blue-700";
  return "bg-secondary text-secondary-foreground";
};

export const getTimeElapsed = (dateStr: string, currentTime: Date): string => {
  const mins = Math.floor(
    (currentTime.getTime() - new Date(dateStr).getTime()) / 60000,
  );
  if (mins < 60) return `${mins}'`;
  const hours = Math.floor(mins / 60);
  const remaining = mins % 60;
  return `${hours}h${remaining > 0 ? remaining.toString().padStart(2, "0") : ""}`;
};

export const getTimeUntilEvent = (
  eventDate: string,
  currentTime: Date,
): string => {
  const event = new Date(eventDate);
  const diffMinutes = Math.round(
    (event.getTime() - currentTime.getTime()) / (1000 * 60),
  );

  if (diffMinutes < 0) return "En cours";
  if (diffMinutes < 60) return `${diffMinutes}min`;
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  return `${hours}h${minutes > 0 ? minutes.toString().padStart(2, "0") : ""}`;
};
