"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
} from "../../ui/sidebar";
import { useRouter } from "next/navigation";

const AVAILABLE_GROUPS = [
  { id: "schools_bds", name: "BDS" },
  { id: "sport_manager", name: "Gestionnaires de sport" },
];

export function NavGroups() {
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/admin/groups")}
          className="cursor-pointer hover:underline"
        >
          Groupes{" "}
          {AVAILABLE_GROUPS.length > 0 && `(${AVAILABLE_GROUPS.length})`}
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
