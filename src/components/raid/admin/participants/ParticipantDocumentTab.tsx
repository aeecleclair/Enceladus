"use client";

import {
  AppModulesRaidSchemasRaidDocument,
  DocumentValidation,
  RaidParticipant,
} from "@/api";
import { ParticipantDocumentCard } from "@/components/raid/admin/teams/teamSheet/ParticipantDocumentCard";
import { DocumentView } from "@/components/raid/custom/DocumentView";
import { useAdminParticipant } from "@/hooks/raid/useAdminParticipant";
import { useDocument } from "@/hooks/raid/useDocument";
import { triggerBrowserDownload } from "@/lib/raid/document";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface ParticipantDocumentTabProps {
  participant: RaidParticipant;
}

export const ParticipantDocumentTab = ({
  participant,
}: ParticipantDocumentTabProps) => {
  const { toast } = useToast();
  const {
    getDocument,
    fetchDocument,
    setDocumentValidation,
    isValidationLoading,
  } = useDocument();
  const { refetchParticipant } = useAdminParticipant(participant.user_id);
  const [selectedDocument, setSelectedDocument] =
    useState<AppModulesRaidSchemasRaidDocument | null>(null);

  const downloadDocument = async (doc: AppModulesRaidSchemasRaidDocument) => {
    const key = doc.type;
    const namePrefix = `${participant.user.firstname}_${participant.user.name}_${key}`;
    const cached = getDocument(participant.user_id, key);
    if (cached) {
      triggerBrowserDownload(
        cached,
        `${namePrefix}.${cached.type.split("/")[1] ?? "pdf"}`,
      );
      return;
    }
    try {
      // The document is not in the client cache until it has been previewed:
      // fetch it on demand so the download button always works.
      const file = await fetchDocument(doc.id);
      triggerBrowserDownload(
        file,
        `${namePrefix}.${file.type.split("/")[1] ?? "pdf"}`,
      );
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur lors du téléchargement",
        description:
          "Le document n'a pas pu être téléchargé, veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const validateCallback = (
    documentId: string,
    validation: DocumentValidation,
    callback: () => void,
  ) => {
    setDocumentValidation(documentId, validation, () => {
      refetchParticipant();
      callback();
      toast({ title: "Document validé avec succès" });
    });
  };

  const key = selectedDocument?.type;

  return (
    <div className="grid w-full grid-cols-1 gap-4 xl:grid-cols-2">
      <Card className="border-border/70 shadow-sm">
        <ParticipantDocumentCard
          participant={participant}
          setDocument={setSelectedDocument}
          downloadDocument={(doc) => void downloadDocument(doc)}
          validateDocument={validateCallback}
          isValidationLoading={isValidationLoading}
        />
      </Card>
      {selectedDocument && key && (
        <DocumentView
          userId={participant.user_id}
          documentKey={key}
          id={selectedDocument.id}
          file={getDocument(participant.user_id, key)}
          width={450}
        />
      )}
    </div>
  );
};
