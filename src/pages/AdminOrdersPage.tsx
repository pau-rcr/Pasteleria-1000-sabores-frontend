import { useEffect, useState } from "react";
import { MainLayout } from "@/components/templates/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/atoms/Spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Order, OrderStatus } from "@/models/order";
import { getAllOrders, updateOrderStatus } from "@/services/ordersService";
import { formatCurrency } from "@/utils/discounts";
import { formatDateTime } from "@/utils/formatters";
import { toast } from "sonner";
import { 
    Package, 
    AlertCircle, 
    ShoppingBag, 
    User, 
    Mail, 
    CheckCircle, 
    Clock, 
    XCircle,
    DollarSign,
    Truck
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
        case "PENDING":
            return (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <Clock className="w-3 h-3 mr-1" />
                    Pendiente
                </Badge>
            );
        case "PAID":
            return (
                <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Pagado
                </Badge>
            );
        case "DELIVERED":
            return (
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                    <Truck className="w-3 h-3 mr-1" />
                    Entregado
                </Badge>
            );
        case "CANCELED":
            return (
                <Badge variant="destructive">
                    <XCircle className="w-3 h-3 mr-1" />
                    Cancelado
                </Badge>
            );
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [deliverDialogOpen, setDeliverDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [confirming, setConfirming] = useState(false);

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

    useEffect(() => {
        loadOrders();
    }, []);

    const handleConfirmClick = (order: Order) => {
        setSelectedOrder(order);
        setConfirmDialogOpen(true);
    };

    const handleDeliverClick = (order: Order) => {
        setSelectedOrder(order);
        setDeliverDialogOpen(true);
    };

    const handleConfirmOrder = async () => {
        if (!selectedOrder) return;

        try {
            setConfirming(true);
            await updateOrderStatus(String(selectedOrder.id), "PAID");
            toast.success(`Pedido #${selectedOrder.id} confirmado exitosamente`);
            setConfirmDialogOpen(false);
            setSelectedOrder(null);
            await loadOrders();
        } catch (err) {
            toast.error("Error al confirmar el pedido");
            console.error(err);
        } finally {
            setConfirming(false);
        }
    };

    const handleDeliverOrder = async () => {
        if (!selectedOrder) return;

        try {
            setConfirming(true);
            await updateOrderStatus(String(selectedOrder.id), "DELIVERED");
            toast.success(`Pedido #${selectedOrder.id} marcado como entregado`);
            setDeliverDialogOpen(false);
            setSelectedOrder(null);
            await loadOrders();
        } catch (err) {
            toast.error("Error al marcar como entregado");
            console.error(err);
        } finally {
            setConfirming(false);
        }
    };

    // Calculate statistics
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === "PENDING").length;
    const paidOrders = orders.filter(o => o.status === "PAID").length;
    const deliveredOrders = orders.filter(o => o.status === "DELIVERED").length;
    const canceledOrders = orders.filter(o => o.status === "CANCELED").length;
    const totalRevenue = orders
        .filter(o => o.status === "PAID" || o.status === "DELIVERED")
        .reduce((sum, o) => sum + o.total, 0);

    // Pie chart data
    const pieData = [
        { name: "Pendientes", value: pendingOrders, color: "hsl(45, 93%, 47%)" },
        { name: "Pagados", value: paidOrders, color: "hsl(142, 76%, 36%)" },
        { name: "Entregados", value: deliveredOrders, color: "hsl(217, 91%, 60%)" },
        { name: "Cancelados", value: canceledOrders, color: "hsl(0, 84%, 60%)" },
    ].filter(item => item.value > 0);

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

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-display text-primary mb-8">
                        Dashboard de Pedidos
                    </h1>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Total Pedidos
                                </CardTitle>
                                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalOrders}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Pendientes
                                </CardTitle>
                                <Clock className="h-4 w-4 text-yellow-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-600">{pendingOrders}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Confirmados
                                </CardTitle>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">{paidOrders}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Ingresos Totales
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-primary">
                                    {formatCurrency(totalRevenue)}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Pie Chart */}
                    {pieData.length > 0 && (
                        <Card className="mb-8">
                            <CardHeader>
                                <CardTitle className="text-center">Distribución de Estados</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                formatter={(value: number) => [`${value} pedidos`, "Cantidad"]}
                                            />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Orders Table */}
                    <Card className="overflow-hidden">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Listado de Pedidos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Cliente</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Productos</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead className="text-center">Acciones</TableHead>
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
                                                        <span className="text-xs text-muted-foreground">
                                                            {order.userEmail}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDateTime(order.createdAt)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm max-w-[200px]">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="truncate">
                                                            {item.quantity}x {item.productName}
                                                        </div>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                {formatCurrency(order.total)}
                                            </TableCell>
                                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                                            <TableCell className="text-center space-x-2">
                                                {order.status === "PENDING" && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleConfirmClick(order)}
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                        Confirmar
                                                    </Button>
                                                )}
                                                {order.status === "PAID" && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleDeliverClick(order)}
                                                        className="bg-blue-600 hover:bg-blue-700"
                                                    >
                                                        <Truck className="w-4 h-4 mr-1" />
                                                        Entregar
                                                    </Button>
                                                )}
                                                {order.status === "DELIVERED" && (
                                                    <span className="text-sm text-blue-600 font-medium">
                                                        Entregado
                                                    </span>
                                                )}
                                                {order.status === "CANCELED" && (
                                                    <span className="text-sm text-muted-foreground">
                                                        Cancelado
                                                    </span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Confirm Dialog */}
            <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar Pedido</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas confirmar el pedido #{selectedOrder?.id}?
                            Esta acción marcará el pedido como pagado.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="py-4 space-y-2">
                            <p className="text-sm">
                                <strong>Cliente:</strong> {selectedOrder.userName}
                            </p>
                            <p className="text-sm">
                                <strong>Total:</strong> {formatCurrency(selectedOrder.total)}
                            </p>
                            <p className="text-sm"><strong>Productos:</strong></p>
                            <ul className="text-sm ml-4 list-disc">
                                {selectedOrder.items.map((item, idx) => (
                                    <li key={idx}>
                                        {item.quantity}x {item.productName}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setConfirmDialogOpen(false)}
                            disabled={confirming}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleConfirmOrder}
                            disabled={confirming}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {confirming ? <Spinner className="w-4 h-4" /> : "Confirmar Pedido"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Deliver Dialog */}
            <Dialog open={deliverDialogOpen} onOpenChange={setDeliverDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Marcar como Entregado</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas marcar el pedido #{selectedOrder?.id} como entregado?
                        </DialogDescription>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="py-4 space-y-2">
                            <p className="text-sm">
                                <strong>Cliente:</strong> {selectedOrder.userName}
                            </p>
                            <p className="text-sm">
                                <strong>Total:</strong> {formatCurrency(selectedOrder.total)}
                            </p>
                            <p className="text-sm"><strong>Productos:</strong></p>
                            <ul className="text-sm ml-4 list-disc">
                                {selectedOrder.items.map((item, idx) => (
                                    <li key={idx}>
                                        {item.quantity}x {item.productName}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeliverDialogOpen(false)}
                            disabled={confirming}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleDeliverOrder}
                            disabled={confirming}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {confirming ? <Spinner className="w-4 h-4" /> : "Marcar Entregado"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </MainLayout>
    );
}