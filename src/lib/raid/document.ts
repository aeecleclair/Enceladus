export function getRaidDocumentUrl(
  backendUrl: string,
  documentId: string,
): string {
  return `${backendUrl.replace(/\/$/, "")}/raid/document/${documentId}`;
}

/**
 * Save an already fetched document through the browser's download mechanism.
 * The temporary object URL is released once the download has been triggered.
 */
export function triggerBrowserDownload(file: File, name: string) {
  const url = window.URL.createObjectURL(new Blob([file]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", name);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
