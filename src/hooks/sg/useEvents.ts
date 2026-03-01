import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../useAuth";
import { useTranslations } from "next-intl";
import { getTicketingEventsOptions, postTicketingEventsMutation } from "@/api/@tanstack/react-query.gen";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AppModulesTicketingSchemasTicketingEventComplete } from "@/api/types.gen";

export const useEvents = () => {
    const { isTokenExpired } = useAuth();
    const { toast } = useToast();
    const t = useTranslations("sg");

    const { data, isLoading, refetch } = useQuery({
        ...getTicketingEventsOptions(),
        retry: 3,
        enabled: !isTokenExpired(),
    });


    const { mutate: mutatePostEvent, isPending: isPostEventLoading } = useMutation({
        ...postTicketingEventsMutation(),
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

    const postEvent = (event:AppModulesTicketingSchemasTicketingEventComplete,callback: () => void) => {
        mutatePostEvent(
        {body:event},
        { onSuccess: () => callback() }
        );
    };
    return {
        events: data || [],
        isLoading,
        refetch,
        postEvent,
        isPostEventLoading
    }
  }
