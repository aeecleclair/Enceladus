"use client";

import { GetCompetitionProductsResponse } from "@/src/api/hyperionComponents";
import { AppModulesSportCompetitionSchemasSportCompetitionPurchaseComplete } from "@/src/api/hyperionSchemas";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import {
  ShoppingCart,
  CheckCircle,
  XCircle,
  Package,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { useMemo, useState } from "react";
import { AddPurchaseDialog } from "../purchases/AddPurchaseDialog";
import { EditPurchaseDialog } from "../purchases/EditPurchaseDialog";
import { DeletePurchaseDialog } from "../purchases/DeletePurchaseDialog";

interface UserPurchasesProps {
  userPurchases: AppModulesSportCompetitionSchemasSportCompetitionPurchaseComplete[];
  products: GetCompetitionProductsResponse;
  isAdmin?: boolean;
  isUserValidated?: boolean;
  userId?: string;
  onCreatePurchase?: (productVariantId: string, quantity: number) => void;
  isCreateLoading?: boolean;
  onEditPurchase?: (variantId: string, quantity: number) => void;
  isEditLoading?: boolean;
  onDeletePurchase?: (productVariantId: string) => void;
  isDeleteLoading?: boolean;
}

export const UserPurchases = ({
  userPurchases,
  products,
  isAdmin = false,
  isUserValidated = false,
  userId,
  onCreatePurchase,
  isCreateLoading = false,
  onEditPurchase,
  isEditLoading = false,
  onDeletePurchase,
  isDeleteLoading = false,
}: UserPurchasesProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] =
    useState<AppModulesSportCompetitionSchemasSportCompetitionPurchaseComplete | null>(
      null,
    );
  const [deletingPurchase, setDeletingPurchase] =
    useState<AppModulesSportCompetitionSchemasSportCompetitionPurchaseComplete | null>(
      null,
    );

  const totalAmount = useMemo(() => {
    return userPurchases.reduce(
      (sum, purchase) =>
        sum + purchase.product_variant.price * purchase.quantity,
      0,
    );
  }, [userPurchases]);

  const validatedAmount = useMemo(() => {
    return userPurchases
      .filter((p) => p.validated)
      .reduce(
        (sum, purchase) =>
          sum + purchase.product_variant.price * purchase.quantity,
        0,
      );
  }, [userPurchases]);

  const validatedCount = userPurchases.filter((p) => p.validated).length;

  const getProductRequiredStatus = (productVariantId: string) => {
    const product = products?.find((p) =>
      p.variants?.some((v) => v.id === productVariantId),
    );
    return product?.required || false;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Achats
              {userPurchases.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {userPurchases.length}
                </Badge>
              )}
            </CardTitle>
            {isAdmin && onCreatePurchase && (
              <Button
                size="sm"
                onClick={() => setIsAddDialogOpen(true)}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Ajouter un achat
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {userPurchases.length > 0 ? (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produit</TableHead>
                      <TableHead className="text-center">Quantité</TableHead>
                      <TableHead className="text-right">
                        Prix unitaire
                      </TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-center">Type</TableHead>
                      <TableHead className="text-center">Statut</TableHead>
                      {isAdmin && (
                        <TableHead className="text-center">Actions</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userPurchases.map((purchase) => {
                      const isRequired = getProductRequiredStatus(
                        purchase.product_variant_id,
                      );
                      const unitPrice = purchase.product_variant.price / 100;
                      const totalPrice =
                        (purchase.product_variant.price * purchase.quantity) /
                        100;

                      return (
                        <TableRow key={purchase.product_variant_id}>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <div className="font-medium">
                                {purchase.product_variant.name}
                              </div>
                              {purchase.product_variant.description && (
                                <div className="text-xs text-muted-foreground">
                                  {purchase.product_variant.description}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            <Badge variant="outline">{purchase.quantity}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {unitPrice.toFixed(2)} €
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {totalPrice.toFixed(2)} €
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant={isRequired ? "default" : "secondary"}
                              className={
                                isRequired
                                  ? "bg-orange-100 text-orange-800 hover:bg-orange-200"
                                  : ""
                              }
                            >
                              <Package className="h-3 w-3 mr-1" />
                              {isRequired ? "Requis" : "Optionnel"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {purchase.validated ? (
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-800 hover:bg-green-200 border-green-300"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Validé
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="bg-red-100 text-red-800 hover:bg-red-200 border-red-300"
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                En attente
                              </Badge>
                            )}
                          </TableCell>
                          {isAdmin && (
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                {onEditPurchase && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setEditingPurchase(purchase)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                )}
                                {onDeletePurchase && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                    onClick={() =>
                                      setDeletingPurchase(purchase)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-2">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">
                        Total des achats
                      </p>
                      <p className="text-2xl font-bold">
                        {(totalAmount / 100).toFixed(2)} €
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-2 border-green-200">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">
                        Montant validé
                      </p>
                      <p className="text-2xl font-bold text-green-700">
                        {(validatedAmount / 100).toFixed(2)} €
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-2">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">
                        Achats validés
                      </p>
                      <p className="text-2xl font-bold">
                        {validatedCount} / {userPurchases.length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 py-8 text-muted-foreground">
              <p>Aucun achat trouvé.</p>
              {isAdmin && onCreatePurchase && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddDialogOpen(true)}
                  className="gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter un achat
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {isAdmin && onCreatePurchase && (
        <AddPurchaseDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          products={products}
          isUserValidated={isUserValidated}
          onSubmit={(productVariantId, quantity) => {
            onCreatePurchase(productVariantId, quantity);
            setIsAddDialogOpen(false);
          }}
          isLoading={isCreateLoading}
        />
      )}

      {editingPurchase && onEditPurchase && (
        <EditPurchaseDialog
          isOpen={!!editingPurchase}
          onClose={() => setEditingPurchase(null)}
          purchase={editingPurchase}
          onSubmit={(variantId, quantity) => {
            onEditPurchase(variantId, quantity);
            setEditingPurchase(null);
          }}
          isLoading={isEditLoading}
        />
      )}

      {deletingPurchase && onDeletePurchase && (
        <DeletePurchaseDialog
          isOpen={!!deletingPurchase}
          onClose={() => setDeletingPurchase(null)}
          variantName={deletingPurchase.product_variant.name}
          onConfirm={() => {
            onDeletePurchase(deletingPurchase.product_variant_id);
            setDeletingPurchase(null);
          }}
          isLoading={isDeleteLoading}
        />
      )}
    </>
  );
};
