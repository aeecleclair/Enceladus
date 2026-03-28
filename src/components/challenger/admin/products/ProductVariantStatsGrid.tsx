import { useState } from "react";
import {
  AppModulesSportCompetitionSchemasSportCompetitionProductComplete,
  ProductVariantStats,
} from "@/src/api/hyperionSchemas";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  Plus,
  Euro,
  Users,
  MapPin,
  UserCheck,
  ShoppingCart,
  CheckCircle,
} from "lucide-react";
import { AddVariantDialog } from "./AddVariantDialog";
import { VariantOptionsMenu } from "./VariantOptionsMenu";

interface ProductVariantStatsGridProps {
  product: AppModulesSportCompetitionSchemasSportCompetitionProductComplete;
  variants: ProductVariantStats[];
}

export const ProductVariantStatsGrid = ({
  product,
  variants,
}: ProductVariantStatsGridProps) => {
  const [isAddVariantDialogOpen, setIsAddVariantDialogOpen] = useState(false);

  const getSchoolTypeLabel = (schoolType: string | null | undefined) => {
    if (!schoolType) return "Toutes écoles";
    const types: { [key: string]: string } = {
      centrale: "Centrale",
      from_lyon: "De Lyon",
      others: "Autres",
    };
    return types[schoolType] || schoolType;
  };

  const getPublicTypeLabel = (publicType: string | null | undefined) => {
    if (!publicType) return "Général";
    const types: { [key: string]: string } = {
      pompom: "Pompom",
      fanfare: "Fanfare",
      cameraman: "Cameraman",
      athlete: "Athlète",
    };
    return types[publicType] || publicType;
  };

  // Convert ProductVariantStats to the type expected by VariantOptionsMenu
  const convertToVariantComplete = (variant: ProductVariantStats) => ({
    product_id: variant.product_id,
    name: variant.name,
    description: variant.description,
    price: variant.price,
    enabled: variant.enabled,
    unique: variant.unique,
    school_type: variant.school_type,
    public_type: variant.public_type,
    edition_id: variant.edition_id,
    id: variant.id,
    product: product, // We have the product from props
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Add variant card */}
        <Card
          className="min-h-32 border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => setIsAddVariantDialogOpen(true)}
        >
          <CardContent className="flex flex-col items-center justify-center h-full p-4">
            <Plus className="h-8 w-8 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground text-center">
              Ajouter une variante
            </span>
          </CardContent>
        </Card>

        {/* Variant cards with stats */}
        {variants.map((variant) => (
          <Card
            key={variant.id}
            className={`min-h-32 transition-all hover:shadow-md ${
              variant.enabled ? "border-primary/20" : "border-muted opacity-60"
            }`}
          >
            <CardContent className="p-4 h-full flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-sm leading-tight">
                    {variant.name}
                  </h4>
                  <VariantOptionsMenu
                    variant={convertToVariantComplete(variant)}
                    productId={product.id}
                  />
                </div>

                {variant.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {variant.description}
                  </p>
                )}

                <div className="space-y-1">
                  <div className="flex items-center space-x-1 text-xs">
                    <Euro className="h-3 w-3" />
                    <span className="font-medium">
                      {(variant.price / 100).toFixed(2)}€
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{getSchoolTypeLabel(variant.school_type)}</span>
                  </div>

                  {variant.public_type && (
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <UserCheck className="h-3 w-3" />
                      <span>{getPublicTypeLabel(variant.public_type)}</span>
                    </div>
                  )}
                </div>

                {/* Stats section */}
                <div className="space-y-1 pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1 text-blue-600">
                      <ShoppingCart className="h-3 w-3" />
                      <span>Réservés</span>
                    </div>
                    <Badge variant="outline" className="text-xs bg-blue-50">
                      {variant.booked}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      <span>Payés</span>
                    </div>
                    <Badge variant="outline" className="text-xs bg-green-50">
                      {variant.paid}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mt-2">
                <Badge
                  variant={variant.enabled ? "default" : "secondary"}
                  className="text-xs"
                >
                  {variant.enabled ? "Actif" : "Inactif"}
                </Badge>

                {variant.unique && (
                  <Badge variant="outline" className="text-xs">
                    Unique
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state for variants */}
      {variants.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <div className="space-y-2">
            <Users className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">
              Aucune variante pour ce produit
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddVariantDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Créer la première variante
            </Button>
          </div>
        </div>
      )}

      {/* Add variant dialog */}
      <AddVariantDialog
        isOpen={isAddVariantDialogOpen}
        onClose={() => setIsAddVariantDialogOpen(false)}
        productId={product.id}
      />
    </div>
  );
};
