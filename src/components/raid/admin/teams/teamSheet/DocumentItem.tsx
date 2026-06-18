import { DocumentValidationButton } from "./DocumentValidationButton";

import { Document, DocumentValidation } from "@/api";

import { HiCheck, HiDownload, HiX } from "react-icons/hi";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

import { BadgeAlertIcon, ClockIcon } from "lucide-react";

interface DocumentItemProps {
  value: string;
  document: Document | null;
  index: number;
  setDocument: (document: Document) => void;
  downloadDocument: (document: Document) => void;
  validateDocument: (
    documentId: string,
    validation: DocumentValidation,
    callback: () => void,
  ) => void;
}

export const DocumentItem = ({
  value,
  document,
  index,
  setDocument,
  downloadDocument,
  validateDocument,
}: DocumentItemProps) => {
  const isValidated = (document && document.validation === "accepted") || false;
  const isRefused = (document && document.validation === "refused") || false;
  const isTemporary =
    (document && document.validation === "temporary") || false;
  const isPending = (document && document.validation === "pending") || false;

  return (
    <AccordionItem
      value={`item-${index}`}
      onClick={() => {
        if (document) {
          setDocument(document);
        }
      }}
    >
      <AccordionTrigger>
        <div className="flex flex-row mr-auto items-center">
          {isValidated && <HiCheck className="mr-4" />}
          {isRefused && <HiX className="mr-4" />}
          {isTemporary && <BadgeAlertIcon className="mr-4 h-4 w-4" />}
          {isPending && <ClockIcon className="mr-4 h-4 w-4" />}
          {value}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {document ? (
          <div className="flex flex-col gap-4">
            <div className="flex grid-cols-2 gap-4">
              {!isValidated && (
                <DocumentValidationButton
                  label="Valider"
                  validateDocument={(callback) => {
                    validateDocument(document.id, "accepted", callback);
                  }}
                />
              )}
              {!isValidated &&
                !isTemporary &&
                document.type === "medicalCertificate" && (
                  <DocumentValidationButton
                    label="Valider temporairement"
                    validateDocument={(callback) => {
                      validateDocument(document.id, "temporary", callback);
                    }}
                  />
                )}
              {!isRefused && (
                <DocumentValidationButton
                  label="Refuser"
                  validateDocument={(callback) => {
                    validateDocument(document.id, "refused", callback);
                  }}
                />
              )}
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => downloadDocument(document)}
            >
              <HiDownload className="mr-2" />
              Télécharger
            </Button>
          </div>
        ) : (
          <span className="text-muted-foreground">Aucun document</span>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};
