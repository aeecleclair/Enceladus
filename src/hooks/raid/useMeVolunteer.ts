import { RaidVolunteer, RaidVolunteerBase, RaidVolunteerEdit } from "@/api";
import { getRaidVolunteersMe } from "@/api/sdk.gen";
import {
  deleteRaidVolunteersUserIdMutation,
  getRaidVolunteersMeOptions,
  getRaidVolunteersMeQueryKey,
  patchRaidVolunteersUserIdCancelMutation,
  patchRaidVolunteersUserIdMutation,
  postRaidVolunteersMutation,
} from "@/api/@tanstack/react-query.gen";
import { useToast } from "@/components/ui/use-toast";
import { DetailedErrorType, ErrorType } from "@/lib/raid/errorTyping";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuth } from "../useAuth";
import { useMeUser } from "../useMeUser";
import { useHasRaidPermission } from "./useHasRaidPermission";

/**
 * Current user's volunteer record. Handles self-register, update, self-cancel, delete.
 */
export const useMeVolunteer = () => {
  const { isTokenExpired } = useAuth();
  const { user } = useMeUser();
  const { hasRaidAccess } = useHasRaidPermission();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: getRaidVolunteersMeQueryKey() });

  const {
    data: meVolunteer,
    isLoading,
    refetch: refetchMeVolunteer,
    error,
  } = useQuery({
    ...getRaidVolunteersMeOptions(),
    // Treat 404 as "not a volunteer" (null). 404 errors bypass staleTime and
    // refetch on every remount; with many observers on first paint this floods
    // the backend with hundreds of identical requests.
    queryFn: async ({ signal }) => {
      const { data, error, response } = await getRaidVolunteersMe({ signal });
      if (response.status === 404) return null as unknown as RaidVolunteer;
      if (error) throw error;
      return (data ?? null) as unknown as RaidVolunteer;
    },
    enabled: !isTokenExpired() && hasRaidAccess,
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
    ...postRaidVolunteersMutation(),
    onError: reportError("Erreur lors de la création du bénévole"),
    onSuccess: () => {
      toast({ title: "Inscription bénévole enregistrée" });
      invalidate();
    },
  });

  const { mutate: mutateUpdate, isPending: isUpdateLoading } = useMutation({
    ...patchRaidVolunteersUserIdMutation(),
    onError: reportError("Erreur lors de la mise à jour"),
    onSuccess: () => {
      toast({ title: "Profil bénévole mis à jour" });
      invalidate();
    },
  });

  const { mutate: mutateCancel, isPending: isCancelLoading } = useMutation({
    ...patchRaidVolunteersUserIdCancelMutation(),
    onError: reportError("Erreur lors de la désinscription"),
    onSuccess: () => {
      toast({ title: "Désinscription enregistrée" });
      invalidate();
    },
  });

  const { mutate: mutateDelete, isPending: isDeleteLoading } = useMutation({
    ...deleteRaidVolunteersUserIdMutation(),
    onError: reportError("Erreur lors de la suppression"),
    onSuccess: () => {
      toast({ title: "Inscription bénévole supprimée" });
      invalidate();
    },
  });

  const createMeVolunteer = (body: RaidVolunteerBase, callback?: () => void) =>
    mutateCreate({ body }, { onSuccess: () => callback?.() });

  const updateMeVolunteer = (
    body: RaidVolunteerEdit,
    callback?: () => void,
  ) => {
    if (!user?.id) return;
    mutateUpdate(
      { path: { user_id: user.id }, body },
      { onSuccess: () => callback?.() },
    );
  };

  const cancelMeVolunteer = (callback?: () => void) => {
    if (!user?.id) return;
    mutateCancel(
      { path: { user_id: user.id } },
      { onSuccess: () => callback?.() },
    );
  };

  const deleteMeVolunteer = (callback?: () => void) => {
    if (!user?.id) return;
    mutateDelete(
      { path: { user_id: user.id } },
      { onSuccess: () => callback?.() },
    );
  };

  return {
    meVolunteer,
    isLoading,
    error,
    refetchMeVolunteer,
    createMeVolunteer,
    isCreateLoading,
    updateMeVolunteer,
    isUpdateLoading,
    cancelMeVolunteer,
    isCancelLoading,
    deleteMeVolunteer,
    isDeleteLoading,
  };
};
