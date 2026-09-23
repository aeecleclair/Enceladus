import { useHasRaidPermission } from "./useHasRaidPermission";
import { useReportError } from "./useReportError";

import { RaidEditionBase, RaidEditionEdit } from "@/api";
import {
  deleteRaidEditionsEditionIdMutation,
  getRaidEditionsActiveQueryKey,
  getRaidEditionsOptions,
  getRaidEditionsQueryKey,
  patchRaidEditionsEditionIdMutation,
  postRaidEditionsMutation,
} from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { useToast } from "@/components/ui/use-toast";

/**
 * Admin-only: full CRUD for raid editions.
 */
export const useEditions = () => {
  const { isTokenExpired } = useAuth();
  const { isRaidAdmin } = useHasRaidPermission();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const reportError = useReportError();
  const t = useTranslations("raid.toast");

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getRaidEditionsQueryKey() });
    queryClient.invalidateQueries({
      queryKey: getRaidEditionsActiveQueryKey(),
    });
  };

  const {
    data: editions,
    isLoading,
    refetch: refetchEditions,
  } = useQuery({
    ...getRaidEditionsOptions(),
    enabled: !isTokenExpired() && isRaidAdmin,
    retry: false,
  });

  const { mutate: mutateCreate, isPending: isCreateLoading } = useMutation({
    ...postRaidEditionsMutation(),
    onError: reportError(t("editionCreateErrorTitle")),
    onSuccess: () => {
      toast({ title: t("editionCreated") });
      invalidate();
    },
  });

  const { mutate: mutateUpdate, isPending: isUpdateLoading } = useMutation({
    ...patchRaidEditionsEditionIdMutation(),
    onError: reportError(t("editionUpdateErrorTitle")),
    onSuccess: () => {
      toast({ title: t("editionUpdated") });
      invalidate();
    },
  });

  const { mutate: mutateToggleInscription, isPending: isToggleLoading } =
    useMutation({
      ...patchRaidEditionsEditionIdMutation(),
      onError: reportError(t("editionToggleErrorTitle")),
      onSuccess: (_data, variables) => {
        const enabled = variables.body.inscription_enabled === true;
        toast({
          title: enabled ? t("inscriptionsOpened") : t("inscriptionsClosed"),
          description: enabled
            ? t("inscriptionsOpenedDescription")
            : t("inscriptionsClosedDescription"),
        });
        invalidate();
      },
    });

  const { mutate: mutateDelete, isPending: isDeleteLoading } = useMutation({
    ...deleteRaidEditionsEditionIdMutation(),
    onError: reportError(t("editionDeleteErrorTitle")),
    onSuccess: () => {
      toast({ title: t("editionDeleted") });
      invalidate();
    },
  });

  const createEdition = (body: RaidEditionBase, callback?: () => void) =>
    mutateCreate({ body }, { onSuccess: () => callback?.() });

  const updateEdition = (
    editionId: string,
    body: RaidEditionEdit,
    callback?: () => void,
  ) =>
    mutateUpdate(
      { path: { edition_id: editionId }, body },
      { onSuccess: () => callback?.() },
    );

  const toggleInscription = (
    editionId: string,
    enabled: boolean,
    callback?: () => void,
  ) =>
    mutateToggleInscription(
      {
        path: { edition_id: editionId },
        body: { inscription_enabled: enabled },
      },
      { onSuccess: () => callback?.() },
    );

  const deleteEdition = (editionId: string, callback?: () => void) =>
    mutateDelete(
      { path: { edition_id: editionId } },
      { onSuccess: () => callback?.() },
    );

  const activateEdition = (editionId: string, callback?: () => void) =>
    updateEdition(editionId, { active: true }, callback);

  return {
    editions,
    isLoading,
    refetchEditions,
    createEdition,
    isCreateLoading,
    updateEdition,
    isUpdateLoading,
    toggleInscription,
    isToggleLoading,
    deleteEdition,
    isDeleteLoading,
    activateEdition,
  };
};
