import { useMeUser } from "../useMeUser";
import { usePermissions } from "../usePermissions";
import { useCompetitionUserGroup } from "./useMeCompetitionGroups";

const CHALLENGER_ACCESS_PERMISSION = "access_sport_competition";
const CHALLENGER_ADMIN_PERMISSION = "manage_sport_competition";
const VOLUNTEER_PERMISSION = "volunteer_sport_competition";

const SPORT_MANAGER = "sport_manager";
const SCHOOLS_BDS = "schools_bds";

export const useHasChallengerPermission = () => {
  const { user, isLoading: userLoading } = useMeUser();
  const { permissions, isLoading: permLoading } = usePermissions();
  const { myCompetitionGroups } = useCompetitionUserGroup();

  if (!user || !permissions) {
    return {
      isRaidAdmin: false,
      hasRaidAccess: false,
    };
  }

  const access_permission = permissions?.find(
    (value) => value.permission_name == CHALLENGER_ACCESS_PERMISSION,
  );
  const admin_permission = permissions?.find(
    (value) => value.permission_name == CHALLENGER_ADMIN_PERMISSION,
  );
  const volunteer_permission = permissions?.find(
    (value) => value.permission_name == VOLUNTEER_PERMISSION,
  );

  const isBDS =
    myCompetitionGroups?.some((group) => group.group === SCHOOLS_BDS) ?? false;

  const isSportManager =
    myCompetitionGroups?.some((group) => group.group === SPORT_MANAGER) ??
    false;

  return {
    isLoading: userLoading || permLoading,
    isBDS: isBDS,
    isSportManager: isSportManager,
    isChallengerAdmin: Boolean(
      admin_permission &&
      (user.groups?.some((group) =>
        admin_permission.groups.includes(group.id),
      ) ||
        admin_permission.account_types.includes(user.account_type)),
    ),
    hasChallengerAccess: Boolean(
      access_permission &&
      (user.groups?.some((group) =>
        access_permission.groups.includes(group.id),
      ) ||
        access_permission.account_types.includes(user.account_type)),
    ),
    hasVolunteerAccess: Boolean(
      volunteer_permission &&
      (user.groups?.some((group) =>
        volunteer_permission.groups.includes(group.id),
      ) ||
        volunteer_permission.account_types.includes(user.account_type)),
    ),
  };
};
