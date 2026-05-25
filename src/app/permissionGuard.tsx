"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import NotAuthorized from "./not-authorized";
import { usePermissions } from "@/hooks/usePermissions";
import { useMeUser } from "@/hooks/useMeUser";

interface Props {
  children: React.ReactNode;
  permissionRequired: string;
}

export function PermissionGuard({ children, permissionRequired }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading: userLoading } = useMeUser();
  const { permissions, isLoading: permLoading } = usePermissions();

  if (userLoading || permLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Chargement...
      </div>
    );
  }
  if (!user) {
    if (pathname !== "/login") {
      router.replace("/login");
      return null;
    }
    return <>{children}</>;
  }

  const access_permission = permissions?.find(
    (value) => value.permission_name == permissionRequired,
  );

  const hasAccess = Boolean(
    access_permission &&
      (user.groups?.some((group) =>
        access_permission.groups.includes(group.id),
      ) ||
        access_permission.account_types.includes(user.account_type)),
  );
  if (!hasAccess) {
    if (pathname !== "/") router.replace("/");
    return <NotAuthorized />;
  }

  return <>{children}</>;
}
