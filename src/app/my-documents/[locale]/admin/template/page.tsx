"use client";
import { DocumentDataTable } from "@/components/my-documents/DocumentDataTable";
import { useTemplateDocuments } from "@/hooks/my-documents/useTemplateDocuments";
import { useTemplates } from "@/hooks/my-documents/useTemplates";
import { useRouter } from "@/i18n/navigation";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";

export default function Home() {
  const t = useTranslations("myDocuments");
  const params = useSearchParams();
  const templateId = params.get("templateId") || "";
  const { teamTemplates } = useTemplates("teamId");
  const { templateDocuments } = useTemplateDocuments(templateId);
  const router = useRouter();

  const template = teamTemplates.find((t) => t.id === templateId);

  const names = [
    "Smith",
    "Johnson",
    "Williams",
    "Jones",
    "Brown",
    "Davis",
    "Miller",
    "Wilson",
    "Moore",
    "Taylor",
  ];
  const firstNames = [
    "James",
    "Mary",
    "John",
    "Patricia",
    "Robert",
    "Jennifer",
  ];

  const documentData = useMemo(
    () =>
      templateDocuments.map((doc, index) => ({
        id: doc.id,
        template_id: doc.template_id,
        user_id: doc.user_id,
        user: {
          fullName: `${firstNames[index % firstNames.length]} ${names[index % names.length]}`,
          email: `${firstNames[index % firstNames.length].toLowerCase()}.${names[index % names.length].toLowerCase()}@example.com`,
          id: doc.user_id,
        },
        name: doc.name,
        status: doc.status,
        created_at: doc.created_at,
        updated_at: doc.updated_at,
        module: doc.module,
      })),
    [templateDocuments],
  );

  if (!template) {
    router.push({
      pathname: "/admin",
    });
    return;
  }

  return (
    <div className="p-6">
      <Button variant="secondary" onClick={() => router.push(`/admin`)}>
        {t("admin.back")}
      </Button>
      <h1 className="text-2xl font-bold pb-8">
        {t("admin.template", { name: template.name })}
      </h1>
      <DocumentDataTable data={documentData} />
    </div>
  );
}
