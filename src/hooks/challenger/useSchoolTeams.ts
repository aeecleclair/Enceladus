import { getCompetitionTeamsSchoolsSchoolIdOptions } from "@/api/@tanstack/react-query.gen";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../useAuth";

interface UseSchoolTeamsProps {
  schoolId?: string;
}

export const useSchoolTeams = ({ schoolId }: UseSchoolTeamsProps) => {
  const { isTokenExpired } = useAuth();

  const {
    data: schoolTeams,
    isLoading,
    refetch: refetchTeams,
  } = useQuery({
    ...getCompetitionTeamsSchoolsSchoolIdOptions({
      path: {
        school_id: schoolId!,
      },
    }),
    enabled: !isTokenExpired() && !!schoolId,
    retry: false,
    queryHash: "getSchoolTeams-" + schoolId,
  });

  return {
    schoolTeams,
    isLoading,
    refetchTeams,
  };
};
