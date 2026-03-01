"use client";

import { StatusDialog } from "@/components/siarnaq/custom/StatusDialog";
import { AssociationPanel } from "@/components/siarnaq/user/AssociationPanel";
import { CentralPanel } from "@/components/siarnaq/user/CentralPanel";
import { useOnlineSellers } from "@/hooks/siarnaq/useOnlineSellers";
import { useTokenStore } from "@/stores/token";

import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useCdrUser } from "@/hooks/siarnaq/useCdrUser";
import Footer from "@/components/common/footer";

export default function Home() {
  const showSellerFeatureFlag = true;
  const { userId } = useTokenStore();
  const { user, refetch } = useCdrUser(userId);
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const { onlineSellers } = useOnlineSellers();
  const [isEndDialogOpened, setIsEndDialogOpened] = useState(true);
  const t = useTranslations("siarnaq");

  return (
    <div className="flex min-h-[--custom-vh] w-full flex-col">
      {code === "succeeded" && (
        <StatusDialog
          isOpened={isEndDialogOpened}
          setIsOpened={setIsEndDialogOpened}
          title={t("page.succeededTitle")}
          description={t("page.succeededDescription")}
          status="SUCCESS"
          callback={() => {
            refetch();
            setIsEndDialogOpened(false);
            router.replace("/?sellerId=recap");
          }}
        />
      )}
      {code === "refused" && (
        <StatusDialog
          isOpened={isEndDialogOpened}
          setIsOpened={setIsEndDialogOpened}
          title={t("page.refusedTitle")}
          description={t("page.refusedDescription")}
          status="ERROR"
          callback={() => {
            setIsEndDialogOpened(false);
            router.replace("/?sellerId=recap");
          }}
        />
      )}
      <main className="flex min-h-[calc(--custom-vh-(--spacing(32)))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        {onlineSellers && (
          <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
            <AssociationPanel
              canClick={!!user?.curriculum}
              onlineSellers={onlineSellers}
              showSellerFeatureFlag={showSellerFeatureFlag}
            />
            {user && (
              <CentralPanel showSellerFeatureFlag={showSellerFeatureFlag} />
            )}
          </div>
        )}
        <Footer />
      </main>
    </div>
  );
}
