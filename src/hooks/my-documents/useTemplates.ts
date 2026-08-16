import { useAuth } from "../useAuth";

import { Template, TemplateWithStatistics } from "@/api";
import { getDocumentsTeamsTeamIdTemplatesOptions } from "@/api/@tanstack/react-query.gen";

import { useQuery } from "@tanstack/react-query";

export const useTemplates = (teamId: string) => {
  const { isTokenExpired } = useAuth();

  const { data: teamTemplates } = useQuery({
    ...getDocumentsTeamsTeamIdTemplatesOptions({
      path: {
        team_id: teamId,
      },
    }),
    enabled: !isTokenExpired(),
    retry: false,
  });

  const templates: TemplateWithStatistics[] = [
    {
      id: "1",
      documenso_id: 1,
      name: "Template 1",
      recipient_id: 1,
      team_id: teamId,
      deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      statistics: {
        total_documents: 10,
        total_signed_documents: 5,
        total_pending_documents: 3,
        total_rejected_documents: 2,
      },
    },
    {
      id: "2",
      documenso_id: 2,
      name: "Template 2",
      recipient_id: 1,
      team_id: teamId,
      deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      statistics: {
        total_documents: 10,
        total_signed_documents: 5,
        total_pending_documents: 3,
        total_rejected_documents: 2,
      },
    },
    {
      id: "3",
      documenso_id: 3,
      name: "Template 3",
      recipient_id: 1,
      team_id: teamId,
      deleted: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      statistics: {
        total_documents: 10,
        total_signed_documents: 5,
        total_pending_documents: 3,
        total_rejected_documents: 2,
      },
    },
  ];

  return {
    teamTemplates: templates,
  };
};
