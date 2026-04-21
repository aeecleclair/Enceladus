"use client";
import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { useRouter } from "@/i18n/navigation";

export function NavLocations() {
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/locations")}
          className="cursor-pointer hover:underline"
        >
          Lieux
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
