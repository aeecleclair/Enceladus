"use client";
import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { useRouter } from "@/i18n/navigation";

export function NavExport() {
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/admin/exports")}
          className="cursor-pointer hover:underline"
        >
          Exports
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
