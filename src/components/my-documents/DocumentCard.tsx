import { AppCoreDocumentsSchemasDocumentsDocument } from "@/api";
import { useDocument } from "@/hooks/my-documents/useDocument";
import { useMeUser } from "@/hooks/useMeUser";
import { useRouter } from "@/i18n/navigation";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Badge } from "../ui/badge";
import { useToast } from "../ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const DocumentCard = ({
  doc,
}: {
  doc: AppCoreDocumentsSchemasDocumentsDocument;
}) => {
  const { user } = useMeUser();
  const t = useTranslations("myDocuments");
  const router = useRouter();
  const { toast } = useToast();
  const {
    setDocumentId,
    refetchData,
    refetchDocumentWithToken,
    isDocumentWithTokenLoading,
    documentWithToken,
  } = useDocument();
  const [isFileLoading, setIsFileLoading] = useState(false);

  function downloadDocument(documentId: string) {
    setIsFileLoading(true);
    setDocumentId(documentId);
    refetchData().then((response) => {
      const data = response.data as File | null;
      if (!data) {
        toast({
          title: "Erreur",
          description: "Impossible de télécharger le fichier",
          variant: "destructive",
        });
        setIsFileLoading(false);
        return;
      }
      const extension = data.type.split("/")[1];
      const name = `Réglement_du_raid.${extension}`;
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", name);
      document.body.appendChild(link);
      setIsFileLoading(false);
      link.click();
    });
  }

  function signDocument(documentId: string) {
    setDocumentId(documentId);
    refetchDocumentWithToken().then((response) => {
      if (!documentWithToken) {
        toast({
          title: "Erreur",
          description: "Impossible de récupérer le token de signature",
          variant: "destructive",
        });
        return;
      }
      const signingToken = documentWithToken.signing_token;
      const fullName = encodeURIComponent(
        user ? `${user?.firstname} ${user?.name}` : "",
      );
      const email = encodeURIComponent(user ? user?.email : "");
      router.push({
        pathname: `/sign`,
        query: {
          signingToken: signingToken,
          fullName: fullName,
          email: email,
        },
      });
    });
  }

  const badgeClasses: Record<string, string> = {
    PENDING: "bg-blue-200 text-blue-800",
    COMPLETED: "bg-green-200  text-green-800",
    REJECTED: "bg-red-200    text-red-800",
    default: "bg-gray-200   text-gray-800",
  };

  return (
    <Card>
      <CardHeader>{doc.name}</CardHeader>
      <CardContent>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-2">
            <Badge className={badgeClasses[doc.status] ?? badgeClasses.default}>
              {t(`document.status.${doc.status}`)}
            </Badge>
            <p>
              {t("home.documentCreation", {
                date: new Date(doc.created_at).toLocaleDateString(),
              })}
            </p>
            {doc.status !== "PENDING" && (
              <p>
                {t("home.documentUpdate", {
                  date: new Date(doc.updated_at).toLocaleDateString(),
                })}
              </p>
            )}
          </div>
          {doc.status === "COMPLETED" && (
            <Button
              variant="outline"
              size="sm"
              disabled={isFileLoading}
              onClick={() => {
                downloadDocument(doc.id);
              }}
            >
              {t("document.download")}
            </Button>
          )}
          {doc.status === "PENDING" && (
            <Button
              variant="outline"
              size="sm"
              disabled={isDocumentWithTokenLoading}
              onClick={() => {
                signDocument(doc.id);
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
