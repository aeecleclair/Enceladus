"use client";

import { AdminBanner } from "@/components/raid/home/AdminBanner";
import { RoleConflictBanner } from "@/components/raid/home/RoleConflictBanner";
import { AppSidebar } from "@/components/raid/home/appSideBar/AppSidebar";
import { useHasRaidPermission } from "@/hooks/raid/useHasRaidPermission";

import { ReactNode } from "react";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface UserShellProps {
  children: ReactNode;
}

export const UserShell = ({ children }: UserShellProps) => {
  const { isRaidAdmin } = useHasRaidPermission();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          {isRaidAdmin && (
            <div className="ml-auto">
              <AdminBanner />
            </div>
          )}
        </header>
        <div className="flex flex-col gap-5 px-4 pb-6 sm:px-6 lg:px-8">
          <RoleConflictBanner />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
