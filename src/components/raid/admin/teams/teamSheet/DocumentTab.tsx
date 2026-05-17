import { ParticipantDocumentCard } from "./ParticipantDocumentCard";

import { Document, DocumentValidation, RaidParticipant, RaidTeam } from "@/api";
import { DocumentView } from "@/components/raid/custom/DocumentView";
import { useAdminTeam } from "@/hooks/raid/useAdminTeam";
import { useDocument } from "@/hooks/raid/useDocument";
import { useTeams } from "@/hooks/raid/useTeams";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface DocumentTabProps {
  team: RaidTeam;
}

export const DocumentTab = ({ team }: DocumentTabProps) => {
  const { toast } = useToast();
  const { getDocument, setDocumentValidation, isValidationLoading } =
    useDocument();
  const { refetchTeam } = useAdminTeam(team.id);
  const { refetchTeams } = useTeams();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null,
  );
  const [selectedDocumentUser, setSelectedDocumentUser] = useState<
    string | null
  >(null);

  function setDocument(document: Document, userId: string) {
    setSelectedDocument(document);
    setSelectedDocumentUser(userId);
  }

  function downloadDocument(doc: Document, participant: RaidParticipant) {
    const key = doc.type;
    const file = getDocument(participant.user_id, key);
    if (file !== undefined) {
      const extension = file.type.split("/")[1];
      const name = `${participant.user.firstname}_${participant.user.name}_${key}.${extension}`;
      const url = window.URL.createObjectURL(new Blob([file]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", name);
      document.body.appendChild(link);
      link.click();
    }
  }

  function validateCallback(
    documentId: string,
    validation: DocumentValidation,
    callback: () => void,
  ) {
    setDocumentValidation(documentId, validation, () => {
      refetchTeam();
      refetchTeams();
      callback();
      toast({
        title: "Document validé avec succès",
      });
    });
  }

  const key = selectedDocument?.type;
  return (
    <div className="grid w-full grid-cols-1 gap-4 xl:grid-cols-2">
      <Card className="border-border/70 shadow-sm">
        <ParticipantDocumentCard
          participant={team.captain}
          setDocument={(doc) => setDocument(doc, team.captain.user_id)}
          downloadDocument={(doc) => downloadDocument(doc, team.captain)}
          validateDocument={validateCallback}
          isValidationLoading={isValidationLoading}
        />
        {team.second && (
          <ParticipantDocumentCard
            participant={team.second}
            setDocument={(doc) => setDocument(doc, team.second!.user_id)}
            downloadDocument={(doc) => downloadDocument(doc, team.second!)}
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
