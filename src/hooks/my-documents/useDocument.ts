import {
  getDocumentsDocumentIdDownloadOptions,
  getDocumentsDocumentIdTokenOptions,
} from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useDocument = () => {
  const { isTokenExpired } = useAuth();
  const [documentId, setDocumentId] = useState<string>("");

  const {
    data,
    refetch: refetchDataQuery,
    isLoading: isDataLoading,
  } = useQuery({
    ...getDocumentsDocumentIdDownloadOptions({
      path: {
        document_id: documentId!,
      },
    }),
    retry: false,
    enabled: documentId !== "" && documentId !== undefined && !isTokenExpired(),
  });

  const refetchData = async (documentId: string) => {
    setDocumentId(documentId);
    return await refetchDataQuery();
  };

  const {
    data: documentWithToken,
    refetch: refetchDocumentWithTokenQuery,
    isLoading: isDocumentWithTokenLoading,
  } = useQuery({
    ...getDocumentsDocumentIdTokenOptions({
      path: {
        document_id: documentId!,
      },
    }),
    retry: false,
    enabled: documentId !== "" && documentId !== undefined && !isTokenExpired(),
  });

  const refetchDocumentWithToken = async (documentId: string) => {
    setDocumentId(documentId);
    return await refetchDocumentWithTokenQuery();
  };

  return {
    data: data as File,
    documentWithToken,
    refetchData,
    refetchDocumentWithToken,
    isDocumentWithTokenLoading,
    isDataLoading,
  };
};
