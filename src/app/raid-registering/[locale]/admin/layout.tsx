"use client";

import AdminFallback from "@/components/raid/admin/AdminFallback";
import { AdminUserToggle } from "@/components/raid/admin/AdminUserToggle";
import { AppSidebar } from "@/components/raid/admin/appSideBar/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEdition } from "@/hooks/raid/useEdition";
import { useHasRaidPermission } from "@/hooks/raid/useHasRaidPermission";
import { useMeUser } from "@/hooks/useMeUser";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Fragment, ReactNode, useEffect } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user: me } = useMeUser();
  const { isRaidAdmin } = useHasRaidPermission();
  const router = useRouter();
  const { edition } = useEdition();

  useEffect(() => {
    if (me && !isRaidAdmin) {
      router.replace("/?redirect=/admin");
    }
  }, [me, isRaidAdmin, router]);

  const getBreadcrumbSegments = () => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: { label: string; href: string; isLast: boolean }[] = [];

    breadcrumbs.push({
      label: "Administration",
      href: "/admin",
      isLast: segments.length === 1,
    });

    const routeMap: Record<string, string> = {
      editions: "Éditions",
      participants: "Participants",
      teams: "Équipes",
      volunteers: "Bénévoles",
      information: "Informations",
      create: "Ajouter",
      edit: "Modifier",
    };

    for (let i = 1; i < segments.length; i++) {
      const segment = segments[i];
      const href = "/" + segments.slice(0, i + 1).join("/");
      const isLast = i === segments.length - 1;
      const label =
        routeMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({ label, href, isLast });
    }

    return breadcrumbs;
  };

  const breadcrumbSegments = getBreadcrumbSegments();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-linear-to-b from-muted/20 via-background to-muted/10">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b bg-background/85 backdrop-blur-sm">
          <div className="mx-auto flex w-full items-center gap-2 px-3 sm:px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbSegments.map((segment, index) => (
                  <Fragment key={index}>
                    <BreadcrumbItem>
                      {segment.isLast ? (
                        <BreadcrumbPage>{segment.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          onClick={() => router.push(segment.href)}
                          className="cursor-pointer"
                        >
                          {segment.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!segment.isLast && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto">
              <AdminUserToggle />
            </div>
          </div>
        </header>
        <div className="mx-auto flex h-full w-full flex-col overflow-auto px-3 py-5 sm:px-4 sm:py-6">
          {pathname.startsWith("/admin/editions") ? (
            children
          ) : edition ? (
            children
          ) : (
            <AdminFallback />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
