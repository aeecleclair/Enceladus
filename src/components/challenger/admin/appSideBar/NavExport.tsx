"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
} from "../../ui/sidebar";
import { useRouter } from "next/navigation";

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
