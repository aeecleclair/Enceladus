"use client";
import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { useRouter } from "@/i18n/navigation";

export function NavSearch() {
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/search")}
          className="cursor-pointer hover:underline"
        >
          Matchs
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
