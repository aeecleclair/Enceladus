import { useGetCompetitionParticipantsSchoolsSchoolId } from "@/src/api/hyperionComponents";
import { useAuth } from "../useAuth";

interface UseSchoolParticipants {
  schoolId: string | null;
}

export const useSchoolParticipants = ({ schoolId }: UseSchoolParticipants) => {
  const { token, isTokenExpired } = useAuth();

  const {
    data: schoolParticipants,
    refetch: refetchParticipantSchools,
    error,
  } = useGetCompetitionParticipantsSchoolsSchoolId(
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
      queryHash: "getSchoolParticipants",
    },
  );

  return {
    schoolParticipants,
    error,
    refetchParticipantSchools,
  };
};
