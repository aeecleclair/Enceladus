"use client";
import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { useRouter } from "@/i18n/navigation";

export function NavPodium() {
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/podiums")}
          className="cursor-pointer hover:underline"
        >
          Podiums
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
