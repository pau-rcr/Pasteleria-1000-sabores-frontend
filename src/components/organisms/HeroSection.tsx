import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Heart, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary/20 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <Badge variant="secondary" className="inline-flex items-center gap-2 px-4 py-2 text-sm">
            <Award className="h-4 w-4" />
            Récord Guinness 1995
          </Badge>

          {/* Heading */}
          <h1 className="font-display text-5xl md:text-7xl text-primary leading-tight">
            50 Años de
            <br />
            Tradición y Sabor
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Descubre nuestros pasteles artesanales elaborados con amor y los mejores
            ingredientes. Ahora con beneficios especiales para ti.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              variant="hero"
              className="text-lg px-8 py-6"
              onClick={() => navigate("/productos")}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Ver Catálogo de Tortas
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => {
                document.getElementById("benefits")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Heart className="mr-2 h-5 w-5" />
              Descubre tus Descuentos
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8">
            <div className="space-y-2">
              <p className="text-4xl font-bold text-primary">50+</p>
              <p className="text-sm text-muted-foreground">Años de Experiencia</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-primary">1000+</p>
              <p className="text-sm text-muted-foreground">Sabores Únicos</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-primary">50%</p>
              <p className="text-sm text-muted-foreground">Descuento Especial</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-secondary/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
    </section>
  );
}
