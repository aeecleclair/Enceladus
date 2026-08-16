"use client";
import { TemplateCard } from "@/components/my-documents/TemplateCard";
import { useTemplates } from "@/hooks/my-documents/useTemplates";

import { useTranslations } from "next-intl";

export default function Admin() {
  const t = useTranslations("myDocuments");
  const { teamTemplates } = useTemplates("teamId");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold pb-8">{t("home.myDocuments")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
}
