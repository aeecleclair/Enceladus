import { TagBase } from "@/api";
import { getPmfTagsOptions, postPmfTagsMutation } from "@/api/@tanstack/react-query.gen";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

export const useTags = () => {
  const { isTokenExpired } = useAuth();
  const t = useTranslations("pmf");
  const { toast } = useToast();
  const { data, isLoading, refetch } = useQuery({
    ...getPmfTagsOptions(),
    retry: 3,
    enabled: !isTokenExpired(),
  });

  const { mutate: mutatePostTag, isPending: isPostLoading } = useMutation({
    ...postPmfTagsMutation(),
    onSuccess: () => {
      toast({
        title: t("useTags.postSuccessTitle"),
        description: t("useTags.postSuccessDescription"),
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: t("useTags.postErrorTitle"),
        description: t("useTags.postErrorDescription"),
        variant: "destructive",
      });
    },
  });

  const postTag = (tag:TagBase,callback: () => void) => {
    mutatePostTag(
      {body:tag},
      { onSuccess: () => callback() }
    );
  };

  return {
    tags: data || [],
    isLoading,
    isPostLoading,
    postTag,
    refetch,
  };
};
