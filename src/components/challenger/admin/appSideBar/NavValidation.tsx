"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
} from "../../ui/sidebar";
import { useRouter } from "next/navigation";
import { useUser } from "@/src/hooks/useUser";

export function NavValidation() {
  const { me } = useUser();
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() =>
            router.push(
              `/admin/validation?school_id=${me?.school_id || ""}`,
            )
          }
          className="cursor-pointer hover:underline"
        >
          Validation des inscriptions
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
