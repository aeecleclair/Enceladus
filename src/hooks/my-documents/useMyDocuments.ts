import { getDocumentsMeOptions } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useQuery } from "@tanstack/react-query";

export const useMyDocuments = () => {
  const { isTokenExpired } = useAuth();

  const { data: myDocuments } = useQuery({
    ...getDocumentsMeOptions(),
    enabled: !isTokenExpired(),
    retry: false,
  });

  return {
    myDocuments: myDocuments ?? [],
  };
};
