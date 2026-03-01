import { useMeUser } from "../useMeUser";
import { usePermissions } from "../usePermissions";

const TICKETING_ACCESS_PERMISSION = "access_ticketing";
const TICKETING_ADMIN_PERMISSION = "access_cdr";

export const useHasTicketingPermission = () => {
  const { user, isLoading: userLoading } = useMeUser();
  const { permissions, isLoading: permLoading } = usePermissions();

  if (!user || !permissions) {
    return {
      isTicketingAdmin: false,
      hasTicketingAccess: false,
    };
  }

  const access_permission = permissions?.find(
    (value) => value.permission_name == TICKETING_ACCESS_PERMISSION
  );
  const admin_permission = permissions?.find(
    (value) => value.permission_name == TICKETING_ADMIN_PERMISSION
  );

  return {
    isLoading: userLoading || permLoading,
    isTicketingAdmin: Boolean(
      admin_permission &&
        (user.groups?.some((group) =>
          admin_permission.groups.includes(group.id)
        ) ||
          admin_permission.account_types.includes(user.account_type))
    ),
    hasTicketingAccess: Boolean(
      access_permission &&
        (user.groups?.some((group) =>
          access_permission.groups.includes(group.id)
        ) ||
          access_permission.account_types.includes(user.account_type))
    ),
  };
};
