import { useAuth } from "../useAuth";

import { getCompetitionUsersMeGroupsOptions } from "@/api/@tanstack/react-query.gen";

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
