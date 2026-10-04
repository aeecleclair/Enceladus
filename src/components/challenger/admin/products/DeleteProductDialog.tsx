import { AppModulesSportCompetitionSchemasSportCompetitionProductComplete } from "@/api";
import { LoadingButton } from "@/components/common/LoadingButton";
import { useProducts } from "@/hooks/challenger/useProducts";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditProductDialogProps {
  product: AppModulesSportCompetitionSchemasSportCompetitionProductComplete;
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteProductDialog = ({
  product,
  isOpen,
  onClose,
}: EditProductDialogProps) => {
  const { deleteProduct, isDeleteLoading } = useProducts();

  async function handleDelete() {
    deleteProduct(product.id, () => {
      onClose();
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer le produit</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer le produit &quot;{product.name}
            &quot; ? Cette action supprimera également toutes les variantes
            associées et ne peut pas être annulée.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleteLoading}
          >
            Annuler
          </Button>
          <LoadingButton
            variant="destructive"
            onClick={handleDelete}
            isLoading={isDeleteLoading}
          >
            Supprimer
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
