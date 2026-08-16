"use client";
import { DocumentAccordion } from "@/components/my-documents/DocumentAccordion";
import { Accordion } from "@/components/ui/accordion";
import { useMyDocuments } from "@/hooks/my-documents/useMyDocuments";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

export default function Home() {
  const t = useTranslations("myDocuments");
  const { myDocuments } = useMyDocuments();

  const pendingDocuments = useMemo(
    () => myDocuments.filter((doc) => doc.status === "PENDING"),
    [myDocuments],
  );
  const completedDocuments = useMemo(
    () => myDocuments.filter((doc) => doc.status === "COMPLETED"),
    [myDocuments],
  );
  const rejectedDocuments = useMemo(
    () => myDocuments.filter((doc) => doc.status === "REJECTED"),
    [myDocuments],
  );
  const [documentExpansion, setDocumentExpansion] = useState<string[]>([
    pendingDocuments.length > 0
      ? t("home.pending", { count: pendingDocuments.length })
      : t("home.completed", { count: completedDocuments.length }),
  ]);

  return (
    <div className="p-6 flew flex-col gap-4">
      <h1 className="text-2xl font-bold pb-8">{t("home.myDocuments")}</h1>

      <Accordion
        type="multiple"
        value={documentExpansion}
        onValueChange={(value) => setDocumentExpansion(value)}
      >
        <DocumentAccordion
          title={t("home.pending", { count: pendingDocuments.length })}
          documents={pendingDocuments}
        />
        <DocumentAccordion
          title={t("home.completed", { count: completedDocuments.length })}
          documents={completedDocuments}
        />
        <DocumentAccordion
          title={t("home.rejected", { count: rejectedDocuments.length })}
          documents={rejectedDocuments}
        />
      </Accordion>
    </div>
  );
}
