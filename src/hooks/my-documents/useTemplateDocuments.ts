import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../useAuth";
import { getDocumentsTemplatesTemplateIdDocumentsOptions } from "@/api/@tanstack/react-query.gen";
import { AppCoreDocumentsSchemasDocumentsDocument } from "@/api";

export const useTemplateDocuments = (templateId: string) => {
  const { isTokenExpired } = useAuth();

  const { data: templateDocuments } = useQuery({
    ...getDocumentsTemplatesTemplateIdDocumentsOptions({
      path: { template_id: templateId },
    }),
    enabled: !isTokenExpired(),
    retry: false,
  });

  const documents: AppCoreDocumentsSchemasDocumentsDocument[] = [
    {
      id: "1",
      template_id: "template1",
      name: "Document 1",
      module: "module1",
      user_id: "user1",
      status: "PENDING",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2",
      template_id: "template1",
      name: "Document 2",
      module: "module1",
      user_id: "user2",
      status: "COMPLETED",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "3",
      template_id: "template1",
      name: "Document 3",
      module: "module1",
      user_id: "user3",
      status: "REJECTED",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  return {
    templateDocuments: documents,
  };
};
