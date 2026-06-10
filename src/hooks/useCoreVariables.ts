import { useAuth } from "./useAuth";

import { getVariablesOptions } from "@/api/@tanstack/react-query.gen";

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
