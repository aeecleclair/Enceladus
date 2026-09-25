"use client";

import { useRouter } from "@/i18n/navigation";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

import { Shield } from "lucide-react";

/**
 * Compact admin-mode pill meant to live inside the shell header, next to
 * the sidebar trigger, so it doesn't steal vertical space from the page.
 */
export const AdminBanner = () => {
  const t = useTranslations("raid.common");
  const router = useRouter();
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => router.push("/admin")}
      className="gap-2 border-amber-500/40 bg-amber-500/10 text-amber-900 hover:bg-amber-500/20 hover:text-amber-900 dark:text-amber-300"
    >
      <Shield className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{t("adminMode")}</span>
      <span className="sm:hidden">Admin</span>
    </Button>
  );
};
