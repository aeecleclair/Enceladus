import { DocumentItem } from "./DocumentItem";

import {
  AppModulesRaidSchemasRaidDocument,
  DocumentValidation,
  RaidParticipant,
} from "@/api";
import { getSituationLabel } from "@/lib/raid/teamUtils";

import { Accordion } from "@/components/ui/accordion";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ParticipantDocumentCardProps {
  participant: RaidParticipant;
  setDocument: (document: AppModulesRaidSchemasRaidDocument) => void;
  downloadDocument: (document: AppModulesRaidSchemasRaidDocument) => void;
  validateDocument: (
    documentId: string,
    validation: DocumentValidation,
    callback: () => void,
  ) => void;
  isValidationLoading: boolean;
}

export const ParticipantDocumentCard = ({
  participant,
  setDocument,
  downloadDocument,
  validateDocument,
}: ParticipantDocumentCardProps) => {
  return (
    <>
      <CardHeader>
        <CardTitle>
          {participant.user.firstname} {participant.user.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <DocumentItem
            value="Carte d'identité"
            document={participant.id_card ?? null}
            index={0}
            setDocument={setDocument}
            downloadDocument={downloadDocument}
            validateDocument={validateDocument}
          />
          <DocumentItem
            value="Certificat médical"
            document={participant.medical_certificate ?? null}
            index={1}
            setDocument={setDocument}
            downloadDocument={downloadDocument}
            validateDocument={validateDocument}
          />
          <DocumentItem
            value="Réglement"
            document={participant.raid_rules ?? null}
            index={2}
            setDocument={setDocument}
            downloadDocument={downloadDocument}
            validateDocument={validateDocument}
          />
          {["centrale", "otherschool"].includes(
            getSituationLabel(participant.situation ?? undefined) ?? "",
          ) && (
            <DocumentItem
              value="Carte étudiante"
              document={participant.student_card ?? null}
              index={3}
              setDocument={setDocument}
              downloadDocument={downloadDocument}
              validateDocument={validateDocument}
            />
          )}
          {participant.is_minor && (
            <DocumentItem
              value="Autorisation parentale"
              document={participant.parent_authorization ?? null}
              index={4}
              setDocument={setDocument}
              downloadDocument={downloadDocument}
              validateDocument={validateDocument}
            />
          )}
        </Accordion>
      </CardContent>
    </>
  );
};
