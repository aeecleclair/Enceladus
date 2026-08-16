import { useAuth } from "../useAuth";

import { TemplateCompleteWithDocuments, TemplateUseResponse } from "@/api";
import {
  getDocumentsTemplatesTemplateIdOptions,
  patchDocumentsTemplatesTemplateIdMutation,
  postDocumentsTemplatesTemplateIdDocumentsMutation,
} from "@/api/@tanstack/react-query.gen";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const useTemplate = (templateId: string) => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();
  const queryKey = getDocumentsTemplatesTemplateIdOptions({
    path: { template_id: templateId },
  }).queryKey;
  const queryClient = useQueryClient();

  const { data: templateComplete } = useQuery({
    ...getDocumentsTemplatesTemplateIdOptions({
      path: { template_id: templateId },
    }),
    enabled: !isTokenExpired(),
    retry: false,
  });

  const { mutate: mutateEditTemplate, isPending: isEditLoading } = useMutation({
    ...patchDocumentsTemplatesTemplateIdMutation(),
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Le template a été modifié avec succès",
      });
      queryClient.invalidateQueries({
        queryKey: queryKey,
      });
    },
    onError: () => {
      toast({
        title: "Erreur lors de la modification du template",
        description: "Une erreur est survenue, veuillez réessayer plus tard",
        variant: "destructive",
      });
    },
  });

  const editTemplate = (
    templateId: string,
    documentDirectoryId: string | null,
  ) => {
    mutateEditTemplate({
      path: {
        template_id: templateId,
      },
      body: {
        document_directory_id: documentDirectoryId,
      },
    });
  };

  const { mutate: mutateUseTemplate, isPending: isUseTemplateLoading } =
    useMutation({
      ...postDocumentsTemplatesTemplateIdDocumentsMutation(),
      onSuccess: (response) => {
        if (response.documents) {
          toast({
            title: "Succès",
            description: `Le template a été utilisé avec succès pour ${response.documents.length} utilisateur(s)`,
          });
          queryClient.invalidateQueries({
            queryKey: queryKey,
          });
        }
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de l'utilisation du template",
          description: "Une erreur est survenue, veuillez réessayer plus tard",
          variant: "destructive",
        });
      },
    });

  const useTemplateForRecipients = (
    templateId: string,
    recipients: string[],
    allowDuplicate: boolean,
    callback?: (response: TemplateUseResponse) => void,
  ) => {
    mutateUseTemplate(
      {
        path: {
          template_id: templateId,
        },
        body: {
          recipients: recipients,
          allow_duplicate: allowDuplicate,
        },
      },
      { onSuccess: (response) => callback && callback(response) },
    );
  };

  const mockUseTemplate = (
    templateId: string,
    recipients: string[],
    allowDuplicate: boolean,
    callback?: (response: TemplateUseResponse) => void,
  ) => {
    const response: TemplateUseResponse = {
      errors: {
        user1: "L'utilisateur n'existe pas",
        user2: "L'utilisateur n'existe pas",
        user3: "L'utilisateur n'existe pas",
        user4: "L'utilisateur n'existe pas",
        user5: "Un document a déjà été généré pour cet utilisateur",
        user6: "Un document a déjà été généré pour cet utilisateur",
        user7: "Un document a déjà été généré pour cet utilisateur",
        user8: "Un document a déjà été généré pour cet utilisateur",
        user9: "Un document a déjà été généré pour cet utilisateur",
        user10: "Une erreur est survenue lors de la génération du document",
        user11: "Une erreur est survenue lors de la génération du document",
        user12: "Une erreur est survenue lors de la génération du document",
        user13: "Une erreur est survenue lors de la génération du document",
        user14: "Une erreur est survenue lors de la génération du document",
        user15: "L'utilisateur n'existe pas",
        user26: "L'utilisateur n'existe pas",
        user37: "L'utilisateur n'existe pas",
        user47: "L'utilisateur n'existe pas",
        user57: "Un document a déjà été généré pour cet utilisateur",
        user67: "Un document a déjà été généré pour cet utilisateur",
        user77: "Un document a déjà été généré pour cet utilisateur",
        user87: "Un document a déjà été généré pour cet utilisateur",
        user97: "Un document a déjà été généré pour cet utilisateur",
        user101: "Une erreur est survenue lors de la génération du document",
        user111: "Une erreur est survenue lors de la génération du document",
        user121: "Une erreur est survenue lors de la génération du document",
        user131: "Une erreur est survenue lors de la génération du document",
        user141: "Une erreur est survenue lors de la génération du document",
        user100: "L'utilisateur n'existe pas",
        user21: "L'utilisateur n'existe pas",
        user31: "L'utilisateur n'existe pas",
        user41: "L'utilisateur n'existe pas",
        user51: "Un document a déjà été généré pour cet utilisateur",
        user61: "Un document a déjà été généré pour cet utilisateur",
        user71: "Un document a déjà été généré pour cet utilisateur",
        user81: "Un document a déjà été généré pour cet utilisateur",
        user91: "Un document a déjà été généré pour cet utilisateur",
        user102: "Une erreur est survenue lors de la génération du document",
        user112: "Une erreur est survenue lors de la génération du document",
        user122: "Une erreur est survenue lors de la génération du document",
        user132: "Une erreur est survenue lors de la génération du document",
        user142: "Une erreur est survenue lors de la génération du document",
        user120: "L'utilisateur n'existe pas",
        user22: "L'utilisateur n'existe pas",
        user32: "L'utilisateur n'existe pas",
        user42: "L'utilisateur n'existe pas",
        user52: "Un document a déjà été généré pour cet utilisateur",
        user62: "Un document a déjà été généré pour cet utilisateur",
        user72: "Un document a déjà été généré pour cet utilisateur",
        user82: "Un document a déjà été généré pour cet utilisateur",
        user92: "Un document a déjà été généré pour cet utilisateur",
        user104: "Une erreur est survenue lors de la génération du document",
        user115: "Une erreur est survenue lors de la génération du document",
        user123: "Une erreur est survenue lors de la génération du document",
        user133: "Une erreur est survenue lors de la génération du document",
        user143: "Une erreur est survenue lors de la génération du document",
      },
      documents: [
        {
          name: "Document 1",
          id: "doc1",
          documenso_id: 1,
          template_id: templateId,
          user_id: "user15",
          status: "COMPLETED",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          module: "module1",
        },
        {
          name: "Document 2",
          id: "doc2",
          documenso_id: 2,
          template_id: templateId,
          user_id: "user16",
          status: "PENDING",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          module: "module1",
        },
      ],
    };
    callback && callback(response);
  };

  const template: TemplateCompleteWithDocuments = {
    documenso_id: 1,
    name: "Template " + templateId,
    recipient_id: 1,
    team_id: "team1",
    id: templateId,
    deleted: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    documents: [
      {
        id: "1",
        documenso_id: 1,
        template_id: "template1",
        name: "Document 1",
        module: "module1",
        user_id: "user1",
        status: "PENDING",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: {
          id: "user1",
          name: "User 1",
          firstname: "User",
          email: "user1@test.fr",
          account_type: "student",
          school_id: "school1",
        },
      },
      {
        id: "2",
        documenso_id: 2,
        template_id: "template1",
        name: "Document 2",
        module: "module1",
        user_id: "user2",
        status: "COMPLETED",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: {
          id: "user2",
          name: "User 2",
          firstname: "User",
          email: "user2@test.fr",
          account_type: "student",
          school_id: "school1",
        },
      },
      {
        id: "3",
        documenso_id: 3,
        template_id: "template1",
        name: "Document 3",
        module: "module1",
        user_id: "user3",
        status: "REJECTED",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: {
          id: "user3",
          name: "User 3",
          firstname: "User",
          email: "user3@test.fr",
          account_type: "student",
          school_id: "school1",
        },
      },
    ],
    team: {
      id: "team1",
      name: "Team 1",
      team_id: 1,
      group_id: "group1",
      api_key: "api_key_1",
    },
  };
  return {
    template: template,
    editTemplate,
    useTemplateForRecipients: mockUseTemplate,
    isEditLoading,
    isUseTemplateLoading,
  };
};
