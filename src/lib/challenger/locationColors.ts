// Utility function for generating consistent colors based on location
// This ensures the same location always gets the same color across all components
import { Location } from "@/api";

export function generateLocationColor(
  location: string | null | undefined,
): string {
  if (!location) return "#94a3b8"; // gray-400 for null locations

  // Simple hash function to generate a number from the location string
  let hash = 0;
  for (let i = 0; i < location.length; i++) {
    const char = location.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Generate HSL values from different parts of the hash
  const hue = Math.abs(hash) % 360; // Hue: 0-359 (full color spectrum)
  const saturation = 65 + (Math.abs(hash >> 8) % 25); // Saturation: 65-90%
  const lightness = 45 + (Math.abs(hash >> 16) % 20); // Lightness: 45-65%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function getLocationName(
  locationId: string | null | undefined,
  locations: Location[] | undefined,
): string {
  if (!locationId) return "Lieu non spécifié";
  if (!locations) return locationId;

  const location = locations.find((loc) => loc.id === locationId);
  return location?.name || `Lieu inconnu (${locationId})`;
}

export function getLocationDetails(
  locationId: string | null | undefined,
  locations: Location[] | undefined,
): Location {
  if (!locationId || !locations) {
    return {
      name: "Lieu non spécifié",
      id: "",
      edition_id: "",
    };
  }

  const location = locations.find((loc) => loc.id === locationId);
  return (
    location || {
      name: "Lieu inconnu",
      id: locationId,
      edition_id: "",
    }
  );
}

export function openLocationMap(
  locationId: string | null | undefined,
  locations: Location[] | undefined,
) {
  const locationDetails = getLocationDetails(locationId, locations);

  // If we have coordinates, use them for precise location
  if (locationDetails.latitude && locationDetails.longitude) {
    const url = `https://www.google.com/maps/search/?api=1&query=${locationDetails.latitude},${locationDetails.longitude}`;
    window.open(url, "_blank");
  } else if (locationDetails.address) {
    // Fall back to address if no coordinates
    const query = encodeURIComponent(locationDetails.address);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, "_blank");
  } else if (locationDetails.name !== "Lieu non spécifié") {
    // Fall back to name as last resort
    const query = encodeURIComponent(locationDetails.name);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, "_blank");
  }
}
