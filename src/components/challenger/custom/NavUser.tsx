"use client";
import { ChevronsUpDown, LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useMeUser } from "@/hooks/useMeUser";
import { useHasChallengerPermission } from "@/hooks/challenger/useHasChallengerPermission";
import { usePathname, useRouter } from "@/i18n/navigation";

export function NavUser() {
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const { logout } = useAuth();
  const { user: me } = useMeUser();
  const { isChallengerAdmin, isBDS, isSportManager } =
    useHasChallengerPermission();
  const router = useRouter();

  const isOnAdminPage = pathname.startsWith("/admin");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {me?.firstname} {me?.name}
                </span>
                <span className="truncate text-xs">{me?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            {(isChallengerAdmin || isBDS || isSportManager) && (
              <DropdownMenuItem
                onClick={() => router.push(isOnAdminPage ? "/" : "/admin")}
              >
                <Settings className="mr-2 h-4 w-4" />
                {isOnAdminPage ? "Utilisateur" : "Administration"}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
