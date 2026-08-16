"use client";

import NotAuthorized from "./not-authorized";

import { useAuth } from "@/hooks/useAuth";
// Votre hook de base
import { useMeUser } from "@/hooks/useMeUser";
import { usePermissions } from "@/hooks/usePermissions";
import { usePathname, useRouter } from "@/i18n/navigation";

import { useEffect, useSyncExternalStore } from "react";

interface Props {
  children: React.ReactNode;
  permissionRequired: string;
  noAuthRequiredPages?: string[];
}

export function PermissionGuard({
  children,
  permissionRequired,
  noAuthRequiredPages,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { token } = useAuth();
  const { user, isLoading: userLoading } = useMeUser();
  const { permissions, isLoading: permLoading } = usePermissions();
  // `false` during SSR and the first client render, `true` after hydration —
  // detects mount without a set-state-in-effect, keeping SSR/client markup in
  // sync to avoid hydration mismatch.
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

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
    if (!isMounted) return;

    if (
      !hasToken &&
      !(pathname == "/login" || noAuthRequiredPages?.includes(pathname))
    ) {
      router.replace("/login");
      return;
    }
    if (userLoading || permLoading) {
      return;
    }
    if (hasAccess === false && pathname !== "/") {
      router.replace("/");
    }
  }, [
    isMounted,
    hasToken,
    hasAccess,
    pathname,
    router,
    noAuthRequiredPages,
    userLoading,
    permLoading,
  ]);

  // Keep SSR and first client render identical to avoid hydration mismatch.
  if (!isMounted) {
    return null;
  }

  if (userLoading || permLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Chargement...
      </div>
    );
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
