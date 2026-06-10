import { useAuth } from "../useAuth";
import { useMeUser } from "../useMeUser";

import { getCompetitionUsersMeGroupsOptions } from "@/api/@tanstack/react-query.gen";

import { useQuery } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const useCompetitionUserGroup = () => {
  const { isTokenExpired } = useAuth();
  const { user: me } = useMeUser();
  const { toast } = useToast();

  const { data: myCompetitionGroups } = useQuery({
    ...getCompetitionUsersMeGroupsOptions(),
    enabled: !isTokenExpired(),
    retry: false,
  });

  return {
    myCompetitionGroups,
  };
};
