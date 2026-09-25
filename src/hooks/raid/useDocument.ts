import { DocumentType, DocumentValidation } from "@/api";
import {
  getRaidDocumentDocumentIdOptions,
  postRaidDocumentDocumentIdValidateMutation,
} from "@/api/@tanstack/react-query.gen";
import {
  getRaidDocumentDocumentId,
  postRaidDocumentDocumentType,
} from "@/api/sdk.gen";
import { useDocumentsStore } from "@/stores/raid/documents";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useToast } from "@/components/ui/use-toast";

export const useDocument = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { documents } = useDocumentsStore();
  const [documentId, setDocumentId] = useState<string>("");
  const t = useTranslations("raid.toast");

  const uploadDocument = (
    file: File,
    documentType: string,
    callback: (documentId: string) => void,
  ) => {
    postRaidDocumentDocumentType({
      body: { file },
      path: { document_type: documentType as DocumentType },
      throwOnError: true,
    })
      .then(({ data }) => {
        queryClient.invalidateQueries({
          predicate: (query) =>
            (query.queryKey[0] as { _id?: string } | undefined)?._id ===
            "getRaidDocumentDocumentId",
        });
        callback(data.id);
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: t("documentUploadErrorTitle"),
          description: t("updateErrorLaterDescription"),
          variant: "destructive",
        });
      });
  };

  const normalizeDocument = (value: unknown, id: string): File => {
    if (value instanceof Blob) {
      return new File([value], id, {
        type: value.type || "application/octet-stream",
      });
    }
    return value as File;
  };

  const fetchDocument = async (id: string): Promise<File> => {
    const { data } = await getRaidDocumentDocumentId({
      path: { document_id: id },
      throwOnError: true,
    });
    return normalizeDocument(data, id);
  };

  const { data, refetch, isPending } = useQuery({
    ...getRaidDocumentDocumentIdOptions({
      path: {
        document_id: documentId,
      },
    }),
    enabled: documentId !== "",
    select: (value) => normalizeDocument(value, documentId),
  });

  const { mutate: mutateValidateDocument, isPending: isValidationLoading } =
    useMutation({
      ...postRaidDocumentDocumentIdValidateMutation(),
      onSuccess: () => {
        toast({
          title: t("success"),
          description: t("documentValidated"),
        });
        queryClient.invalidateQueries({
          predicate: (query) =>
            (query.queryKey[0] as { _id?: string } | undefined)?._id ===
            "getRaidDocumentDocumentId",
        });
      },
      onError: (error) => {
        console.error(error);
        toast({
          title: t("validationErrorTitle"),
          description: t("updateErrorDescription"),
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
    fetchDocument,
    isLoading: isPending,
    setDocumentId,
    documentId,
    setDocumentValidation,
    isValidationLoading,
  };
};
