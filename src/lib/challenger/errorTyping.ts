export type ErrorType = {
  stack: {
    body: string;
  };
};

export type DetailedErrorType = {
  stack: {
    detail: string;
  };
};

export type APIErrorType = {
  stack: {
    detail: {
      msg: string;
    }[];
  };
};

export const DEFAULT_ERROR_MESSAGE =
  "Une erreur est survenue, veuillez réessayer plus tard";

/**
 * Errors raised by the generated fetcher carry the API payload in `stack`.
 * The payload is either `{ body }`, `{ detail }` or a plain string when the
 * request never reached the API, so every shape has to be handled — and
 * `error` is `null` when the request succeeded.
 */
export const getApiErrorMessage = (
  error: unknown,
  fallback: string = DEFAULT_ERROR_MESSAGE,
): string => {
  const payload = (error as { stack?: unknown } | null | undefined)?.stack;
  if (typeof payload !== "object" || payload === null) {
    return fallback;
  }
  const { body, detail } = payload as { body?: unknown; detail?: unknown };
  if (typeof body === "string") {
    return body;
  }
  if (typeof detail === "string") {
    return detail;
  }
  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => (item as { msg?: unknown })?.msg)
      .filter((msg): msg is string => typeof msg === "string");
    if (messages.length > 0) {
      return messages.join(", ");
    }
  }
  return fallback;
};
