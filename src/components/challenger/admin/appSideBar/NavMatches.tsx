"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
} from "../../ui/sidebar";
import { useRouter } from "next/navigation";
import { useAllMatches } from "@/src/hooks/useAllMatches";

export function NavMatches() {
  const router = useRouter();
  const { allMatches } = useAllMatches();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/admin/matches")}
          className="cursor-pointer hover:underline"
        >
          Matchs{" "}
          {(allMatches?.length ?? 0) > 0 && `(${allMatches!.length})`}
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
