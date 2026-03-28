"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
} from "@/src/components/ui/sidebar";
import { useSportSchools } from "@/src/hooks/useSportSchools";
import { useRouter } from "next/navigation";

export function NavSchools() {
  const { sportSchools } = useSportSchools();
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/admin/schools")}
          className="cursor-pointer hover:underline"
        >
          Écoles{" "}
          {(sportSchools?.length ?? 0) > 0 && `(${sportSchools!.length})`}
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
