import { RaidEditionBase, RaidEditionEdit } from "@/api";
import {
  deleteRaidEditionsEditionIdMutation,
  getRaidEditionsActiveQueryKey,
  getRaidEditionsOptions,
  getRaidEditionsQueryKey,
  patchRaidEditionsEditionIdMutation,
  postRaidEditionsMutation,
} from "@/api/@tanstack/react-query.gen";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../useAuth";
import { useHasRaidPermission } from "./useHasRaidPermission";
import { useReportError } from "./useReportError";

/**
 * Admin-only: full CRUD for raid editions.
 */
export const useEditions = () => {
  const { isTokenExpired } = useAuth();
  const { isRaidAdmin } = useHasRaidPermission();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const reportError = useReportError();

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
    onError: reportError("Erreur lors de la création de l'édition"),
    onSuccess: () => {
      toast({ title: "Édition créée" });
      invalidate();
    },
  });

  const { mutate: mutateUpdate, isPending: isUpdateLoading } = useMutation({
    ...patchRaidEditionsEditionIdMutation(),
    onError: reportError("Erreur lors de la mise à jour de l'édition"),
    onSuccess: () => {
      toast({ title: "Édition mise à jour" });
      invalidate();
    },
  });

  const { mutate: mutateToggleInscription, isPending: isToggleLoading } =
    useMutation({
      ...patchRaidEditionsEditionIdMutation(),
      onError: reportError("Erreur lors de la mise à jour de l'inscription"),
      onSuccess: (_data, variables) => {
        const enabled = variables.body.inscription_enabled === true;
        toast({
          title: enabled ? "Inscriptions ouvertes" : "Inscriptions fermées",
          description: enabled
            ? "Les inscriptions à l'édition sont maintenant ouvertes."
            : "Les inscriptions à l'édition sont maintenant fermées.",
        });
        invalidate();
      },
    });

  const { mutate: mutateDelete, isPending: isDeleteLoading } = useMutation({
    ...deleteRaidEditionsEditionIdMutation(),
    onError: reportError("Erreur lors de la suppression de l'édition"),
    onSuccess: () => {
      toast({ title: "Édition supprimée" });
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
