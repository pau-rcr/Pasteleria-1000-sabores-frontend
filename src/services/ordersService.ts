import api from "./apiClient";
import { Order, CreateOrderPayload, OrderStatus } from "@/models/order";

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const { data } = await api.post<Order>("/orders", payload);
  return data;
}

export async function getMyOrders(): Promise<Order[]> {
  const { data } = await api.get<Order[]>("/orders/my");
  return data;
}

export async function getAllOrders(): Promise<Order[]> {
  const { data } = await api.get<Order[]>("/orders");
  return data;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  const { data } = await api.patch<Order>(`/orders/${id}/status`, { status });
  return data;
}
