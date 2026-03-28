"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
} from "@/src/components/ui/sidebar";
import { useLocations } from "@/src/hooks/useLocations";
import { useRouter } from "next/navigation";

export function NavLocations() {
  const { locations } = useLocations();
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/admin/locations")}
          className="cursor-pointer hover:underline"
        >
          Lieux {(locations?.length ?? 0) > 0 && `(${locations!.length})`}
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
