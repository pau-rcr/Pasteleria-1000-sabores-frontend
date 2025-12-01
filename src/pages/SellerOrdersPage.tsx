import { useEffect, useState } from "react";
import { MainLayout } from "@/components/templates/MainLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/atoms/Spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Order, OrderStatus } from "@/models/order";
import { getAllOrders } from "@/services/ordersService";
import { formatCurrency } from "@/utils/discounts";
import { formatDateTime } from "@/utils/formatters";
import { Package, AlertCircle, ShoppingBag } from "lucide-react";

const getStatusBadge = (status: OrderStatus) => {
    const variants: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "destructive" }> = {
        PENDING: { label: "Pendiente", variant: "secondary" },
        PAID: { label: "Pagado", variant: "default" },
        CANCELED: { label: "Cancelado", variant: "destructive" },
    };

    const config = variants[status] || { label: status, variant: "default" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default function SellerOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadOrders = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getAllOrders();
                setOrders(data);
            } catch (err) {
                setError("Error al cargar los pedidos. Por favor intenta de nuevo.");
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
                            No hay pedidos pendientes
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Los pedidos asignados aparecerán aquí.
                        </p>
                    </Card>
                </div>
            </MainLayout>
        );
    }

    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = orders.filter(o => o.status === "PENDING").length;

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-display text-primary mb-8">
                        Mis Ventas
                    </h1>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <Card className="p-6">
                            <div className="flex items-center gap-3">
                                <Package className="h-8 w-8 text-primary" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Pedidos</p>
                                    <p className="text-2xl font-bold text-foreground">{orders.length}</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="h-8 w-8 text-orange-500" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Pendientes</p>
                                    <p className="text-2xl font-bold text-foreground">{pendingOrders}</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="h-8 w-8 text-green-600" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Ventas</p>
                                    <p className="text-2xl font-bold text-foreground">{formatCurrency(totalSales)}</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Orders List */}
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
