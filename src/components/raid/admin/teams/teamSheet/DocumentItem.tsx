import { DocumentValidationButton } from "./DocumentValidationButton";

import { AppModulesRaidSchemasRaidDocument, DocumentValidation } from "@/api";

import { useTranslations } from "next-intl";
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
  document: AppModulesRaidSchemasRaidDocument | null;
  index: number;
  setDocument: (document: AppModulesRaidSchemasRaidDocument) => void;
  downloadDocument: (document: AppModulesRaidSchemasRaidDocument) => void;
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
  const t = useTranslations("raid.admin.teams.documentItem");
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
                  label={t("validate")}
                  validateDocument={(callback) => {
                    validateDocument(document.id, "accepted", callback);
                  }}
                />
              )}
              {!isValidated &&
                !isTemporary &&
                document.type === "medicalCertificate" && (
                  <DocumentValidationButton
                    label={t("validateTemporary")}
                    validateDocument={(callback) => {
                      validateDocument(document.id, "temporary", callback);
                    }}
                  />
                )}
              {!isRefused && (
                <DocumentValidationButton
                  label={t("refuse")}
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
              {t("download")}
            </Button>
          </div>
        ) : (
          <span className="text-muted-foreground">{t("noDocument")}</span>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};
