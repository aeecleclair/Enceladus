import { Template } from "@/api";
import { useRouter } from "@/i18n/navigation";

import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const TemplateCard = ({ template }: { template: Template }) => {
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
      <CardHeader>{template.name}</CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
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
      </CardContent>
    </Card>
  );
};
