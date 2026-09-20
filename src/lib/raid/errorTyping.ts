type ValidationErrorItem = {
  loc?: (string | number)[];
  msg?: string;
  type?: string;
};

type ApiError = {
  detail?: string | ValidationErrorItem[];
  status?: number;
  statusCode?: number;
};

const DEFAULT_FALLBACK = "Une erreur est survenue, veuillez réessayer.";

/**
 * FastAPI `detail` strings that have a specific, user-facing explanation.
 *
 * The backend reports every submit/validate/join gate with an English
 * `detail` string. Showing it raw would leak internals in the UI; these keys
 * (raid.apiErrors.*) are the localized equivalents. Matched with startsWith so
 * variants like "Document id card is not accepted" hit the same message.
 */
const DETAIL_TO_KEY: [prefix: string, key: string][] = [
  // --- Joining a team ---
  ["Team is already full", "joinTeamFull"],
  ["This team was just joined", "joinConflict"],
  ["You are already the captain of this team", "joinAlreadyCaptain"],
  ["You are already in a team", "joinAlreadyInTeam"],
  ["Invite token not found", "joinTokenNotFound"],
  ["Invite for a different edition", "joinWrongEdition"],
  ["Team not found", "joinNotFound"],

  // --- Participant submit gates (self) ---
  ["Participant is not a draft", "submitNotDraft"],
  ["Attestation on honour not signed", "submitAttestation"],
  ["Security file missing", "submitSecurityFile"],
  ["Required documents missing", "submitDocs"],

  // --- Participant validation gates (admin) ---
  ["Participant payment is not done", "validatePayment"],
  ["Participant t-shirt payment is not done", "validateTshirtPayment"],
  ["Participant has no security file", "validateSecurityFile"],
  ["Participant security file is missing emergency contact", "validateSecurityFile"],
  ["is not accepted", "validateDocNotAccepted"],
  ["Missing id card", "validateMissingDoc"],
  ["Missing medical certificate", "validateMissingDoc"],
  ["Missing raid rules", "validateMissingDoc"],
  ["Missing student card", "validateMissingDoc"],
  ["Missing parent authorization", "validateMissingDoc"],
  ["Missing school authorization", "validateMissingDoc"],
  ["Team is missing a second member", "validateTeamSecond"],
  ["Team has no chosen difficulty", "validateTeamDifficulty"],
  ["Team has no chosen meeting place", "validateTeamMeeting"],

  // --- Status / edit conflicts ---
  ["Participant is not in draft state; reopen first", "editNotDraft"],
  ["Cannot reopen a validated participant", "alreadyValidated"],
  ["Only admins can cancel a validated participant", "alreadyValidated"],
  ["You are already a participant", "recreateParticipant"],
  ["User is already a participant in this edition", "recreateParticipant"],
  ["You already have a team", "recreateParticipant"],
  ["You are already a volunteer", "recreateVolunteer"],
  ["User is already a volunteer in this edition", "recreateVolunteer"],
  ["Your user profile is missing birthday or phone", "profileMissingBirthdayPhone"],
];

/** Map of translation key → original detail, for error-key lookup helpers. */
export const getErrorKey = (error: unknown): string | null => {
  if (!error || typeof error !== "object") return null;
  const detail = (error as ApiError).detail;
  if (typeof detail !== "string") return null;
  for (const [prefix, key] of DETAIL_TO_KEY) {
    if (detail.startsWith(prefix) || detail.includes(prefix)) {
      return key;
    }
  }
  return null;
};

/**
 * Extracts a human-readable description from an API error.
 *
 * The hey-api client throws the parsed JSON response body directly. FastAPI
 * shapes are `{ detail: string }` for raised HTTPExceptions and
 * `{ detail: ValidationError[] }` for 422 validation errors.
 *
 * When the backend detail matches a known gate/conflict message, the
 * localized `raid.apiErrors.*` variant is returned instead (see mapping
 * above); otherwise the raw detail is shown.
 */
export const getErrorDescription = (
  error: unknown,
  fallback: string = DEFAULT_FALLBACK,
): string => {
  if (!error) return fallback;

  if (typeof error === "string") return error;

  const detail = (error as ApiError).detail;

  if (typeof detail === "string" && detail.length > 0) return detail;

  if (Array.isArray(detail) && detail.length > 0) {
    const messages = detail
      .map((item) => item?.msg)
      .filter(
        (msg): msg is string => typeof msg === "string" && msg.length > 0,
      );
    if (messages.length > 0) return messages.join(" · ");
  }

  if (error instanceof Error && error.message) return error.message;

  return fallback;
};
