"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
} from "../../ui/sidebar";
import { useRouter } from "next/navigation";

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
