"use client";
import { useTokenStore } from "@/stores/token";

import { useTranslations } from "next-intl";

export default function Home() {
  const { userId } = useTokenStore();
  const t = useTranslations("myDocuments");

  return (
    <div className="flex h-screen w-screen p-8">
      {t("home.welcome", { userId: userId ?? "Guest" })}
    </div>
  );
}
