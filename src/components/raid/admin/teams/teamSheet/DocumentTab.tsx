import { ParticipantDocumentCard } from "./ParticipantDocumentCard";

import {
  AppModulesRaidSchemasRaidDocument,
  DocumentValidation,
  RaidParticipantRestricted,
  RaidTeamComplete,
} from "@/api";
import { DocumentView } from "@/components/raid/custom/DocumentView";
import { useAdminTeam } from "@/hooks/raid/useAdminTeam";
import { useDocument } from "@/hooks/raid/useDocument";
import { useTeams } from "@/hooks/raid/useTeams";
import { triggerBrowserDownload } from "@/lib/raid/document";
import { getDocumentValidationMessage } from "@/lib/raid/documentValidation";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface DocumentTabProps {
  team: RaidTeamComplete;
}

export const DocumentTab = ({ team }: DocumentTabProps) => {
  const t = useTranslations("raid.admin.teams.documentTab");
  const { toast } = useToast();
  const {
    getDocument,
    fetchDocument,
    setDocumentValidation,
    isValidationLoading,
  } = useDocument();
  const { refetchTeam } = useAdminTeam(team.id);
  const { refetchTeams } = useTeams();
  const [selectedDocument, setSelectedDocument] =
    useState<AppModulesRaidSchemasRaidDocument | null>(null);
  const [selectedDocumentUser, setSelectedDocumentUser] = useState<
    string | null
  >(null);

  function setDocument(
    document: AppModulesRaidSchemasRaidDocument,
    userId: string,
  ) {
    setSelectedDocument(document);
    setSelectedDocumentUser(userId);
  }

  const downloadDocument = async (
    doc: AppModulesRaidSchemasRaidDocument,
    participant: RaidParticipantRestricted,
  ) => {
    const key = doc.type;
    const namePrefix = `${participant.user.firstname}_${participant.user.name}_${key}`;
    const cached = getDocument(participant.user_id, key);
    const cachedName = cached
      ? `${namePrefix}.${cached.type.split("/")[1] ?? "pdf"}`
      : null;
    if (cached && cachedName) {
      triggerBrowserDownload(cached, cachedName);
      return;
    }
    try {
      // The document may never have been previewed in this session, so the
      // client cache is empty: fetch it before downloading instead of
      // silently doing nothing.
      const file = await fetchDocument(doc.id);
      triggerBrowserDownload(
        file,
        `${namePrefix}.${file.type.split("/")[1] ?? "pdf"}`,
      );
    } catch (error) {
      console.error(error);
      toast({
        title: t("downloadError"),
        description: t("downloadErrorDescription"),
        variant: "destructive",
      });
    }
  };

  function validateCallback(
    documentId: string,
    validation: DocumentValidation,
    callback: () => void,
  ) {
    setDocumentValidation(documentId, validation, () => {
      refetchTeam();
      refetchTeams();
      callback();
      toast({ title: getDocumentValidationMessage(validation) });
    });
  }

  const key = selectedDocument?.type;
  return (
    <div className="grid w-full grid-cols-1 gap-4 xl:grid-cols-2">
      <Card className="border-border/70 shadow-sm">
        <ParticipantDocumentCard
          participant={team.captain}
          setDocument={(doc) => setDocument(doc, team.captain.user_id)}
          downloadDocument={(doc) => void downloadDocument(doc, team.captain)}
          validateDocument={validateCallback}
          isValidationLoading={isValidationLoading}
        />
        {team.second && (
          <ParticipantDocumentCard
            participant={team.second}
            setDocument={(doc) => setDocument(doc, team.second!.user_id)}
            downloadDocument={(doc) => void downloadDocument(doc, team.second!)}
            validateDocument={validateCallback}
            isValidationLoading={isValidationLoading}
          />
        )}
      </Card>
      {selectedDocument && key && selectedDocumentUser && (
        <DocumentView
          userId={selectedDocumentUser}
          documentKey={key}
          id={selectedDocument.id}
          file={getDocument(selectedDocumentUser, key)}
          width={450}
        />
      )}
    </div>
  );
};
