import { useAuth } from "../useAuth";

import { TemplateComplete } from "@/api";
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
        if (response.errors) {
          console.error(response.errors);
          const nbErrors = Object.keys(response.errors).length;
          toast({
            title: "Erreur lors de l'utilisation du template",
            description: `Il y a eu une erreur pour ${nbErrors} utilisateur(s), ouvrez la console pour plus d'informations`,
            variant: "destructive",
          });
        }
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
  ) => {
    mutateUseTemplate({
      path: {
        template_id: templateId,
      },
      body: {
        recipients: recipients,
      },
    });
  };

  const template: TemplateComplete = {
    documenso_id: 1,
    name: "Template " + templateId,
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
    useTemplateForRecipients,
    isEditLoading,
    isUseTemplateLoading,
  };
};
