"use client";

import { useProducts } from "@/src/hooks/useProducts";
import { ProductList } from "@/src/components/admin/products/ProductList";
import ProductDetail from "@/src/components/admin/products/ProductDetail";
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ProductsPage = () => {
  const router = useRouter();
  const { products } = useProducts();

  const searchParam = useSearchParams();
  const productId = searchParam.get("product_id");

  const product = products?.find((p) => p.id === productId);

  const handleBackToList = () => {
    router.push("/admin/products");
  };

  if (productId) {
    if (!product) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            <Button variant="outline" onClick={handleBackToList}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux produits
            </Button>
            <div className="text-center py-8">
              <p className="text-muted-foreground">Produit non trouvé</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <Button variant="outline" onClick={handleBackToList}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux produits
          </Button>
          <ProductDetail product={product} />
        </div>
      </div>
    );
  }

  if (!products) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with title and action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produits</h1>
          <p className="text-muted-foreground">
            Gestion des produits et leurs variantes
          </p>
        </div>
      </div>
      <ProductList
        products={products}
        onProductClick={(productId) => {
          router.push(`/admin/products?product_id=${productId}`);
        }}
      />
    </div>
  );
};

export default ProductsPage;
