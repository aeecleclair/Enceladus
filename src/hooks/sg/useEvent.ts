import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../useAuth";
import { useTranslations } from "next-intl";
import { getTicketingEventsEventIdOptions, patchTicketingEventsEventIdMutation, postTicketingEventsMutation } from "@/api/@tanstack/react-query.gen";
import { useMutation, useQuery } from "@tanstack/react-query";
import { EventUpdate } from "@/api/types.gen";

interface UseEventProps {
  eventId?: string;
}

export const useEvent = ({ eventId }: UseEventProps) => {
    const { isTokenExpired } = useAuth();
    const { toast } = useToast();
    const t = useTranslations("sg");

    const { data, isLoading, refetch } = useQuery({
        ...getTicketingEventsEventIdOptions({
            path: {
                event_id: eventId!,
            },
        }),
        retry: 3,
        enabled: !isTokenExpired(),
    });


    const { mutate: mutatePatchEvent, isPending: isPatchEventLoading } = useMutation({
        ...patchTicketingEventsEventIdMutation(),
        onSuccess: () => {
        toast({
            title: t("useEvents.patchSuccessTitle"),
            description: t("useEvents.patchSuccessDescription"),
        });
        },
        onError: (error) => {
        console.error(error);
        toast({
            title: t("useEvents.patchErrorTitle"),
            description: t("useEvents.patchErrorDescription"),
            variant: "destructive",
        });
        },
    })

    const patchEvent = (eventId:string, body:EventUpdate, callback: () => void) => {
        mutatePatchEvent(
        {
            body,
            path: {
                event_id: eventId,
            },
        },
        { onSuccess: () => callback() }
        );
    };
    return {
        events: data || [],
        isLoading,
        refetch,
        patchEvent,
        isPatchEventLoading
    }
  }
