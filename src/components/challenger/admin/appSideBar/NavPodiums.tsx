"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
} from "@/src/components/ui/sidebar";
import { useSports } from "@/src/hooks/useSports";
import { useRouter } from "next/navigation";

export function NavPodiums() {
  const { sports } = useSports();
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/admin/podiums")}
          className="cursor-pointer hover:underline"
        >
          Podiums{" "}
          {(sports?.length ?? 0) > 0 && `(${sports!.length} sports)`}
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
