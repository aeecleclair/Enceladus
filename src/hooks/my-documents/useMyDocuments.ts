import { useAuth } from "../useAuth";
import { useMeUser } from "../useMeUser";

import { DocumentWithTeamInfo } from "@/api";
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

  const documents: DocumentWithTeamInfo[] = [
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
      team_info: {
        id: "team1",
        name: "Team 1",
      },
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
      team_info: {
        id: "team2",
        name: "Team 2",
      },
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
      team_info: {
        id: "team3",
        name: "Team 3",
      },
    },
  ];

  return {
    myDocuments: documents,
  };
};
