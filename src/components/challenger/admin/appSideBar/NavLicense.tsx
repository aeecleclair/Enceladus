"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
} from "../../ui/sidebar";
import { useRouter } from "next/navigation";

export function NavLicense() {
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/admin/license")}
          className="cursor-pointer hover:underline"
        >
          Validation des licenses
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
