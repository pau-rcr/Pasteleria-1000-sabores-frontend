import { useState, useEffect } from "react";
import { MainLayout } from "@/components/templates/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllOrders } from "@/services/ordersService";
import { Order } from "@/models/order";
import { Spinner } from "@/components/atoms/Spinner";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts";
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingBag, 
  Users, Package, Calendar, ArrowUpRight 
} from "lucide-react";
import { format, parseISO, startOfMonth, subMonths, isWithinInterval } from "date-fns";
import { es } from "date-fns/locale";

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(142, 76%, 36%)", "hsl(var(--destructive))"];

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate monthly sales data for the last 6 months
  const getMonthlyData = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(new Date(), i));
      const monthEnd = startOfMonth(subMonths(new Date(), i - 1));
      
      const monthOrders = orders.filter(order => {
        const orderDate = parseISO(order.createdAt);
        return isWithinInterval(orderDate, { start: monthStart, end: monthEnd });
      });

      const paidOrders = monthOrders.filter(o => o.status === "PAID" || o.status === "DELIVERED");
      const totalSales = paidOrders.reduce((sum, o) => sum + o.total, 0);
      const orderCount = monthOrders.length;

      months.push({
        name: format(monthStart, "MMM", { locale: es }),
        fullName: format(monthStart, "MMMM yyyy", { locale: es }),
        ventas: totalSales,
        pedidos: orderCount,
        promedio: orderCount > 0 ? totalSales / orderCount : 0,
      });
    }
    return months;
  };

  // Calculate status distribution
  const getStatusData = () => {
    const statusCounts = {
      PENDING: orders.filter(o => o.status === "PENDING").length,
      PAID: orders.filter(o => o.status === "PAID").length,
      DELIVERED: orders.filter(o => o.status === "DELIVERED").length,
      CANCELED: orders.filter(o => o.status === "CANCELED").length,
    };

    return [
      { name: "Pendientes", value: statusCounts.PENDING, color: "hsl(45, 93%, 47%)" },
      { name: "Pagados", value: statusCounts.PAID, color: "hsl(142, 76%, 36%)" },
      { name: "Entregados", value: statusCounts.DELIVERED, color: "hsl(217, 91%, 60%)" },
      { name: "Cancelados", value: statusCounts.CANCELED, color: "hsl(0, 84%, 60%)" },
    ].filter(item => item.value > 0);
  };

  // Calculate top products
  const getTopProducts = () => {
    const productMap = new Map<string, { name: string; quantity: number; revenue: number }>();
    
    orders.forEach(order => {
      if (order.status === "PAID" || order.status === "DELIVERED") {
        order.items.forEach(item => {
          const existing = productMap.get(item.productName) || { name: item.productName, quantity: 0, revenue: 0 };
          productMap.set(item.productName, {
            name: item.productName,
            quantity: existing.quantity + item.quantity,
            revenue: existing.revenue + item.totalPrice,
          });
        });
      }
    });

    return Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  // Calculate summary stats
  const getSummaryStats = () => {
    const paidOrders = orders.filter(o => o.status === "PAID" || o.status === "DELIVERED");
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
    const avgOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;
    
    // Compare with previous month
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    
    const thisMonthOrders = paidOrders.filter(o => parseISO(o.createdAt) >= thisMonthStart);
    const lastMonthOrders = paidOrders.filter(o => {
      const date = parseISO(o.createdAt);
      return date >= lastMonthStart && date < thisMonthStart;
    });

    const thisMonthRevenue = thisMonthOrders.reduce((sum, o) => sum + o.total, 0);
    const lastMonthRevenue = lastMonthOrders.reduce((sum, o) => sum + o.total, 0);
    
    const revenueGrowth = lastMonthRevenue > 0 
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;

    return {
      totalRevenue,
      totalOrders: orders.length,
      paidOrders: paidOrders.length,
      avgOrderValue,
      thisMonthRevenue,
      revenueGrowth,
    };
  };

  const monthlyData = getMonthlyData();
  const statusData = getStatusData();
  const topProducts = getTopProducts();
  const stats = getSummaryStats();

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner size={48} />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display text-foreground">Dashboard de Ventas</h1>
          <p className="text-muted-foreground mt-1">Análisis y métricas de tu negocio</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ingresos Totales
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${Math.round(stats.totalRevenue).toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {stats.revenueGrowth >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={stats.revenueGrowth >= 0 ? "text-green-500" : "text-red-500"}>
                  {stats.revenueGrowth.toFixed(1)}%
                </span>
                <span className="ml-1">vs mes anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pedidos Totales
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.paidOrders} pagados/entregados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Valor Promedio
              </CardTitle>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.avgOrderValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">por pedido</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Este Mes
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.thisMonthRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {format(new Date(), "MMMM yyyy", { locale: es })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Sales Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Ventas por Mes</CardTitle>
              <CardDescription>Ingresos de los últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toLocaleString()}`, "Ventas"]}
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--background))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Bar dataKey="ventas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Orders Trend Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Pedidos</CardTitle>
              <CardDescription>Cantidad de pedidos por mes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      formatter={(value: number) => [value, "Pedidos"]}
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--background))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="pedidos" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary)/0.2)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Estado de Pedidos</CardTitle>
              <CardDescription>Distribución por estado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [value, "Pedidos"]}
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--background))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Productos Más Vendidos</CardTitle>
              <CardDescription>Top 5 por ingresos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.length > 0 ? (
                  topProducts.map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="w-6 h-6 flex items-center justify-center p-0">
                          {index + 1}
                        </Badge>
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.quantity} unidades</p>
                        </div>
                      </div>
                      <span className="font-semibold text-primary">
                        ${product.revenue.toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No hay datos de ventas aún
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
