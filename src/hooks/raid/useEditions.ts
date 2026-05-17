import { RaidEditionBase, RaidEditionEdit } from "@/api";
import {
  deleteRaidEditionsEditionIdMutation,
  getRaidEditionsOptions,
  getRaidEditionsQueryKey,
  patchRaidEditionsEditionIdMutation,
  postRaidEditionsMutation,
} from "@/api/@tanstack/react-query.gen";
import { useToast } from "@/components/ui/use-toast";
import { DetailedErrorType, ErrorType } from "@/lib/raid/errorTyping";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuth } from "../useAuth";
import { useHasRaidPermission } from "./useHasRaidPermission";

/**
 * Admin-only: full CRUD for raid editions.
 */
export const useEditions = () => {
  const { isTokenExpired } = useAuth();
  const { isRaidAdmin } = useHasRaidPermission();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: getRaidEditionsQueryKey() });

  const {
    data: editions,
    isLoading,
    refetch: refetchEditions,
  } = useQuery({
    ...getRaidEditionsOptions(),
    enabled: !isTokenExpired() && isRaidAdmin,
    retry: false,
  });

  const reportError = (title: string) => (error: unknown) => {
    console.error(error);
    toast({
      title,
      description:
        (error as ErrorType)?.stack?.body ||
        (error as DetailedErrorType)?.stack?.detail ||
        "Une erreur est survenue, veuillez réessayer.",
      variant: "destructive",
    });
  };

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

  const { mutate: mutateDelete, isPending: isDeleteLoading } = useMutation({
    ...deleteRaidEditionsEditionIdMutation(),
    onError: reportError("Erreur lors de la suppression de l'édition"),
    onSuccess: () => {
      toast({ title: "Édition supprimée" });
      invalidate();
    },
  });

  const createEdition = (body: RaidEditionBase, callback?: () => void) =>
    mutateCreate(
      { body },
      { onSuccess: () => callback?.() },
    );

  const updateEdition = (
    editionId: string,
    body: RaidEditionEdit,
    callback?: () => void,
  ) =>
    mutateUpdate(
      { path: { edition_id: editionId }, body },
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
    deleteEdition,
    isDeleteLoading,
    activateEdition,
  };
};
