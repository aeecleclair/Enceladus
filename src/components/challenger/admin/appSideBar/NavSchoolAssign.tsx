"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
} from "../../ui/sidebar";
import { useRouter } from "next/navigation";

export function NavSchoolAssign() {
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/admin/school-assign")}
          className="cursor-pointer hover:underline"
        >
          Assignation école
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
