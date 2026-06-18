import { useMeUser } from "../useMeUser";
import { usePermissions } from "../usePermissions";

const RAID_ACCESS_PERMISSION = "access_raid";
const RAID_ADMIN_PERMISSION = "manage_raid";

export const useHasRaidPermission = () => {
  const { user, isLoading: userLoading } = useMeUser();
  const { permissions, isLoading: permLoading } = usePermissions();

  if (!user || !permissions) {
    return {
      isRaidAdmin: false,
      hasRaidAccess: false,
    };
  }

  const access_permission = permissions?.find(
    (value) => value.permission_name == RAID_ACCESS_PERMISSION,
  );
  const admin_permission = permissions?.find(
    (value) => value.permission_name == RAID_ADMIN_PERMISSION,
  );

  return {
    isLoading: userLoading || permLoading,
    isRaidAdmin: Boolean(
      admin_permission &&
      (user.groups?.some((group) =>
        admin_permission.groups.includes(group.id),
      ) ||
        admin_permission.account_types.includes(user.account_type)),
    ),
    hasRaidAccess: Boolean(
      access_permission &&
      (user.groups?.some((group) =>
        access_permission.groups.includes(group.id),
      ) ||
        access_permission.account_types.includes(user.account_type)),
    ),
  };
};
