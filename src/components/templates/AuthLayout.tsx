import { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Branding */}
      <div className="md:w-1/2 bg-gradient-to-br from-primary via-primary to-primary/80 p-8 md:p-12 flex flex-col justify-center items-center text-primary-foreground">
        <div className="max-w-md space-y-6 text-center">
          <div
            className="flex items-center justify-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <Sparkles className="h-10 w-10" />
            <span className="font-display text-4xl">1000 Sabores</span>
          </div>
          <h2 className="text-3xl font-bold">50 Años de Tradición</h2>
          <p className="text-lg opacity-90">
            Únete a nuestra familia y disfruta de beneficios exclusivos en cada compra.
          </p>
          <div className="grid grid-cols-1 gap-4 pt-8">
            <div className="bg-primary-foreground/10 rounded-lg p-4 backdrop-blur">
              <p className="font-semibold text-lg">50% de descuento</p>
              <p className="text-sm opacity-80">Para mayores de 50 años</p>
            </div>
            <div className="bg-primary-foreground/10 rounded-lg p-4 backdrop-blur">
              <p className="font-semibold text-lg">Código FELICES50</p>
              <p className="text-sm opacity-80">10% de descuento permanente</p>
            </div>
            <div className="bg-primary-foreground/10 rounded-lg p-4 backdrop-blur">
              <p className="font-semibold text-lg">Estudiantes Duoc</p>
              <p className="text-sm opacity-80">Torta gratis en tu cumpleaños</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="md:w-1/2 bg-background p-8 md:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">{children}</div>
      </div>
    </div>
  );
}
