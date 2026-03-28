import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/challenger/custom/LoadingButton";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function DeleteConfirmationDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  onConfirm,
  onCancel,
  isLoading,
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onCancel} variant="outline" disabled={isLoading}>
            Annuler
          </Button>
          <LoadingButton
            onClick={onConfirm}
            isLoading={isLoading}
            variant="destructive"
          >
            Supprimer
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
