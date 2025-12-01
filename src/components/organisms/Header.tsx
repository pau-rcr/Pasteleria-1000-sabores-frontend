import { useState } from "react";
import { NavItem } from "@/components/molecules/NavItem";
import { UserMenu } from "@/components/molecules/UserMenu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Menu, ShoppingCart, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const publicLinks = [
    { to: "/", label: "Inicio" },
    { to: "/productos", label: "Productos" },
    { to: "/blog", label: "Blog" },
    { to: "/nosotros", label: "Nosotros" },
    { to: "/contacto", label: "Contacto" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-display text-2xl text-primary">1000 Sabores</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {publicLinks.map((link) => (
              <NavItem key={link.to} to={link.to}>
                {link.label}
              </NavItem>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate("/carrito")}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {itemCount}
                </Badge>
              )}
            </Button>

            {isAuthenticated && user ? (
              <UserMenu user={user} onLogout={logout} />
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Ingresar
                </Button>
                <Button variant="default" onClick={() => navigate("/registro")}>
                  Registrarse
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {publicLinks.map((link) => (
                    <NavItem key={link.to} to={link.to} onClick={() => setMobileMenuOpen(false)}>
                      {link.label}
                    </NavItem>
                  ))}
                  {!isAuthenticated && (
                    <div className="flex flex-col gap-2 mt-4 sm:hidden">
                      <Button onClick={() => {
                        navigate("/login");
                        setMobileMenuOpen(false);
                      }}>
                        Ingresar
                      </Button>
                      <Button variant="outline" onClick={() => {
                        navigate("/registro");
                        setMobileMenuOpen(false);
                      }}>
                        Registrarse
                      </Button>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
