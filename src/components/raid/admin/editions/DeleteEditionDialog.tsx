"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RaidEdition } from "@/api";
import { useEditions } from "@/hooks/raid/useEditions";

interface DeleteEditionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  edition: RaidEdition;
}

export const DeleteEditionDialog = ({
  open,
  onOpenChange,
  edition,
}: DeleteEditionDialogProps) => {
  const { deleteEdition, isDeleteLoading } = useEditions();

  const handleDelete = () => {
    deleteEdition(edition.id, () => onOpenChange(false));
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer l&apos;édition ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. L&apos;édition &laquo; {edition.name}
            &raquo; sera définitivement supprimée.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleteLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
