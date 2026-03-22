import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../useAuth";
import { useTranslations } from "next-intl";
import { getTicketingEventsEventIdSessionsOptions, postTicketingSessionsMutation } from "@/api/@tanstack/react-query.gen";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SessionBase } from "@/api/types.gen";

export const useSessions = (eventId?: string | null) => {
    const { isTokenExpired } = useAuth();
    const { toast } = useToast();
    const t = useTranslations("sg");

    const { data, isLoading, refetch } = useQuery({
        ...getTicketingEventsEventIdSessionsOptions({
            path: {
                event_id: eventId ?? "",
            },
        }),
        retry: 3,
        enabled: Boolean(eventId) && !isTokenExpired(),
    });


    const {
        mutate: mutatePostSession,
        mutateAsync: mutatePostSessionAsync,
        isPending: isPostSessionLoading,
    } = useMutation({
        ...postTicketingSessionsMutation(),
        onSuccess: () => {
        toast({
            title: t("useSessions.postSuccessTitle"),
            description: t("useSessions.postSuccessDescription"),
        });
        },
        onError: (error) => {
        console.error(error);
        toast({
            title: t("useSessions.postErrorTitle"),
            description: t("useSessions.postErrorDescription"),
            variant: "destructive",
        });
        },
    })

    const postSession = (session: SessionBase, callback: () => void) => {
        mutatePostSession(
        {body:session},
        { onSuccess: () => callback() }
        );
    };

    const postSessionAsync = (session: SessionBase) => {
        return mutatePostSessionAsync({ body: session });
    };
    return {
        sessions: data || [],
        isLoading,
        refetch,
        postSession,
        postSessionAsync,
        isPostSessionLoading
    }
  }
