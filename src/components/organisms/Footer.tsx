import { Sparkles, Facebook, Instagram, Twitter } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="font-display text-2xl text-primary">1000 Sabores</span>
            </div>
            <p className="text-sm text-muted-foreground">
              50 años creando los mejores pasteles artesanales. Récord Guinness 1995.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-smooth"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-smooth"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-smooth"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Navegación</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigate("/")}
                  className="text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/productos")}
                  className="text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Productos
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/blog")}
                  className="text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/nosotros")}
                  className="text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Nosotros
                </button>
              </li>
            </ul>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="font-semibold mb-4">Beneficios</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>50% descuento mayores de 50</li>
              <li>10% código FELICES50</li>
              <li>Torta gratis estudiantes Duoc</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>contacto@1000sabores.cl</li>
              <li>+56 9 1234 5678</li>
              <li>
                <button
                  onClick={() => navigate("/contacto")}
                  className="text-primary hover:underline"
                >
                  Enviar mensaje
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} Pastelería 1000 Sabores. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
