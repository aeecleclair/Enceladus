import { useGetCompetitionTeamsSchoolsSchoolId } from "@/src/api/hyperionComponents";
import { useAuth } from "./useAuth";

interface UseSchoolTeamsProps {
  schoolId?: string;
}

export const useSchoolTeams = ({ schoolId }: UseSchoolTeamsProps) => {
  const { token, isTokenExpired } = useAuth();

  const {
    data: schoolTeams,
    isLoading,
    refetch: refetchTeams,
  } = useGetCompetitionTeamsSchoolsSchoolId(
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
      queryHash: "getSchoolTeams-" + schoolId,
    },
  );

  return {
    schoolTeams,
    isLoading,
    refetchTeams,
  };
};
