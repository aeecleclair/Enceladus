import { getCompetitionUsersMeGroupsOptions } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useQuery } from "@tanstack/react-query";

export const useCompetitionUserGroup = () => {
  const { isTokenExpired } = useAuth();

  const { data: myCompetitionGroups } = useQuery({
    ...getCompetitionUsersMeGroupsOptions(),
    enabled: !isTokenExpired(),
    retry: false,
  });

  return {
    myCompetitionGroups,
  };
};
