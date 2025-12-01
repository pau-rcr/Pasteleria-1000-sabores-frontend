import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/templates/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/atoms/Spinner";
import { formatCurrency } from "@/utils/formatters";
import { ArrowLeft, ShoppingCart, Minus, Plus, Package } from "lucide-react";
import { Product } from "@/models/product";
import { getProductById } from "@/services/productsService";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id, 10) : null;
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      setIsLoading(true);
      try {
        const data = await getProductById(productId);
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("No se pudo cargar el producto");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity, message || undefined);
      toast.success(`${product.name} agregado al carrito`);
      navigate("/carrito");
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-20 flex justify-center">
          <Spinner size={40} />
        </div>
      </MainLayout>
    );
  }

  if (error || !product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-2xl mx-auto p-12 text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">
              {error || "Producto no encontrado"}
            </h1>
            <Button onClick={() => navigate("/productos")}>
              Volver a Productos
            </Button>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/productos")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Productos
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image Placeholder */}
          <div className="aspect-square rounded-lg overflow-hidden bg-gradient-subtle flex items-center justify-center">
            <Package className="w-32 h-32 text-muted-foreground/30" />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-display text-primary mb-4">
                {product.name}
              </h1>
              
              <p className="text-muted-foreground text-lg leading-relaxed">
                {product.description || "Delicioso producto de nuestra pastelería"}
              </p>
            </div>

            <div className="text-4xl font-bold text-primary">
              {formatCurrency(product.price)}
            </div>

            <Card className="p-6 space-y-4 bg-muted/30">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Cantidad
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Mensaje para la torta (opcional)
                </label>
                <Textarea
                  placeholder="Ej: Feliz Cumpleaños María"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={50}
                  rows={2}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Máximo 50 caracteres
                </p>
              </div>

              <Button
                variant="hero"
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Agregar al Carrito
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
