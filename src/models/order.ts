import { Product } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
  messageForCake?: string;
}

export interface OrderSummary {
  subtotal: number;
  discountByAge: number;
  discountByCode: number;
  birthdayBenefit: number;
  total: number;
}

export interface DiscountDetails {
  age50Plus: boolean;
  felices50: boolean;
  birthday: boolean;
  amountByAge: number;
  amountByCode: number;
  amountBirthday: number;
}

export type OrderStatus = "PENDING" | "PAID" | "DELIVERED" | "CANCELED";

// Backend response structure
export interface BackendOrderItem {
  id: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface BackendOrder {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: string;
  createdAt: string;
  items: BackendOrderItem[];
}

// Frontend order structure (adapted from backend)
export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  userId: number;
  userName?: string;
  userEmail?: string;
  items: OrderItem[];
  subtotal: number;
  discounts: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

// Payload for creating orders
export interface CreateOrderItemRequest {
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateOrderPayload {
  items: CreateOrderItemRequest[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
}
