import { UserRole } from "@/config/roles";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  dateOfBirth: string; // ISO string (YYYY-MM-DD)
  isDuocStudent: boolean;
  hasFelices50: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  dateOfBirth: string; // YYYY-MM-DD format
  isDuocStudent: boolean;
  code?: string; // promo code field name matches backend
}

export interface UpdateUserPayload {
  name?: string;
  dateOfBirth?: string;
  isDuocStudent?: boolean;
}
