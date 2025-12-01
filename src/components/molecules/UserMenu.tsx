import { User } from "@/models/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User as UserIcon, Package, LogOut, Users, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROLES } from "@/config/roles";

interface UserMenuProps {
  user: User;
  onLogout: () => void;
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
  };

  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <p className="text-xs text-primary font-medium">{ROLES[user.role]}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {user.role === "CLIENT" && (
              <>
                <DropdownMenuItem onClick={() => navigate("/perfil")}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Mi Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/mis-pedidos")}>
                  <Package className="mr-2 h-4 w-4" />
                  Mis Pedidos
                </DropdownMenuItem>
              </>
          )}

          {user.role === "SELLER" && (
              <>
                <DropdownMenuItem onClick={() => navigate("/vendedor/productos")}>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Productos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/vendedor/pedidos")}>
                  <Package className="mr-2 h-4 w-4" />
                  Pedidos
                </DropdownMenuItem>
              </>
          )}

          {user.role === "ADMIN" && (
              <>
                <DropdownMenuItem onClick={() => navigate("/admin/usuarios")}>
                  <Users className="mr-2 h-4 w-4" />
                  Usuarios
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/admin/productos")}>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Productos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/admin/pedidos")}>
                  <Package className="mr-2 h-4 w-4" />
                  Pedidos
                </DropdownMenuItem>
              </>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={onLogout} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  );
}