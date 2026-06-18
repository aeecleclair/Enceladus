import { useAuth } from "../useAuth";

import { getCompetitionPurchasesSchoolsSchoolIdOptions } from "@/api/@tanstack/react-query.gen";

import { useQuery } from "@tanstack/react-query";

interface UseSchoolsPurchasesProps {
  schoolId?: string;
}

export const useSchoolsPurchases = ({ schoolId }: UseSchoolsPurchasesProps) => {
  const { isTokenExpired } = useAuth();

  const {
    data: schoolsPurchases,
    refetch: refetchSchoolsPurchases,
    error,
  } = useQuery({
    ...getCompetitionPurchasesSchoolsSchoolIdOptions({
      path: {
        school_id: schoolId!,
      },
    }),
    enabled: !isTokenExpired() && !!schoolId,
    retry: false,
    queryHash: "getSchoolsPurchases",
  });

  return {
    schoolsPurchases,
    error,
    refetchSchoolsPurchases,
  };
};
