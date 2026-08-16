import { useAuth } from "../useAuth";

import {
  getDocumentsDocumentIdDownloadOptions,
  getDocumentsDocumentIdTokenOptions,
} from "@/api/@tanstack/react-query.gen";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useDocument = () => {
  const { isTokenExpired } = useAuth();
  const [documentId, setDocumentId] = useState<string>("");

  const { data, refetch: refetchData } = useQuery({
    ...getDocumentsDocumentIdDownloadOptions({
      path: {
        document_id: documentId!,
      },
    }),
    retry: false,
    enabled: documentId !== "" && documentId !== undefined && !isTokenExpired(),
  });

  const {
    data: documentWithToken,
    refetch: refetchDocumentWithToken,
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

  return {
    data: data as File,
    documentWithToken,
    refetchData,
    refetchDocumentWithToken,
    isDocumentWithTokenLoading,
    setDocumentId,
    documentId,
  };
};
