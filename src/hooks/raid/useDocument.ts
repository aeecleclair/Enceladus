import { DocumentValidation } from "@/api";
import {
  getRaidDocumentDocumentIdOptions,
  postRaidDocumentDocumentIdValidateMutation,
} from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";
import { useDocumentsStore } from "@/stores/raid/documents";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useToast } from "@/components/ui/use-toast";

import axios from "axios";

export const useDocument = () => {
  const backUrl: string =
    process.env.NEXT_PUBLIC_BACKEND_URL || "https://hyperion.myecl.fr";
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const { toast } = useToast();
  const { documents } = useDocumentsStore();
  const [documentId, setDocumentId] = useState<string>("");

  const uploadDocument = (
    file: File,
    documentType: string,
    callback: (documentId: string) => void,
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post(`${backUrl}/raid/document/${documentType}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status > 300) {
          console.error(response.data);
          toast({
            title: "Erreur lors de l'ajout du document",
            description:
              "Une erreur est survenue, veuillez réessayer plus tard",
            variant: "destructive",
          });
          return;
        }
        queryClient.invalidateQueries({
          predicate: (query) => {
            return query.queryHash === "getDocument";
          },
        });
        const documentId = response.data.id as string;
        callback(documentId);
      });
  };

  const { data, refetch, isPending } = useQuery({
    ...getRaidDocumentDocumentIdOptions({
      path: {
        document_id: documentId!,
      },
    }),
    enabled: documentId !== "" && documentId !== undefined,
  });

  const { mutate: mutateValidateDocument, isPending: isValidationLoading } =
    useMutation({
      ...postRaidDocumentDocumentIdValidateMutation(),
      onSuccess: () => {
        toast({
          title: "Succès",
          description: "Le document a été validé avec succès",
        });
        queryClient.invalidateQueries({ queryKey: ["document"] });
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la validation",
          description: "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
    });

  const setDocumentValidation = (
    documentId: string,
    validation: DocumentValidation,
    callback: () => void,
  ) => {
    mutateValidateDocument(
      {
        path: {
          document_id: documentId,
        },
        query: {
          validation: validation,
        },
      },
      { onSuccess: () => callback() },
    );
  };

  const getDocument = (userId: string, key: string) => {
    if (key === "" || key === undefined) return undefined;
    if (documents[userId!] === undefined) return undefined;
    return documents[userId!][key]?.file;
  };

  return {
    uploadDocument,
    getDocument,
    data: data as File,
    refetch,
    isLoading: isPending,
    setDocumentId,
    documentId,
    setDocumentValidation,
    isValidationLoading,
  };
};
