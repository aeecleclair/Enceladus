"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { LoadingButton } from "@/src/components/custom/LoadingButton";

interface DeletePurchaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  variantName: string;
  onConfirm: () => void;
  isLoading: boolean;
}

export const DeletePurchaseDialog = ({
  isOpen,
  onClose,
  variantName,
  onConfirm,
  isLoading,
}: DeletePurchaseDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer l&apos;achat</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer l&apos;achat{" "}
            <span className="font-semibold">{variantName}</span> ? Cette action
            est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <LoadingButton
            onClick={handleConfirm}
            variant="destructive"
            isLoading={isLoading}
          >
            Supprimer
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
