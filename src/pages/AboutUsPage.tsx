import { MainLayout } from "@/components/templates/MainLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Heart, Users, Sparkles } from "lucide-react";

export default function AboutUsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Nuestra Historia
          </Badge>
          <h1 className="text-4xl md:text-6xl font-display text-primary mb-6">
            50 Años de Tradición Familiar
          </h1>
          <p className="text-xl text-muted-foreground">
            Desde 1973, dedicados a crear momentos dulces e inolvidables para miles de familias.
          </p>
        </div>

        {/* Story */}
        <div className="max-w-3xl mx-auto mb-16 space-y-6 text-lg">
          <p className="leading-relaxed">
            La Pastelería 1000 Sabores nació del sueño de una familia apasionada por la repostería
            artesanal. Lo que comenzó como un pequeño taller en el corazón de Santiago, se ha
            convertido en una tradición que ha endulzado la vida de generaciones enteras.
          </p>
          <p className="leading-relaxed">
            En 1995, nuestra pastelería entró en el libro de los Récords Guinness al crear la torta
            de chocolate más grande de Latinoamérica, un logro que nos llena de orgullo y que
            representa nuestro compromiso con la excelencia y la innovación.
          </p>
          <p className="leading-relaxed">
            Hoy, después de 50 años, seguimos fieles a nuestros principios: ingredientes de la más
            alta calidad, recetas tradicionales perfeccionadas con amor, y un servicio cercano que
            hace que cada cliente se sienta parte de nuestra familia.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="p-6 text-center hover:shadow-hover transition-smooth">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">Pasión</h3>
            <p className="text-sm text-muted-foreground">
              Cada pastel es creado con amor y dedicación
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-hover transition-smooth">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">Calidad</h3>
            <p className="text-sm text-muted-foreground">
              Solo los mejores ingredientes naturales
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-hover transition-smooth">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">Familia</h3>
            <p className="text-sm text-muted-foreground">
              Tres generaciones de maestros pasteleros
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-hover transition-smooth">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">Excelencia</h3>
            <p className="text-sm text-muted-foreground">
              Récord Guinness y reconocimientos
            </p>
          </Card>
        </div>

        {/* Guinness Record */}
        <Card className="max-w-4xl mx-auto p-12 text-center bg-gradient-to-br from-primary/5 to-secondary/10 border-none shadow-card">
          <Award className="h-16 w-16 text-primary mx-auto mb-6" />
          <Badge variant="secondary" className="mb-4">
            1995
          </Badge>
          <h2 className="text-3xl font-display text-primary mb-4">
            Récord Guinness
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            La torta de chocolate más grande de Latinoamérica: 3,500 kg de pura delicia que
            alimentó a más de 10,000 personas en una celebración comunitaria inolvidable.
          </p>
        </Card>
      </div>
    </MainLayout>
  );
}
