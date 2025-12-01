import { Product } from "@/models/product";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatters";
import { ShoppingCart, Package } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onClick?: () => void;
}

export function ProductCard({ product, onAddToCart, onClick }: ProductCardProps) {
  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-subtle flex items-center justify-center">
        <Package className="w-20 h-20 text-muted-foreground/30" />
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-display text-xl text-foreground mb-1">
            {product.name}
          </h3>
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
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Agregar
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
