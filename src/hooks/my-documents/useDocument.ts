import { useAuth } from "../useAuth";

import { DocumentWithToken } from "@/api";
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

  const documentWithTokenData: DocumentWithToken = {
    id: "1",
    documenso_id: 1,
    template_id: "template1",
    name: "Document 1",
    module: "module1",
    user_id: "user1",
    status: "PENDING",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    signing_token: "token",
  };

  return {
    data: data as File,
    documentWithToken: documentWithTokenData,
    refetchData,
    refetchDocumentWithToken,
    isDocumentWithTokenLoading,
    setDocumentId,
    documentId,
  };
};
