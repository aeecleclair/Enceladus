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
  const { getDocument, setDocumentValidation, isValidationLoading } =
    useDocument();
  const { refetchParticipant } = useAdminParticipant(participant.user_id);
  const [selectedDocument, setSelectedDocument] =
    useState<AppModulesRaidSchemasRaidDocument | null>(null);

  const downloadDocument = (doc: AppModulesRaidSchemasRaidDocument) => {
    const key = doc.type;
    const file = getDocument(participant.user_id, key);
    if (file === undefined) return;
    const extension = file.type.split("/")[1];
    const name = `${participant.user.firstname}_${participant.user.name}_${key}.${extension}`;
    const url = window.URL.createObjectURL(new Blob([file]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", name);
    document.body.appendChild(link);
    link.click();
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
          downloadDocument={downloadDocument}
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
