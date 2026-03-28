import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { AppModulesSportCompetitionSchemasSportCompetitionProductComplete } from "@/src/api/hyperionSchemas";

interface ProductsCardProps {
  products: AppModulesSportCompetitionSchemasSportCompetitionProductComplete[];
}

export const ProductsCard = ({ products }: ProductsCardProps) => {
  if (!products || products.length === 0) {
    return null;
  }

  const getPriceInfo = (variants: (typeof products)[0]["variants"]) => {
    if (!variants || variants.length === 0) return null;

    const prices = variants.map((v) => v.price);
    const minPrice = Math.min(...prices) / 100;
    const maxPrice = Math.max(...prices) / 100;

    return {
      minPrice: minPrice.toFixed(2),
      maxPrice: maxPrice.toFixed(2),
      hasRange: minPrice !== maxPrice,
    };
  };

  const ProductItem = ({
    product,
  }: {
    product: AppModulesSportCompetitionSchemasSportCompetitionProductComplete;
  }) => {
    const priceInfo = getPriceInfo(product.variants);

    return (
      <div
        key={product.id}
        className="flex items-center justify-between border-b pb-2"
      >
        <div>
          <span className="font-medium">{product.name}</span>
          <p className="text-xs text-muted-foreground">
            {product.variants?.length || 0} variante(s)
          </p>
        </div>
        <div className="flex items-center gap-2">
          {product.required && <Badge variant="destructive">Obligatoire</Badge>}
          {priceInfo && (
            <Badge variant="outline">
              {priceInfo.minPrice}€
              {priceInfo.hasRange && ` - ${priceInfo.maxPrice}€`}
            </Badge>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Produits Disponibles</CardTitle>
        <CardDescription>
          Détails des {products.length} produits configurés
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {products.slice(0, 3).map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
          {products.length > 3 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="link" className="p-0 h-auto text-xs">
                  Voir {products.length - 3} de plus
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {products.slice(3).map((product) => (
                    <ProductItem key={product.id} product={product} />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
