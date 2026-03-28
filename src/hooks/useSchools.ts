import { useAuth } from "./useAuth";

import { getSchoolsOptions } from "@/api/@tanstack/react-query.gen";

import { useQuery } from "@tanstack/react-query";

export const useSchools = () => {
  const { isTokenExpired } = useAuth();
  const NoSchoolId = "dce19aa2-8863-4c93-861e-fb7be8f610ed";

  const { data, isLoading, refetch } = useQuery({
    ...getSchoolsOptions(),
    retry: 3,
    enabled: !isTokenExpired(),
  });

  const filteredSchools = data?.filter((school) => school.id !== NoSchoolId);

  return {
    schools: data || [],
    filteredSchools: filteredSchools || [],
    isLoading,
    refetch,
  };
};
