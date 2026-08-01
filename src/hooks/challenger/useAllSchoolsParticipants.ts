import { useAuth } from "../useAuth";

import { ParticipantComplete } from "@/api";
import { getCompetitionParticipantsSchoolsSchoolIdOptions } from "@/api/@tanstack/react-query.gen";

import { useQueries } from "@tanstack/react-query";

interface useAllSchoolsParticipantsProps {
  schoolIds: string[];
}

/**
 * Fetches the participants of every given school.
 * Each school shares its cache entry with `useSchoolParticipants`, so refetching
 * a single school (after a license validation for instance) also refreshes the
 * counters computed here.
 */
export const useAllSchoolsParticipants = ({
  schoolIds,
}: useAllSchoolsParticipantsProps) => {
  const { isTokenExpired } = useAuth();

  const queries = useQueries({
    queries: schoolIds.map((schoolId) => {
      const options = getCompetitionParticipantsSchoolsSchoolIdOptions({
        path: {
          school_id: schoolId,
        },
      });

      return {
        ...options,
        queryHash: `getSchoolParticipants-${schoolId}`,
        enabled: !isTokenExpired() && !!schoolId,
        retry: false,
        // These queries only feed the tab counters: avoid refetching every school
        // on each window focus, the active school is refreshed on its own.
        staleTime: 60_000,
        refetchOnWindowFocus: false,
      };
    }),
  });

  const participantsBySchool = schoolIds.reduce(
    (acc, schoolId, index) => {
      const query = queries[index];
      if (query.data) {
        acc[schoolId] = query.data;
      }
      return acc;
    },
    {} as Record<string, ParticipantComplete[]>,
  );

  return {
    participantsBySchool,
    isLoading: queries.some((query) => query.isLoading),
  };
};
