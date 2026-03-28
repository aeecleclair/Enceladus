import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { AlertTriangle } from "lucide-react";
import { LoadingButton } from "../../custom/LoadingButton";

interface CancelCompetitionUserDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  userName: string;
}

export const CancelCompetitionUserDialog = ({
  open,
  onClose,
  onConfirm,
  isLoading,
  userName,
}: CancelCompetitionUserDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Désinscrire le participant
          </DialogTitle>
          <DialogDescription>
            Vous êtes sur le point de désinscrire{" "}
            <span className="font-semibold">{userName}</span> de la compétition.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
          <p className="font-semibold mb-1">⚠️ Attention</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Le participant sera marqué comme annulé</li>
            <li>Son inscription sera désactivée</li>
            <li>Cette action peut être réversible via validation</li>
          </ul>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <LoadingButton
            variant="destructive"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            Désinscrire
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
