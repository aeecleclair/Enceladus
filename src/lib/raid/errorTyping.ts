type ValidationErrorItem = {
  loc?: (string | number)[];
  msg?: string;
  type?: string;
};

type ApiError = {
  detail?: string | ValidationErrorItem[];
};

const DEFAULT_FALLBACK = "Une erreur est survenue, veuillez réessayer.";

/**
 * Extracts a human-readable description from an API error.
 *
 * The hey-api client throws the parsed JSON response body directly. FastAPI
 * shapes are `{ detail: string }` for raised HTTPExceptions and
 * `{ detail: ValidationError[] }` for 422 validation errors.
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
