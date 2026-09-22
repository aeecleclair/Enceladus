import {
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js";

// Prepend "+" (stripping any non-digit noise) only when the value doesn't
// already carry one. Exported for schemas that validate legacy digits-only
// values alongside E.164.
export function withCountryCode(raw: string): string {
  return raw.startsWith("+") ? raw : `+${raw.replace(/\D/g, "")}`;
}

export function normalizePhone(raw: string): string {
  const value = (raw ?? "").trim();
  if (!value) return "";
  return parsePhoneNumberFromString(withCountryCode(value))?.number ?? value;
}

export function isValidPhone(raw: string): boolean {
  const value = (raw ?? "").trim();
  if (!value) return false;
  return isValidPhoneNumber(withCountryCode(value));
}
