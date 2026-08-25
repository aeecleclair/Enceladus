import { getVariablesOptions } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useQuery } from "@tanstack/react-query";

export const useCoreVariables = () => {
  const { isTokenExpired } = useAuth();
  const query = useQuery({
    ...getVariablesOptions(),
    enabled: !isTokenExpired(),
  });

  return {
    variables: query.data,
    ...query,
  };
};
