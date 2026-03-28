import { useState } from "react";
import { AppModulesSportCompetitionSchemasSportCompetitionProductVariantComplete } from "@/src/api/hyperionSchemas";
import { useProducts } from "@/src/hooks/useProducts";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { MoreVertical, Edit, Trash2, Play, Pause } from "lucide-react";
import { LoadingButton } from "@/src/components/custom/LoadingButton";
import { EditVariantDialog } from "./EditVariantDialog";

interface VariantOptionsMenuProps {
  variant: AppModulesSportCompetitionSchemasSportCompetitionProductVariantComplete;
  productId: string;
}

export const VariantOptionsMenu = ({
  variant,
  productId,
}: VariantOptionsMenuProps) => {
  const {
    deleteVariant,
    updateVariant,
    isDeleteVariantLoading,
    isUpdateVariantLoading,
  } = useProducts();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    deleteVariant(productId, variant.id, () => {
      setIsDeleteDialogOpen(false);
    });
  };

  const handleToggleEnabled = () => {
    updateVariant(variant.id, { enabled: !variant.enabled }, () => {});
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreVertical className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleToggleEnabled}
            disabled={isUpdateVariantLoading}
          >
            {variant.enabled ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Désactiver
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Activer
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <EditVariantDialog
        variant={variant}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer la variante</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer la variante &quot;
              {variant.name}&quot; ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleteVariantLoading}
            >
              Annuler
            </Button>
            <LoadingButton
              variant="destructive"
              onClick={handleDelete}
              isLoading={isDeleteVariantLoading}
            >
              Supprimer
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
