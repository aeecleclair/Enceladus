export function getRaidDocumentUrl(
  backendUrl: string,
  documentId: string,
): string {
  return `${backendUrl.replace(/\/$/, "")}/raid/document/${documentId}`;
}
