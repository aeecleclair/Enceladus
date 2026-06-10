"use client";

import { ProductQuotaDataTable } from "./ProductQuotaDataTable";
import { ProductQuotaDialog } from "./ProductQuotaDialog";

import { SchoolExtension, SchoolProductQuotaBase } from "@/api";
import { ProductQuotaFormValues } from "@/forms/challenger/productQuota";
import { useProducts } from "@/hooks/challenger/useProducts";
import { useSchoolsProductQuota } from "@/hooks/challenger/useSchoolsProductQuota";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Package, Plus } from "lucide-react";

interface ProductQuotaCardProps {
  school: SchoolExtension;
}

export const ProductQuotaCard = ({ school }: ProductQuotaCardProps) => {
  const {
    schoolsProductQuota,
    isCreateLoading,
    createQuota,
    isUpdateLoading,
    updateQuota,
  } = useSchoolsProductQuota({
    schoolId: school.school_id,
  });
  const { products } = useProducts();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const handleEditQuota = (productId: string) => {
    const currentQuota = schoolsProductQuota?.find(
      (q) => q.product_id === productId,
    );
    if (currentQuota) {
      setSelectedProduct(productId);
      setIsAddDialogOpen(true);
    }
  };
  const existingQuota = schoolsProductQuota?.find(
    (q) => q.product_id === selectedProduct,
  );

  const handleQuotaSubmit = (values: ProductQuotaFormValues) => {
    if (!selectedProduct) return;

    const quotaInfo: SchoolProductQuotaBase = {
      product_id: selectedProduct,
      quota: values.quota || 0,
    };

    if (existingQuota) {
      updateQuota(selectedProduct, quotaInfo, () => {
        setIsAddDialogOpen(false);
        setSelectedProduct(null);
      });
    } else {
      createQuota(quotaInfo, () => {
        setIsAddDialogOpen(false);
        setSelectedProduct(null);
      });
    }
  };

  const getProductName = (productId: string) => {
    return products?.find((s) => s.id === productId)?.name || productId;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Quotas par produit
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Gérez les quotas de participants et d&apos;équipes pour chaque
              produit
            </p>
          </div>
          <ProductQuotaDialog
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onSubmit={handleQuotaSubmit}
            products={products}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            existingQuota={existingQuota}
            title={
              selectedProduct &&
              schoolsProductQuota?.find((q) => q.product_id === selectedProduct)
                ? "Modifier le quota"
                : "Ajouter un quota"
            }
            description="Définissez le nombre de participants et d'équipes autorisés pour ce produit."
            submitLabel={
              selectedProduct &&
              schoolsProductQuota?.find((q) => q.product_id === selectedProduct)
                ? "Modifier"
                : "Ajouter"
            }
            isLoading={isCreateLoading || isUpdateLoading}
          />
        </div>
      </CardHeader>

      <CardContent>
        {schoolsProductQuota && schoolsProductQuota.length > 0 ? (
          <ProductQuotaDataTable
            data={schoolsProductQuota.map((quota) => ({
              product_id: quota.product_id,
              productName: getProductName(quota.product_id),
              quota: quota.quota || 0,
              school_id: quota.school_id,
            }))}
            onEditQuota={handleEditQuota}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-muted rounded-lg">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Aucun quota configuré
            </h3>
            <p className="text-muted-foreground mb-4">
              Commencez par ajouter des quotas pour les produits de cette école
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un quota
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
