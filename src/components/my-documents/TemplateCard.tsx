import { Template } from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export const TemplateCard = ({ template }: { template: Template }) => {
  const t = useTranslations("myDocuments");
  const router = useRouter();
  return (
    <Card>
      <CardHeader>{template.name}</CardHeader>
      <CardContent>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-2">
            <p>
              {t("home.documentCreation", {
                date: new Date(template.created_at).toLocaleDateString(),
              })}
            </p>
            <p>
              {t("home.documentUpdate", {
                date: new Date(template.updated_at).toLocaleDateString(),
              })}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              router.push({
                pathname: "/admin/template",
                query: { templateId: template.id },
              })
            }
          >
            {t("admin.detail")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
