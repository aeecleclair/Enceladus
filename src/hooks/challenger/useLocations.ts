import { LocationBase, LocationEdit } from "@/api";
import {
  deleteCompetitionLocationsLocationIdMutation,
  getCompetitionLocationsOptions,
  patchCompetitionLocationsLocationIdMutation,
  postCompetitionLocationsMutation,
} from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";
import { DetailedErrorType, ErrorType } from "@/lib/challenger/errorTyping";

import { useMutation, useQuery } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const useLocations = () => {
  const { isTokenExpired } = useAuth();
  const { toast } = useToast();

  const {
    data: locations,
    isLoading,
    refetch: refetchLocations,
    error,
  } = useQuery({
    ...getCompetitionLocationsOptions(),
    enabled: !isTokenExpired(),
    retry: false,
    queryHash: "getLocations",
  });

  const { mutate: mutateCreateLocation, isPending: isCreateLoading } =
    useMutation({
      ...postCompetitionLocationsMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de l'ajout du lieu",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail ||
            "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
      onSuccess() {
        refetchLocations();
        toast({
          title: "Lieu ajouté",
          description: "Le lieu a été ajouté avec succès.",
        });
      },
    });

  const createLocation = (body: LocationBase, callback: () => void) => {
    return mutateCreateLocation(
      { body },
      {
        onSuccess: () => callback(),
      },
    );
  };

  const { mutate: mutateUpdateLocation, isPending: isUpdateLoading } =
    useMutation({
      ...patchCompetitionLocationsLocationIdMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la modification du lieu",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail ||
            "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
      onSuccess() {
        refetchLocations();
        toast({
          title: "Lieu modifié",
          description: "Le lieu a été modifié avec succès.",
        });
      },
    });

  const updateLocation = (
    locationId: string,
    body: LocationEdit,
    callback: () => void,
  ) => {
    return mutateUpdateLocation(
      {
        path: { location_id: locationId },
        body,
      },
      {
        onSuccess: () => callback(),
      },
    );
  };

  const { mutate: mutateDeleteLocation, isPending: isDeleteLoading } =
    useMutation({
      ...deleteCompetitionLocationsLocationIdMutation(),
      onError: (error) => {
        console.error(error);
        toast({
          title: "Erreur lors de la suppression du lieu",
          description:
            (error as unknown as ErrorType)?.stack?.body ||
            (error as unknown as DetailedErrorType)?.stack?.detail ||
            "Une erreur est survenue, veuillez réessayer.",
          variant: "destructive",
        });
      },
      onSuccess() {
        refetchLocations();
        toast({
          title: "Lieu supprimé",
          description: "Le lieu a été supprimé avec succès.",
        });
      },
    });

  const deleteLocation = (locationId: string, callback: () => void) => {
    return mutateDeleteLocation(
      {
        path: { location_id: locationId },
      },
      {
        onSuccess: () => callback(),
      },
    );
  };

  return {
    locations,
    createLocation,
    updateLocation,
    deleteLocation,
    error,
    isLoading,
    isCreateLoading,
    isUpdateLoading,
    isDeleteLoading,
    refetchLocations,
  };
};
