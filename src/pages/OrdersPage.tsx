import { useEffect, useState } from "react";
import { MainLayout } from "@/components/templates/MainLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/atoms/Spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Order, OrderStatus } from "@/models/order";
import { getMyOrders } from "@/services/ordersService";
import { formatCurrency } from "@/utils/discounts";
import { formatDateTime } from "@/utils/formatters";
import { Package, AlertCircle, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const getStatusBadge = (status: OrderStatus) => {
  const variants: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "destructive" }> = {
    PENDING: { label: "Pendiente", variant: "secondary" },
    PAID: { label: "Pagado", variant: "default" },
    CANCELED: { label: "Cancelado", variant: "destructive" },
  };

  const config = variants[status] || { label: status, variant: "default" };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        setError("Error al cargar tus pedidos. Por favor intenta de nuevo.");
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (isLoading) {
    return (
        <MainLayout>
          <div className="container mx-auto px-4 py-20 flex justify-center">
            <Spinner size={40} />
          </div>
        </MainLayout>
    );
  }

  if (error) {
    return (
        <MainLayout>
          <div className="container mx-auto px-4 py-20">
            <Alert variant="destructive" className="max-w-2xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        </MainLayout>
    );
  }

  if (orders.length === 0) {
    return (
        <MainLayout>
          <div className="container mx-auto px-4 py-20">
            <Card className="max-w-2xl mx-auto p-12 text-center">
              <ShoppingBag className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
              <h1 className="text-3xl font-display text-foreground mb-4">
                Aún no tienes pedidos
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Explora nuestros deliciosos productos y realiza tu primer pedido.
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
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display text-primary mb-8">
              Mis Pedidos
            </h1>

            <div className="space-y-4">
              {orders.map((order) => (
                  <Card key={order.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Package className="h-6 w-6 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Pedido #{order.id}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDateTime(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.quantity}x {item.productName}
                      </span>
                            <span className="font-medium">
                        {formatCurrency(item.totalPrice)}
                      </span>
                          </div>
                      ))}
                    </div>

                    {order.discounts > 0 && (
                        <div className="border-t pt-3 mb-3">
                          <p className="text-xs text-muted-foreground">
                            Descuentos aplicados: -{formatCurrency(order.discounts)}
                          </p>
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-3 border-t">
                      <span className="font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-primary">
                    {formatCurrency(order.total)}
                  </span>
                    </div>
                  </Card>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
  );
}
