"use client";

import { LocaleDropdown, ThemeToggle } from "@/app/sg/[locale]/topbar";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@/i18n/navigation";
import { useTokenStore } from "@/stores/token";
import { ExitIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { HiMiniTicket } from "react-icons/hi2";

export function AdminSidebarFooter() {
  const t = useTranslations("sg");
  const { setToken, setRefreshToken } = useTokenStore();

  return (
    <SidebarFooter>
      <div className="flex items-center justify-between">
        <LocaleDropdown />
        <ThemeToggle />
      </div>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/">
              <HiMiniTicket />
              {t("topbar.user")}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => {
              setRefreshToken(null);
              setToken(null);
            }}
          >
            <ExitIcon />
            {t("topbar.logout")}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
