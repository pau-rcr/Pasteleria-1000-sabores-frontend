import { useState } from "react";
import { MainLayout } from "@/components/templates/MainLayout";
import { CartItemRow } from "@/components/molecules/CartItemRow";
import { CartSummary } from "@/components/organisms/CartSummary";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { createOrder } from "@/services/ordersService";
import { toast } from "sonner";
import { ShoppingBag, ArrowLeft, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CartPage() {
  const { items, updateQuantity, updateMessage, removeItem, clearCart, getSummary } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const navigate = useNavigate();

  const summary = getSummary(user);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para realizar un pedido");
      navigate("/login");
      return;
    }

    setIsProcessing(true);
    try {
      const totalDiscounts = summary.discountByAge + summary.discountByCode + summary.birthdayBenefit;

      // Transform cart items to order items format
      const orderItems = items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.product.price,
        totalPrice: item.product.price * item.quantity,
      }));

      await createOrder({
        items: orderItems,
        totalAmount: summary.subtotal,
        discountAmount: totalDiscounts,
        finalAmount: summary.total,
      });

      clearCart();
      setOrderConfirmed(true);
      toast.success("¡Pedido realizado con éxito!");

      // Redirect to orders page after 2 seconds
      setTimeout(() => {
        navigate("/mis-pedidos");
      }, 2000);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Error al procesar el pedido. Por favor intenta de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderConfirmed) {
    return (
        <MainLayout>
          <div className="container mx-auto px-4 py-20">
            <Card className="max-w-2xl mx-auto p-12 text-center">
              <CheckCircle className="h-20 w-20 text-primary mx-auto mb-6" />
              <h1 className="text-3xl font-display text-primary mb-4">
                ¡Pedido Confirmado!
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Tu pedido ha sido recibido y está siendo procesado. Te enviaremos una confirmación por email.
              </p>
              <Button variant="hero" size="lg" onClick={() => navigate("/mis-pedidos")}>
                Ver Mis Pedidos
              </Button>
            </Card>
          </div>
        </MainLayout>
    );
  }

  if (items.length === 0) {
    return (
        <MainLayout>
          <div className="container mx-auto px-4 py-20">
            <Card className="max-w-2xl mx-auto p-12 text-center">
              <ShoppingBag className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
              <h1 className="text-3xl font-display text-foreground mb-4">
                Tu carrito está vacío
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Explora nuestros deliciosos productos y agrega algunos a tu carrito.
              </p>
              <Button variant="hero" size="lg" onClick={() => navigate("/productos")}>
                Ver Productos
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
            Seguir Comprando
          </Button>

          <h1 className="text-4xl md:text-5xl font-display text-primary mb-8">
            Carrito de Compras
          </h1>

          {!isAuthenticated && (
              <Alert className="mb-6">
                <AlertDescription>
                  <strong>Nota:</strong> Debes{" "}
                  <button
                      onClick={() => navigate("/login")}
                      className="text-primary underline font-medium"
                  >
                    iniciar sesión
                  </button>{" "}
                  para completar tu pedido y acceder a tus beneficios.
                </AlertDescription>
              </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                  Productos ({items.length})
                </h2>
                <div className="space-y-4">
                  {items.map((item) => (
                      <CartItemRow
                          key={item.product.id}
                          item={item}
                          onUpdateQuantity={updateQuantity}
                          onUpdateMessage={updateMessage}
                          onRemove={removeItem}
                      />
                  ))}
                </div>
              </Card>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <CartSummary
                  summary={summary}
                  onCheckout={handleCheckout}
                  isLoading={isProcessing}
              />
            </div>
          </div>
        </div>
      </MainLayout>
  );
}