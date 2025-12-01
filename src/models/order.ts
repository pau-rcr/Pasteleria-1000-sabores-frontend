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

export type OrderStatus = "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  messageForCake?: string;
}

export interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  subtotal: number;
  discounts: number;
  total: number;
  discountDetails: DiscountDetails;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  items: CartItem[];
  subtotal: number;
  discounts: number;
  total: number;
  discountDetails: DiscountDetails;
}
