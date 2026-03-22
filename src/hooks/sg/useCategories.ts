import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import { postTicketingCategoriesMutation } from "@/api/@tanstack/react-query.gen";
import { useMutation } from "@tanstack/react-query";
import { CategoryBase } from "@/api/types.gen";

export const useCategories = () => {
    const { toast } = useToast();
    const t = useTranslations("sg");


    const {
        mutate: mutatePostCategory,
        mutateAsync: mutatePostCategoryAsync,
        isPending: isPostCategoryLoading,
    } = useMutation({
        ...postTicketingCategoriesMutation(),
        onSuccess: () => {
        toast({
            title: t("useEvents.postSuccessTitle"),
            description: t("useEvents.postSuccessDescription"),
        });
        },
        onError: (error) => {
        console.error(error);
        toast({
            title: t("useEvents.postErrorTitle"),
            description: t("useEvents.postErrorDescription"),
            variant: "destructive",
        });
        },
    })

    const postCategory = (
        category: CategoryBase,
        callback: (response: unknown) => void
    ) => {
        mutatePostCategory(
        {body:category},
        { onSuccess: (response) => callback(response) }
        );
    };

    const postCategoryAsync = (category: CategoryBase) => {
        return mutatePostCategoryAsync({ body: category });
    };

    const refetch = async () => {
        return undefined;
    };

    return {
        events: [],
        isLoading: false,
        refetch,
        postCategory,
        postCategoryAsync,
        isPostCategoryLoading
    }
  }
