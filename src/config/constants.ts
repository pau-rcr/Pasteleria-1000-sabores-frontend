export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  AUTH_USER: "authUser",
  CART_ITEMS: "cartItems",
} as const;

export const PROMO_CODES = {
  FELICES50: "FELICES50",
} as const;

export const DISCOUNT_PERCENTAGES = {
  AGE_50_PLUS: 0.5, // 50%
  FELICES50: 0.1,   // 10%
} as const;
