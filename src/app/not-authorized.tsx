"use client";

import { useTranslations } from "next-intl";

export default function NotAuthorized() {
  const t = useTranslations("common");
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-2xl font-bold">{t("notAuthorized.errorCode")}</h1>
      <p>{t("notAuthorized.title")}</p>
    </div>
  );
}
