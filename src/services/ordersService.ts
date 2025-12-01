import api from "./apiClient";
import { Order, CreateOrderPayload, OrderStatus, BackendOrder } from "@/models/order";

function transformBackendOrder(backendOrder: BackendOrder): Order {
  return {
    id: backendOrder.id,
    userId: backendOrder.user.id,
    userName: backendOrder.user.name,
    userEmail: backendOrder.user.email,
    items: backendOrder.items.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.unitPrice,
      totalPrice: item.totalPrice,
    })),
    subtotal: backendOrder.totalAmount,
    discounts: backendOrder.discountAmount,
    total: backendOrder.finalAmount,
    status: backendOrder.status as OrderStatus,
    createdAt: backendOrder.createdAt,
  };
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const { data } = await api.post<BackendOrder>("/orders", payload);
  return transformBackendOrder(data);
}

export async function getMyOrders(): Promise<Order[]> {
  const { data } = await api.get<BackendOrder[]>("/orders/my");
  return data.map(transformBackendOrder);
}

export async function getAllOrders(): Promise<Order[]> {
  const { data } = await api.get<BackendOrder[]>("/orders");
  return data.map(transformBackendOrder);
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  const { data } = await api.patch<Order>(`/orders/${id}/status`, { status });
  return data;
}
