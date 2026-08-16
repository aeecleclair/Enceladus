import { useAuth } from "../useAuth";
import { useMeUser } from "../useMeUser";

import { AppCoreDocumentsSchemasDocumentsDocument } from "@/api";
import { getDocumentsMeOptions } from "@/api/@tanstack/react-query.gen";

import { useQuery } from "@tanstack/react-query";

export const useMyDocuments = () => {
  const { isTokenExpired } = useAuth();
  const { user } = useMeUser();

  const { data: myDocuments } = useQuery({
    ...getDocumentsMeOptions(),
    enabled: !isTokenExpired(),
    retry: false,
  });

  const documents: AppCoreDocumentsSchemasDocumentsDocument[] = [
    {
      id: "1",
      documenso_id: 1,
      template_id: "template1",
      name: "Document 1",
      module: "module1",
      user_id: user?.id || "user1",
      status: "PENDING",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2",
      documenso_id: 2,
      template_id: "template2",
      name: "Document 2",
      module: "module2",
      user_id: user?.id || "user1",
      status: "COMPLETED",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "3",
      documenso_id: 3,
      template_id: "template3",
      name: "Document 3",
      module: "module3",
      user_id: user?.id || "user1",
      status: "REJECTED",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  return {
    myDocuments: documents,
  };
};
