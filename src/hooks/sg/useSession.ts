import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../useAuth";
import { useTranslations } from "next-intl";
import { getTicketingSessionsSessionIdOptions, patchTicketingSessionsSessionIdMutation, postTicketingEventsMutation, deleteTicketingSessionsSessionIdMutation } from "@/api/@tanstack/react-query.gen";
import { useMutation, useQuery } from "@tanstack/react-query";
import { EventUpdate } from "@/api/types.gen";

interface UseSessionProps {
  sessionId?: string;
}

export const useSession = ({ sessionId }: UseSessionProps) => {
    const { isTokenExpired } = useAuth();
    const { toast } = useToast();
    const t = useTranslations("sg");

    const { data, isLoading, refetch } = useQuery({
        ...getTicketingSessionsSessionIdOptions({
            path: {
                session_id: sessionId!,
            },
        }),
        retry: 3,
        enabled: !isTokenExpired(),
    });


    const { mutate: mutatePatchSession, isPending: isPatchSessionLoading } = useMutation({
        ...patchTicketingSessionsSessionIdMutation(),
        onSuccess: () => {
        toast({
            title: t("useSessions.patchSuccessTitle"),
            description: t("useSessions.patchSuccessDescription"),
        });
        },
        onError: (error) => {
        console.error(error);
        toast({
            title: t("useSessions.patchErrorTitle"),
            description: t("useSessions.patchErrorDescription"),
            variant: "destructive",
        });
        },
    })

    const patchSession = (sessionId:string, body:EventUpdate, callback: () => void) => {
        mutatePatchSession(
        {
            body,
            path: {
                session_id: sessionId,
            },
        },
        { onSuccess: () => callback() }
        );
    };

    const { mutate: mutateDeleteSession } = useMutation({
        ...deleteTicketingSessionsSessionIdMutation(),
        onSuccess: () => {
        toast({
            title: t("useSessions.deleteSuccessTitle"),
            description: t("useSessions.deleteSuccessDescription"),
        });
        },
        onError: (error) => {
        console.error(error);
        toast({
            title: t("useSessions.deleteErrorTitle"),
            description: t("useSessions.deleteErrorDescription"),
            variant: "destructive",
        });
        },
    })

    const deleteSession = (sessionId:string, callback: () => void) => {
        mutateDeleteSession(
        {
            path: {
                session_id: sessionId,
            },
        },
        { onSuccess: () => callback() }
        );
    };

    return {
        sessions: data || [],
        isLoading,
        refetch,
        patchSession,
        isPatchSessionLoading,
        deleteSession,
    }
  }
