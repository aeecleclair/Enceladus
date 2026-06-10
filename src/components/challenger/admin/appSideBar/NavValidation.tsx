"use client";
import { useMeUser } from "@/hooks/useMeUser";
import { useRouter } from "@/i18n/navigation";

import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";

export function NavValidation() {
  const { user: me } = useMeUser();
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() =>
            router.push(`/admin/validation?school_id=${me?.school_id || ""}`)
          }
          className="cursor-pointer hover:underline"
        >
          Validation des inscriptions
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
