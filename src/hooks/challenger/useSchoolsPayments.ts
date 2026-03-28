import { useGetCompetitionPaymentsSchoolsSchoolId } from "@/src/api/hyperionComponents";
import { useAuth } from "./useAuth";

interface UseSchoolsPaymentsProps {
  schoolId?: string;
}

export const useSchoolsPayments = ({ schoolId }: UseSchoolsPaymentsProps) => {
  const { token, isTokenExpired } = useAuth();

  const {
    data: schoolsPayments,
    refetch: refetchSchoolsPayments,
    error,
  } = useGetCompetitionPaymentsSchoolsSchoolId(
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      pathParams: {
        schoolId: schoolId!,
      },
    },
    {
      enabled: !isTokenExpired() && !!schoolId,
      retry: false,
      queryHash: "getSchoolsPayments",
    },
  );

  return {
    schoolsPayments,
    error,
    refetchSchoolsPayments,
  };
};
