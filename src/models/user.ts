import { UserRole } from "@/config/roles";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  dateOfBirth: string;
  isDuocStudent: boolean;
  hasFelices50: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  dateOfBirth: string; // YYYY-MM-DD format
  isDuocStudent: boolean;
  code?: string;
}

export interface UpdateUserPayload {
  name?: string;
  dateOfBirth?: string;
  isDuocStudent?: boolean;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  dateOfBirth: string;
  isDuocStudent: boolean;
  role: UserRole;
  code?: string;
}