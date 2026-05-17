"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { UserRound } from "lucide-react";

/**
 * Compact pill in the admin header that takes the admin back to the
 * participant/volunteer side of the app, mirroring the AdminBanner pill
 * that lives in the user shell.
 */
export const AdminUserToggle = () => {
  const router = useRouter();
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => router.push("/")}
      className="gap-2"
    >
      <UserRound className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">Vue utilisateur</span>
      <span className="sm:hidden">Utilisateur</span>
    </Button>
  );
};
