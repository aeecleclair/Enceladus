"use client";
import { useTranslations } from "next-intl";
import { HiMiniTicket } from "react-icons/hi2";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMeUser } from "@/hooks/useMeUser";
import Topbar from "./topbar";

export default function Page() {
  const { user } = useMeUser();
  const t = useTranslations("sg.home");

  return (
    <>
      <Topbar />
      <main className="flex min-h-[calc(--custom-vh-(--spacing(32)))] flex-1 flex-col items-center gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <HiMiniTicket className="size-8 text-primary shrink-0" />
              <CardTitle className="text-xl">
                {t("welcome", { name: user?.firstname ? ` ${user.firstname}` : "" })}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p className="text-muted-foreground">{t("explanation")}</p>
            <p className="text-sm text-muted-foreground">{t("comingSoon")}</p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
