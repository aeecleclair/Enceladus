"use client";

import AdminFallback from "@/components/challenger/admin/AdminFallback";
import { AppSidebar } from "@/components/challenger/admin/appSideBar/AppSidebar";
import { useEdition } from "@/hooks/challenger/useEdition";
import { useHasChallengerPermission } from "@/hooks/challenger/useHasChallengerPermission";
import { useMeUser } from "@/hooks/useMeUser";
import { useRouter } from "@/i18n/navigation";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

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

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user: me } = useMeUser();
  const { isChallengerAdmin, isBDS, isSportManager } =
    useHasChallengerPermission();
  const router = useRouter();
  const { edition } = useEdition();

  if (
    me &&
    !(isChallengerAdmin || isBDS || isSportManager) &&
    typeof window !== "undefined"
  ) {
    router.replace("/?redirect=/admin");
  }

  const getBreadcrumbSegments = () => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs = [];

    breadcrumbs.push({
      label: "Administration",
      href: "/admin",
      isLast: segments.length === 1,
    });

    const routeMap: { [key: string]: string } = {
      editions: "Éditions",
      schools: "Écoles",
      sports: "Sports",
      "volunteer-shifts": "Créneaux Bénévoles",
      locations: "Lieux",
      products: "Produits",
      matches: "Matchs",
      teams: "Équipes",
      podiums: "Podiums",
      groups: "Groupes",
      validation: "Validation",
      "school-assign": "Assignation école",
      create: "Ajouter",
      edit: "Modifier",
    };

    for (let i = 1; i < segments.length; i++) {
      const segment = segments[i];
      const href = "/" + segments.slice(0, i + 1).join("/");
      const isLast = i === segments.length - 1;

      const label =
        routeMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

      breadcrumbs.push({
        label,
        href,
        isLast,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbSegments = getBreadcrumbSegments();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbSegments.map((segment, index) => (
                  <BreadcrumbItem key={index}>
                    {segment.isLast ? (
                      <BreadcrumbPage>{segment.label}</BreadcrumbPage>
                    ) : (
                      <>
                        <BreadcrumbLink
                          onClick={() => router.push(segment.href)}
                          className="cursor-pointer"
                        >
                          {segment.label}
                        </BreadcrumbLink>
                        <BreadcrumbSeparator className="hidden md:block" />
                      </>
                    )}
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-col relative overflow-auto h-full m-6">
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
