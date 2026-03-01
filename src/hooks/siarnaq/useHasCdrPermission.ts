import { useMeUser } from "../useMeUser";
import { usePermissions } from "../usePermissions";

const CDR_ACCESS_PERMISSION = "access_cdr";
const CDR_ADMIN_PERMISSION = "access_cdr";

export const useHasCdrPermission = () => {
  const { user, isLoading: userLoading } = useMeUser();
  const { permissions, isLoading: permLoading } = usePermissions();

  if (!user || !permissions) {
    return {
      isCdrAdmin: false,
      hasCdrAccess: false,
    };
  }

  const access_permission = permissions?.find(
    (value) => value.permission_name == CDR_ACCESS_PERMISSION
  );
  const admin_permission = permissions?.find(
    (value) => value.permission_name == CDR_ADMIN_PERMISSION
  );

  return {
    isLoading: userLoading || permLoading,
    isCdrAdmin: Boolean(
      admin_permission &&
        (user.groups?.some((group) =>
          admin_permission.groups.includes(group.id)
        ) ||
          admin_permission.account_types.includes(user.account_type))
    ),
    hasCdrAccess: Boolean(
      access_permission &&
        (user.groups?.some((group) =>
          access_permission.groups.includes(group.id)
        ) ||
          access_permission.account_types.includes(user.account_type))
    ),
  };
};
