"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Euro,
  CheckCircle,
  XCircle,
  Plus,
  ShoppingCart,
  Info,
  Target,
} from "lucide-react";
import { AppModulesSportCompetitionSchemasSportCompetitionProductComplete } from "@/src/api/hyperionSchemas";
import { ProductsQuotaDialog } from "./ProductsQuotaDialog";
import { ProductQuotaDataTable } from "./ProductQuotaDataTable";
import { DeleteConfirmationDialog } from "../sports/DeleteConfirmationDialog";
import { useProductsQuota } from "@/src/hooks/useProductsQuota";
import { useSchools } from "@/src/hooks/useSchools";
import { ProductQuotaFormValues } from "@/src/forms/productQuota";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { useState } from "react";

interface ProductDetailProps {
  product: AppModulesSportCompetitionSchemasSportCompetitionProductComplete;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddVariant?: () => void;
  onEditVariant?: (variantId: string) => void;
  onDeleteVariant?: (variantId: string) => void;
}

const ProductDetail = ({
  product,
  onEdit,
  onDelete,
  onAddVariant,
  onEditVariant,
  onDeleteVariant,
}: ProductDetailProps) => {
  const {
    productsQuota,
    isCreateLoading,
    createQuota,
    createQuotaForAllSchools,
    isUpdateLoading,
    updateQuota,
    isDeleteLoading,
    deleteQuota,
  } = useProductsQuota({
    productId: product.id,
  });

  const { schools } = useSchools();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [selectedSchoolForDelete, setSelectedSchoolForDelete] = useState<
    string | null
  >(null);

  const hasVariants = product.variants && product.variants.length > 0;
  const activeVariants =
    product.variants?.filter((variant) => variant.enabled !== false).length ||
    0;
  const totalVariants = product.variants?.length || 0;
  const isProductActive =
    product.required || (hasVariants && activeVariants > 0);

  const getSchoolTypeLabel = (schoolType: string | null | undefined) => {
    if (!schoolType) return "Toutes les écoles";
    switch (schoolType) {
      case "centrale":
        return "Centrale";
      case "from_lyon":
        return "De Lyon";
      case "others":
        return "Autres";
      default:
        return schoolType;
    }
  };

  const getPublicTypeLabel = (publicType: string | null | undefined) => {
    if (!publicType) return "Général";
    switch (publicType) {
      case "pompom":
        return "Pompom";
      case "fanfare":
        return "Fanfare";
      case "cameraman":
        return "Cameraman";
      case "athlete":
        return "Athlète";
      default:
        return publicType;
    }
  };

  const getSchoolTypeColor = (schoolType: string | null | undefined) => {
    if (!schoolType) return "bg-green-100 text-green-800 border-green-200";
    switch (schoolType) {
      case "centrale":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "from_lyon":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "others":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleEditQuota = (schoolId: string) => {
    const currentQuota = productsQuota?.find((q) => q.school_id === schoolId);
    if (currentQuota) {
      setSelectedSchool(schoolId);
      setIsAddDialogOpen(true);
    }
  };

  const existingQuota = productsQuota?.find(
    (q) => q.school_id === selectedSchool,
  );

  const handleQuotaSubmit = (values: ProductQuotaFormValues) => {
    if (!selectedSchool) return;

    if (existingQuota) {
      updateQuota(selectedSchool, values.quota || 0, () => {
        setIsAddDialogOpen(false);
        setSelectedSchool(null);
      });
    } else {
      createQuota(selectedSchool, values.quota || 0, () => {
        setIsAddDialogOpen(false);
        setSelectedSchool(null);
      });
    }
  };

  const handleQuotaSubmitAll = (values: ProductQuotaFormValues) => {
    if (!schools) return;

    // Only target schools that don't already have quotas
    const schoolIdsWithoutQuotas = schools
      .filter(
        (school) =>
          !productsQuota?.some((quota) => quota.school_id === school.id),
      )
      .map((school) => school.id);

    if (schoolIdsWithoutQuotas.length === 0) {
      // All schools already have quotas
      return;
    }

    createQuotaForAllSchools(schoolIdsWithoutQuotas, values.quota || 0, () => {
      setIsAddDialogOpen(false);
      setSelectedSchool(null);
    });
  };

  const handleDeleteQuota = () => {
    if (selectedSchoolForDelete) {
      deleteQuota(selectedSchoolForDelete, () => {
        setSelectedSchoolForDelete(null);
        setIsDeleteDialogOpen(false);
      });
    }
  };

  const getSchoolName = (schoolId: string) => {
    return (
      formatSchoolName(schools?.find((s) => s.id === schoolId)?.name) ||
      schoolId
    );
  };

  return (
    <div className="flex w-full flex-col space-y-6">
      {/* Header with breadcrumb-style navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-8 w-8 text-primary" />
            {product.name}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            {product.required && (
              <Badge
                variant="outline"
                className="gap-1 bg-orange-100 text-orange-800 border-orange-200"
              >
                <ShoppingCart className="h-3 w-3" />
                Obligatoire
              </Badge>
            )}
            <Badge
              variant={isProductActive ? "default" : "destructive"}
              className="gap-1"
            >
              {isProductActive ? (
                <CheckCircle className="h-3 w-3" />
              ) : (
                <XCircle className="h-3 w-3" />
              )}
              {isProductActive ? "Actif" : "Inactif"}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          {onEdit && (
            <Button variant="outline" onClick={onEdit} className="gap-2">
              <Edit className="h-4 w-4" />
              Modifier
            </Button>
          )}
          <Button variant="destructive" onClick={onDelete} className="gap-2">
            <Trash2 className="h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      {/* Product Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Quotas définis
                </p>
                <p className="text-2xl font-bold">
                  {productsQuota?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Informations du produit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Détails généraux</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Nom
                  </p>
                  <p className="text-sm">{product.name}</p>
                </div>
                {product.description && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Description
                    </p>
                    <p className="text-sm">{product.description}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Obligatoire
                  </p>
                  <p className="text-sm">{product.required ? "Oui" : "Non"}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Statistiques</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Variants
                  </p>
                  <p className="text-sm">
                    {activeVariants}/{totalVariants}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Prix minimum
                  </p>
                  <p className="text-sm">
                    {product.variants && product.variants.length > 0
                      ? `${(Math.min(...product.variants.map((v) => v.price)) / 100).toFixed(2)}€`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total réservés
                  </p>
                  <p className="text-sm">
                    {product.variants?.reduce(
                      (sum, v) => sum + (v.booked || 0),
                      0,
                    ) || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total payés
                  </p>
                  <p className="text-sm">
                    {product.variants?.reduce(
                      (sum, v) => sum + (v.paid || 0),
                      0,
                    ) || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quotas Management Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Quotas pour le produit {product.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Gérez les quotas de ce produit pour chaque école
              </p>
            </div>
            <ProductsQuotaDialog
              isOpen={isAddDialogOpen}
              onOpenChange={setIsAddDialogOpen}
              onSubmit={handleQuotaSubmit}
              onSubmitAll={handleQuotaSubmitAll}
              schools={schools}
              selectedSchool={selectedSchool}
              setSelectedSchool={setSelectedSchool}
              existingQuota={existingQuota}
              existingQuotas={productsQuota}
              title={
                selectedSchool &&
                productsQuota?.find((q) => q.school_id === selectedSchool)
                  ? "Modifier le quota de l'école"
                  : "Ajouter un quota pour une école"
              }
              description={`Définissez le quota pour cette école pour le produit ${product.name}.`}
              submitLabel={
                selectedSchool &&
                productsQuota?.find((q) => q.school_id === selectedSchool)
                  ? "Modifier"
                  : "Ajouter"
              }
              isLoading={isCreateLoading || isUpdateLoading}
            />
          </div>
        </CardHeader>

        <CardContent>
          {productsQuota && productsQuota.length > 0 ? (
            <ProductQuotaDataTable
              data={productsQuota.map((quota) => ({
                school_id: quota.school_id,
                schoolName: getSchoolName(quota.school_id),
                quota: quota.quota || 0,
                product_id: quota.product_id,
              }))}
              productName={product.name || ""}
              onEditQuota={handleEditQuota}
              onDeleteQuota={(schoolId) => {
                setSelectedSchoolForDelete(schoolId);
                setIsDeleteDialogOpen(true);
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-muted rounded-lg">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Aucun quota configuré pour {product.name}
              </h3>
              <p className="text-muted-foreground mb-4">
                Commencez par ajouter des quotas pour les écoles qui peuvent
                acheter ce produit
              </p>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Ajouter le premier quota
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Variants Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Variants ({totalVariants})
            </CardTitle>
            {onAddVariant && (
              <Button onClick={onAddVariant} className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un variant
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {hasVariants ? (
            <div className="space-y-4">
              {product.variants?.map((variant) => (
                <Card key={variant.id} className="border border-border">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{variant.name}</h4>
                          <Badge
                            variant={
                              variant.enabled !== false
                                ? "default"
                                : "destructive"
                            }
                            className="gap-1"
                          >
                            {variant.enabled !== false ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            {variant.enabled !== false ? "Actif" : "Inactif"}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`gap-1 ${getSchoolTypeColor(variant.school_type)}`}
                          >
                            {getSchoolTypeLabel(variant.school_type)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Prix</p>
                            <p className="font-medium">
                              {(variant.price / 100).toFixed(2)}€
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              Public cible
                            </p>
                            <p className="font-medium">
                              {getPublicTypeLabel(variant.public_type)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Unique</p>
                            <p className="font-medium">
                              {variant.unique ? "Oui" : "Non"}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-blue-600">
                              Réservés
                            </p>
                            <p className="font-medium text-blue-600">
                              {variant.booked || 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-green-600">
                              Payés
                            </p>
                            <p className="font-medium text-green-600">
                              {variant.paid || 0}
                            </p>
                          </div>
                        </div>
                        {variant.description && (
                          <div className="mt-2">
                            <p className="text-muted-foreground text-sm">
                              Description
                            </p>
                            <p className="text-sm">{variant.description}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        {onEditVariant && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEditVariant(variant.id)}
                            className="gap-1"
                          >
                            <Edit className="h-3 w-3" />
                            Modifier
                          </Button>
                        )}
                        {onDeleteVariant && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onDeleteVariant(variant.id)}
                            className="gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            Supprimer
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">Aucun variant</p>
              <p className="mb-4">
                Ce produit n&apos;a pas encore de variants configurés.
              </p>
              {onAddVariant && (
                <Button onClick={onAddVariant} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter le premier variant
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Supprimer le quota de l'école"
        description={`Êtes-vous sûr de vouloir supprimer le quota pour ${
          selectedSchoolForDelete ? getSchoolName(selectedSchoolForDelete) : ""
        } pour le produit ${product.name} ? Cette action est irréversible et supprimera toutes les restrictions d'achat pour cette école.`}
        onConfirm={handleDeleteQuota}
        onCancel={() => setSelectedSchoolForDelete(null)}
        isLoading={isDeleteLoading}
      />
    </div>
  );
};

export default ProductDetail;
