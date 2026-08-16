import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../useAuth";
import { getDocumentsTemplatesOptions } from "@/api/@tanstack/react-query.gen";
import { Template } from "@/api";

export const useTemplates = (teamId: string) => {
  const { isTokenExpired } = useAuth();

  const { data: teamTemplates } = useQuery({
    ...getDocumentsTemplatesOptions({
      query: {
        team_id: teamId,
      },
    }),
    enabled: !isTokenExpired(),
    retry: false,
  });

  const templates: Template[] = [
    {
      id: "1",
      documenso_id: "template1",
      name: "Template 1",
      team_id: teamId,
      deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2",
      documenso_id: "template2",
      name: "Template 2",
      team_id: teamId,
      deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "3",
      documenso_id: "template3",
      name: "Template 3",
      team_id: teamId,
      deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  return {
    teamTemplates: templates,
  };
};
