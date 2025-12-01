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
import { Package, AlertCircle, ShoppingBag, User, Mail } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const getStatusBadge = (status: OrderStatus) => {
    const variants: Record<OrderStatus, { label: string; variant: "default" | "secondary" | "destructive" }> = {
        PENDING: { label: "Pendiente", variant: "secondary" },
        PAID: { label: "Pagado", variant: "default" },
        CANCELED: { label: "Cancelado", variant: "destructive" },
    };

    const config = variants[status] || { label: status, variant: "default" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default function AdminOrdersPage() {
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
                            No hay pedidos aún
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Los pedidos de los clientes aparecerán aquí.
                        </p>
                    </Card>
                </div>
            </MainLayout>
        );
    }

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = orders.filter(o => o.status === "PENDING").length;

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-display text-primary mb-8">
                        Administración de Pedidos
                    </h1>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <Card className="p-6">
                            <div className="flex items-center gap-3">
                                <Package className="h-8 w-8 text-primary" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Pedidos</p>
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
                                    <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                                    <p className="text-2xl font-bold text-foreground">{formatCurrency(totalRevenue)}</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Orders Table */}
                    <Card className="overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Productos</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">#{order.id}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">{order.userName}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground">{order.userEmail}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {formatDateTime(order.createdAt)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx}>
                                                        {item.quantity}x {item.productName}
                                                    </div>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            {formatCurrency(order.total)}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}
