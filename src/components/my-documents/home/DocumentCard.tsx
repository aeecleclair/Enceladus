import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export const DocumentCard = ({
  document,
}: {
  document: {
    title: string;
    status: "signed" | "pending" | "rejected";
    createdAt: string;
  };
}) => {
  const t = useTranslations("myDocuments");
  return (
    <Card>
      <CardHeader>{document.title}</CardHeader>
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
                date: new Date(document.createdAt).toLocaleDateString(),
              })}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={document.status !== "signed"}
            onClick={() => {
              // Implement download logic here
              console.log("Downloading document:", document.title);
            }}
          >
            {t("document.download")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
