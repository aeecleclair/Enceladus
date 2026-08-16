import { getPermissionsOptions } from "@/api/@tanstack/react-query.gen";

import { useQuery } from "@tanstack/react-query";

export const usePermissions = () => {
  const query = useQuery({
    ...getPermissionsOptions(),
  });

  return {
    permissions: query.data,
    ...query,
  };
};
