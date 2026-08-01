import { useAuth } from "../useAuth";

import { getCompetitionParticipantsSchoolsSchoolIdOptions } from "@/api/@tanstack/react-query.gen";

import { useQuery } from "@tanstack/react-query";

interface UseSchoolParticipants {
  schoolId: string | null;
}

export const useSchoolParticipants = ({ schoolId }: UseSchoolParticipants) => {
  const { isTokenExpired } = useAuth();

  const {
    data: schoolParticipants,
    refetch: refetchParticipantSchools,
    error,
  } = useQuery({
    ...getCompetitionParticipantsSchoolsSchoolIdOptions({
      path: {
        school_id: schoolId!,
      },
    }),
    enabled: !isTokenExpired() && !!schoolId,
    retry: false,
    queryHash: `getSchoolParticipants-${schoolId}`,
  });

  return {
    schoolParticipants,
    error,
    refetchParticipantSchools,
  };
};
