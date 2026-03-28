import { useState } from "react";
import { AppModulesSportCompetitionSchemasSportCompetitionProductComplete } from "@/src/api/hyperionSchemas";
import { useProducts } from "@/src/hooks/useProducts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import {
  Search,
  Plus,
  Package,
  Settings,
  ChevronRight,
  Users,
  ShoppingCart,
  Eye,
} from "lucide-react";
import { ProductVariantStatsGrid } from "./ProductVariantStatsGrid";
import { AddProductDialog } from "./AddProductDialog";
import { ProductOptionsMenu } from "./ProductOptionsMenu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/src/components/ui/collapsible";

interface ProductListProps {
  products: AppModulesSportCompetitionSchemasSportCompetitionProductComplete[];
  onProductClick?: (productId: string) => void;
}

export const ProductList = ({ products, onProductClick }: ProductListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(
    new Set(),
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleProductExpansion = (productId: string) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedProducts(newExpanded);
  };

  const getProductStats = (
    product: AppModulesSportCompetitionSchemasSportCompetitionProductComplete,
  ) => {
    const totalVariants = product.variants?.length || 0;
    const enabledVariants =
      product.variants?.filter((v) => v.enabled).length || 0;

    const totalBooked =
      product.variants?.reduce((sum, v) => sum + (v.booked || 0), 0) || 0;
    const totalPaid =
      product.variants?.reduce((sum, v) => sum + (v.paid || 0), 0) || 0;

    return { totalVariants, enabledVariants, totalBooked, totalPaid };
  };

  return (
    <div className="space-y-6">
      {/* Header with search and add button */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des produits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un produit
        </Button>
      </div>

      {/* Products list */}
      <div className="space-y-4">
        {filteredProducts
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((product) => {
            const { totalVariants, enabledVariants, totalBooked, totalPaid } =
              getProductStats(product);
            const isExpanded = expandedProducts.has(product.id);

            return (
              <Card key={product.id} className="overflow-hidden">
                <Collapsible
                  open={isExpanded}
                  onOpenChange={() => toggleProductExpansion(product.id)}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <CardTitle className="text-lg">
                                {product.name}
                              </CardTitle>
                              <Badge
                                variant={
                                  enabledVariants > 0 ? "default" : "secondary"
                                }
                              >
                                {enabledVariants > 0 ? "Actif" : "Inactif"}
                              </Badge>
                              {product.required && (
                                <Badge className="ml-1">Obligatoire</Badge>
                              )}
                            </div>
                            {product.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {product.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          {/* Product stats */}
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Package className="h-4 w-4" />
                              <span>
                                {totalVariants} variante
                                {totalVariants !== 1 ? "s" : ""}
                              </span>
                            </div>
                            {totalBooked > 0 && (
                              <div className="flex items-center space-x-1">
                                <ShoppingCart className="h-4 w-4 text-blue-600" />
                                <span className="text-blue-600 font-medium">
                                  {totalBooked} réservé
                                  {totalBooked !== 1 ? "s" : ""}
                                </span>
                              </div>
                            )}
                            {totalPaid > 0 && (
                              <div className="flex items-center space-x-1">
                                <Users className="h-4 w-4 text-green-600" />
                                <span className="text-green-600 font-medium">
                                  {totalPaid} payé{totalPaid !== 1 ? "s" : ""}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2">
                            <ProductOptionsMenu
                              product={product}
                              onViewDetails={() => onProductClick?.(product.id)}
                            />
                            <ChevronRight
                              className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                            />
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-medium text-muted-foreground">
                            Variantes ({totalVariants})
                          </h4>
                          {enabledVariants !== totalVariants && (
                            <Badge variant="outline" className="text-xs">
                              {enabledVariants} actives
                            </Badge>
                          )}
                        </div>
                        <ProductVariantStatsGrid
                          product={product}
                          variants={product.variants || []}
                        />
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
      </div>

      {/* Empty state */}
      {filteredProducts.length === 0 && (
        <Card className="p-8">
          <div className="text-center space-y-4">
            <div className="p-4 bg-muted/50 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-medium">
                {searchTerm ? "Aucun produit trouvé" : "Aucun produit"}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Essayez de modifier votre recherche"
                  : "Commencez par créer votre premier produit"}
              </p>
            </div>
            {!searchTerm && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer un produit
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Add product dialog */}
      <AddProductDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />
    </div>
  );
};
