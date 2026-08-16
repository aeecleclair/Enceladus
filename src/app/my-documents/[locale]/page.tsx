"use client";
import { DocumentCard } from "@/components/my-documents/home/DocumentCard";
import { useMyDocuments } from "@/hooks/my-documents/useMyDocuments";

import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("myDocuments");
  const { documents } = useMyDocuments();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold pb-8">{t("home.myDocuments")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <DocumentCard key={doc.id} document={doc} />
        ))}
      </div>
    </div>
  );
}
