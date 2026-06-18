import { useDocument } from "@/hooks/raid/useDocument";
import { useDocumentsStore } from "@/stores/raid/documents";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { DropzoneInput } from "@/components/ui/dropzoneInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

const PdfViewer = dynamic(
  () => import("./PdfViewer").then((mod) => mod.PdfViewer),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-80" />,
  },
);

interface DocumentDialogProps {
  setIsOpen: (value: boolean) => void;
  setIsUploading: (value: boolean) => void;
  field: ControllerRenderProps<FieldValues, string>;
  fileType: string;
  documentId?: string;
  participantId: string;
}

export const DocumentDialog = ({
  setIsUploading,
  setIsOpen,
  field,
  fileType,
  documentId,
  participantId,
}: DocumentDialogProps) => {
  const {
    uploadDocument,
    getDocument,
    data,
    setDocumentId,
    documentId: docId,
  } = useDocument();
  const { setDocument } = useDocumentsStore();
  const file = getDocument(participantId, fileType);
  const [image, setImage] = useState<File | undefined>(file);
  const [isLoading, setIsLoading] = useState(data?.size === undefined);
  if (
    file?.size === undefined &&
    docId !== documentId &&
    data?.size === undefined
  ) {
    setDocumentId(field.value.id);
    setIsLoading(true);
  }

  if (data?.size !== undefined && isLoading) {
    setDocument(participantId, fileType, field.value.id, data);
    setImage(data);
    setIsLoading(false);
  }

  return (
    <>
      {image?.size !== undefined ? (
        <div className="flex flex-col items-center gap-4">
          {image?.type === "application/pdf" ? (
            <ScrollArea className="h-100">
              <PdfViewer file={image} width={550} />
            </ScrollArea>
          ) : (
            <Image
              src={URL.createObjectURL(image)}
              alt={field.name}
              width={300}
              height={200}
              className="rounded-lg w-auto max-h-100"
            />
          )}
          <Button
            className="w-full"
            onClick={() => {
              field.onChange(null);
              setImage(undefined);
            }}
          >
            Modifier
          </Button>
        </div>
      ) : (
        <>
          {documentId ? (
            <div className="flex flex-col items-center gap-4">
              <Skeleton className="w-full h-80" />
              <Button
                className="w-full"
                onClick={() => {
                  field.onChange(null);
                  setImage(undefined);
                }}
              >
                Modifier
              </Button>
            </div>
          ) : (
            <DropzoneInput
              setIsOpen={setIsOpen}
              onDropAccepted={(files) => {
                const file = files[0];
                setIsUploading(true);
                uploadDocument(file, fileType, (documentId) => {
                  field.onChange({
                    name: file.name,
                    id: documentId,
                    type: fileType,
                    updated: true,
                  });
                  setDocument(participantId, fileType, documentId, file);
                  setDocumentId(documentId);
                  setIsUploading(false);
                });
              }}
            />
          )}
        </>
      )}
    </>
  );
};
