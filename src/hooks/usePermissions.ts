import { getPermissionsOptions } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useQuery } from "@tanstack/react-query";

export const usePermissions = () => {
  const { isTokenExpired } = useAuth();

  const query = useQuery({
    ...getPermissionsOptions(),
    enabled: !isTokenExpired(),
  });

  return {
    permissions: query.data,
    ...query,
  };
};
