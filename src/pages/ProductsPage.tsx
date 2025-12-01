import { useEffect, useState } from "react";
import { MainLayout } from "@/components/templates/MainLayout";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product, ProductFilters } from "@/models/product";
import { getProducts } from "@/services/productsService";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
  });
  const { addItem } = useCart();

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProducts(filters);
      setProducts(data);
    } catch (err) {
      setError("Error al cargar los productos. Por favor intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast.success(`${product.name} agregado al carrito`);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-display text-primary mb-8">
          Nuestros Productos
        </h1>

        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="max-w-xs"
            />

            <Button
              variant="outline"
              onClick={() => setFilters({ search: "" })}
            >
              Limpiar búsqueda
            </Button>
          </div>
        </div>

        <ProductGrid
          products={products}
          isLoading={isLoading}
          error={error}
          onAddToCart={handleAddToCart}
        />
      </div>
    </MainLayout>
  );
}
