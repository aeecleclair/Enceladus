export type DocumentValidationValue =
  | "pending"
  | "accepted"
  | "refused"
  | "temporary";

export function getDocumentValidationMessage(
  validation: DocumentValidationValue,
): string {
  switch (validation) {
    case "accepted":
      return "Document validé avec succès";
    case "refused":
      return "Document refusé avec succès";
    default:
      return "Document mis à jour avec succès";
  }
}
