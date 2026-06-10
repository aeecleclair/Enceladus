"use client";

import { useDocument } from "@/hooks/raid/useDocument";
import { useDocumentsStore } from "@/stores/raid/documents";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

const PdfViewer = dynamic(
  () => import("./PdfViewer").then((mod) => mod.PdfViewer),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-80" />,
  },
);

interface DocumentViewProps {
  userId: string;
  documentKey: string;
  id: string;
  file?: File;
  width?: number;
}

export const DocumentView = ({
  userId,
  documentKey,
  id,
  file,
  width,
}: DocumentViewProps) => {
  const { data, setDocumentId, documentId } = useDocument();
  const { setDocument } = useDocumentsStore();
  const [isLoading, setIsLoading] = useState(data?.size === undefined);

  if (documentId !== id) {
    setDocumentId(id);
    setIsLoading(true);
  }

  if (data?.size !== undefined && isLoading) {
    setDocument(userId, documentKey, id, data);
    setIsLoading(false);
  }

  return (
    <>
      {file?.size ? (
        file?.type === "application/pdf" ? (
          <ScrollArea className="h-[calc(100vh-180px)] flex mx-auto">
            <PdfViewer file={file} width={width} />
          </ScrollArea>
        ) : (
          <Image
            src={URL.createObjectURL(file)}
            alt={documentKey}
            width={300}
            height={200}
            className="rounded-lg w-auto max-h-100 m-auto"
          />
        )
      ) : (
        <Skeleton className="w-full h-80" />
      )}
    </>
  );
};
