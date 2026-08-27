import { TemplateUseResponse } from "@/api";
import {
  getDocumentsTemplatesTemplateIdOptions,
  patchDocumentsTemplatesTemplateIdMutation,
  postDocumentsTemplatesTemplateIdDocumentsMutation,
} from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const useTemplate = (templateId: string) => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();
  const queryKey = getDocumentsTemplatesTemplateIdOptions({
    path: { template_id: templateId },
  }).queryKey;
  const queryClient = useQueryClient();

  const { data: templateComplete, isLoading } = useQuery({
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
    documentDirectoryPath: string | null,
  ) => {
    mutateEditTemplate({
      path: {
        template_id: templateId,
      },
      body: {
        document_directory_path: documentDirectoryPath,
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

  return {
    template: templateComplete,
    editTemplate,
    useTemplateForRecipients,
    isLoading,
    isEditLoading,
    isUseTemplateLoading,
  };
};
