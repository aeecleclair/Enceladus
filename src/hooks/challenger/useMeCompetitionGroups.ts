import { getCompetitionUsersMeGroupsOptions } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "../useAuth";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useMeUser } from "../useMeUser";

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
