"use client";
import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useEditions } from "@/hooks/challenger/useEditions";

export function NavEditions() {
  const router = useRouter();
  const { editions } = useEditions();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/admin/editions")}
          className="cursor-pointer hover:underline"
        >
          Éditions {(editions?.length ?? 0) > 0 && `(${editions?.length})`}
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
