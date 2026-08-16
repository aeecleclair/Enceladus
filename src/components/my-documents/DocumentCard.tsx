import { AppCoreDocumentsSchemasDocumentsDocument } from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export const DocumentCard = ({
  document,
}: {
  document: AppCoreDocumentsSchemasDocumentsDocument;
}) => {
  const t = useTranslations("myDocuments");
  return (
    <Card>
      <CardHeader>{document.name}</CardHeader>
      <CardContent>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-2">
            <p>
              {t("home.documentStatus", {
                status: t(`document.status.${document.status}`),
              })}
            </p>
            <p>
              {t("home.documentDate", {
                date: new Date(document.created_at).toLocaleDateString(),
              })}
            </p>
          </div>
          {document.status === "COMPLETED" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Implement download logic here
                console.log("Downloading document:", document.name);
              }}
            >
              {t("document.download")}
            </Button>
          )}
          {document.status === "PENDING" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Implement signing logic here
                console.log("Signing document:", document.name);
              }}
            >
              {t("document.sign")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
