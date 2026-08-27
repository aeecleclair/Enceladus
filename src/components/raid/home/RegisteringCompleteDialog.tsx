import { LoadingButton } from "@/components/common/LoadingButton";
import { StatusDialog } from "@/components/raid/custom/StatusDialog";
import { useDocument } from "@/hooks/raid/useDocument";
import { useInformation } from "@/hooks/raid/useInformation";
import { useRouter } from "@/i18n/navigation";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { useToast } from "@/components/ui/use-toast";

interface RegisteringCompleteDialogProps {
  isOpened: boolean;
  setIsOpened: (value: boolean) => void;
}

export const RegisteringCompleteDialog = ({
  isOpened,
  setIsOpened,
}: RegisteringCompleteDialogProps) => {
  const t = useTranslations("raid.team.complete");
  const { toast } = useToast();
  const [isFileLoading, setIsFileLoading] = useState(false);
  const { information } = useInformation();
  const { refetch, setDocumentId } = useDocument();
  const router = useRouter();

  function downloadRaidInformation(documentId: string) {
    setIsFileLoading(true);
    setDocumentId(documentId);
    refetch().then((response) => {
      const data = response.data as File | undefined;
      if (!data) {
        toast({
          title: t("downloadErrorTitle"),
          description: t("downloadErrorDescription"),
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
  return (
    information && (
      <StatusDialog
        isOpened={isOpened}
        setIsOpened={setIsOpened}
        title={t("title")}
        description={
          <div className="space-y-2">
            <div>{t("line1")}</div>
            <div>{t("line2")}</div>
            <div>{t("line3")}</div>
            <LoadingButton
              className="w-full mt-6"
              variant="outline"
              onClick={() =>
                downloadRaidInformation(information.raid_information_id!)
              }
              isLoading={isFileLoading}
            >
              {t("download")}
            </LoadingButton>
          </div>
        }
        status="SUCCESS"
        callback={() => {
          setIsOpened(false);
          router.replace("/");
        }}
      />
    )
  );
};
