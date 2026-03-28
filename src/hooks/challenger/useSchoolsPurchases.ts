import { useGetCompetitionPurchasesSchoolsSchoolId } from "@/src/api/hyperionComponents";
import { useAuth } from "./useAuth";

interface UseSchoolsPurchasesProps {
  schoolId?: string;
}

export const useSchoolsPurchases = ({ schoolId }: UseSchoolsPurchasesProps) => {
  const { token, isTokenExpired } = useAuth();

  const {
    data: schoolsPurchases,
    refetch: refetchSchoolsPurchases,
    error,
  } = useGetCompetitionPurchasesSchoolsSchoolId(
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
      queryHash: "getSchoolsPurchases",
    },
  );

  return {
    schoolsPurchases,
    error,
    refetchSchoolsPurchases,
  };
};
