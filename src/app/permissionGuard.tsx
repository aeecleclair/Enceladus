"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import NotAuthorized from "./not-authorized";
import { usePermissions } from "@/hooks/usePermissions"; // Votre hook de base
import { useMeUser } from "@/hooks/useMeUser";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
  permissionRequired: string;
}

export function PermissionGuard({ children, permissionRequired }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { token } = useAuth();
  const { user } = useMeUser();
  const { permissions } = usePermissions();
  const [isMounted, setIsMounted] = useState(false);

  const hasToken = !!token;

  const access_permission = permissions?.find(
    (value) => value.permission_name == permissionRequired,
  );

  // `hasAccess` can only be evaluated once user AND permissions are loaded.
  // Until then it's `null` (unknown) — the guard treats unknown as permissive
  // so individual pages can render and run their own loading states.
  const hasAccess: boolean | null =
    user && permissions
      ? Boolean(
          access_permission &&
            (user.groups?.some((group) =>
              access_permission.groups.includes(group.id),
            ) ||
              access_permission.account_types.includes(user.account_type)),
        )
      : null;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (!hasToken && pathname !== "/login") {
      router.replace("/login");
      return;
    }
    if (hasAccess === false && pathname !== "/") {
      router.replace("/");
    }
  }, [isMounted, hasToken, hasAccess, pathname, router]);

  // Keep SSR and first client render identical to avoid hydration mismatch.
  if (!isMounted) {
    return null;
  }

  if (pathname === "/login") {
    return <>{children}</>;
  }

  if (!hasToken) {
    // Effect above will redirect to /login.
    return null;
  }

  if (hasAccess === false) {
    return <NotAuthorized />;
  }

  return <>{children}</>;
}
