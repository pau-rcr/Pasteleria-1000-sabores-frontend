export type UserRole = "ADMIN" | "SELLER" | "CLIENT";

export const ROLES: Record<UserRole, string> = {
  ADMIN: "Administrador",
  SELLER: "Vendedor",
  CLIENT: "Cliente",
};
