import { Product } from "@/models/product";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatters";
import { ShoppingCart, Package, AlertCircle } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onClick?: () => void;
}

export function ProductCard({ product, onAddToCart, onClick }: ProductCardProps) {
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
      <Card
          className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
          onClick={onClick}
      >
        <div className="relative aspect-square overflow-hidden bg-gradient-subtle flex items-center justify-center">
          <Package className="w-20 h-20 text-muted-foreground/30" />
          {isOutOfStock && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <Badge variant="destructive" className="text-sm py-1 px-3">
                  Sin Stock
                </Badge>
              </div>
          )}
        </div>

        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-display text-xl text-foreground mb-1">
              {product.name}
            </h3>
            {isLowStock && (
                <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-500">
                  <AlertCircle className="w-3 h-3" />
                  <span>Solo quedan {product.stock} unidades</span>
                </div>
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description || "Delicioso producto de pastelería"}
          </p>

          <div className="flex items-center justify-between pt-2">
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(product.price)}
          </span>

            {onAddToCart && (
                <Button
                    variant="hero"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    disabled={isOutOfStock}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {isOutOfStock ? "Sin Stock" : "Agregar"}
                </Button>
            )}
          </div>
        </div>
      </Card>
  );
}
