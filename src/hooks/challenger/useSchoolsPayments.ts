import { useAuth } from "../useAuth";

import { getCompetitionPaymentsSchoolsSchoolIdOptions } from "@/api/@tanstack/react-query.gen";

import { useQuery } from "@tanstack/react-query";

interface UseSchoolsPaymentsProps {
  schoolId?: string;
}

export const useSchoolsPayments = ({ schoolId }: UseSchoolsPaymentsProps) => {
  const { isTokenExpired } = useAuth();

  const {
    data: schoolsPayments,
    refetch: refetchSchoolsPayments,
    error,
  } = useQuery({
    ...getCompetitionPaymentsSchoolsSchoolIdOptions({
      path: {
        school_id: schoolId!,
      },
    }),
    enabled: !isTokenExpired() && !!schoolId,
    retry: false,
    queryHash: "getSchoolsPayments",
  });

  return {
    schoolsPayments,
    error,
    refetchSchoolsPayments,
  };
};
