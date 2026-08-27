import { TemplateWithStatistics } from "@/api";
import { useRouter } from "@/i18n/navigation";

import { useTranslations } from "next-intl";

import { Badge } from "../ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const TemplateCard = ({
  template,
}: {
  template: TemplateWithStatistics;
}) => {
  const t = useTranslations("myDocuments");
  const router = useRouter();

  return (
    <Card
      onClick={() => {
        router.push({
          pathname: "/admin/template",
          query: { templateId: template.id },
        });
      }}
    >
      <CardContent>
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-xl">{template.name}</p>
            <p>
              {t("template.templateCreationDate", {
                date: new Date(template.created_at).toLocaleDateString(),
              })}
            </p>
            <p>
              {t("template.templateUpdateDate", {
                date: new Date(template.updated_at).toLocaleDateString(),
              })}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className="bg-green-200 text-green-800">
              {t("template.statistics.totalSignedDocuments", {
                count: template.statistics.total_signed_documents,
              })}
            </Badge>
            <Badge className="bg-blue-200 text-blue-800">
              {t("template.statistics.totalPendingDocuments", {
                count: template.statistics.total_pending_documents,
              })}
            </Badge>
            <Badge className="bg-red-200 text-red-800">
              {t("template.statistics.totalRejectedDocuments", {
                count: template.statistics.total_rejected_documents,
              })}
            </Badge>
            <Badge className="bg-gray-200 text-gray-800">
              {t("template.statistics.totalDocuments", {
                count: template.statistics.total_documents,
              })}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
