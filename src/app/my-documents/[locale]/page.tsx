"use client";
import { AppCoreDocumentsSchemasDocumentsDocument } from "@/api";
import { DocumentAccordion } from "@/components/my-documents/DocumentAccordion";
import { useMyDocuments } from "@/hooks/my-documents/useMyDocuments";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { Accordion } from "@/components/ui/accordion";

export default function Home() {
  const t = useTranslations("myDocuments");
  const { myDocuments } = useMyDocuments();

  const filteredDocuments = useMemo(() => {
    return myDocuments.reduce(
      (acc, doc) => {
        if (doc.status === "PENDING") {
          acc.pending.push(doc);
        } else if (doc.status === "COMPLETED") {
          acc.completed.push(doc);
        } else if (doc.status === "REJECTED") {
          acc.rejected.push(doc);
        }

        return acc;
      },
      {
        pending: [],
        completed: [],
        rejected: [],
      } as Record<
        "pending" | "completed" | "rejected",
        AppCoreDocumentsSchemasDocumentsDocument[]
      >,
    );
  }, [myDocuments]);

  const [documentExpansion, setDocumentExpansion] = useState<string[]>([
    filteredDocuments.pending.length > 0
      ? t("home.pending", { count: filteredDocuments.pending.length })
      : t("home.completed", { count: filteredDocuments.completed.length }),
  ]);

  return (
    <div className="p-6 flew flex-col gap-4">
      <h1 className="text-2xl font-bold ">{t("home.myDocuments")}</h1>

      <Accordion
        type="multiple"
        value={documentExpansion}
        onValueChange={(value) => setDocumentExpansion(value)}
      >
        <DocumentAccordion
          title={t("home.pending", { count: filteredDocuments.pending.length })}
          documents={filteredDocuments.pending}
        />
        <DocumentAccordion
          title={t("home.completed", {
            count: filteredDocuments.completed.length,
          })}
          documents={filteredDocuments.completed}
        />
        <DocumentAccordion
          title={t("home.rejected", {
            count: filteredDocuments.rejected.length,
          })}
          documents={filteredDocuments.rejected}
        />
      </Accordion>
    </div>
  );
}
