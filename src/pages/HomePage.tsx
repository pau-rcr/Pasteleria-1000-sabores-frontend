import { useEffect, useState } from "react";
import { MainLayout } from "@/components/templates/MainLayout";
import { HeroSection } from "@/components/organisms/HeroSection";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { BlogList } from "@/components/organisms/BlogList";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/models/product";
import { BlogPost } from "@/models/blog";
import { getProducts } from "@/services/productsService";
import { getBlogPosts } from "@/services/blogService";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Gift, Cake, Users, Sparkles } from "lucide-react";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const products = await getProducts();
        setFeaturedProducts(products.slice(0, 4));
      } catch (error) {
        console.error("Error loading featured products:", error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    const loadPosts = async () => {
      try {
        const posts = await getBlogPosts();
        setRecentPosts(posts.slice(0, 3));
      } catch (error) {
        console.error("Error loading blog posts:", error);
      } finally {
        setIsLoadingPosts(false);
      }
    };

    loadFeatured();
    loadPosts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast.success(`${product.name} agregado al carrito`);
  };

  return (
    <MainLayout>
      <HeroSection />

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              Beneficios Exclusivos
            </Badge>
            <h2 className="text-4xl md:text-5xl font-display text-primary mb-4">
              Programa de Beneficios
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Porque valoramos tu confianza, te ofrecemos descuentos especiales en cada compra.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="p-8 text-center hover:shadow-hover transition-smooth">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">50% Descuento</h3>
              <p className="text-muted-foreground mb-4">
                Para todos nuestros clientes mayores de 50 años
              </p>
              <Badge variant="secondary">Automático</Badge>
            </Card>

            <Card className="p-8 text-center hover:shadow-hover transition-smooth">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Código FELICES50</h3>
              <p className="text-muted-foreground mb-4">
                10% de descuento permanente al registrarte con este código
              </p>
              <Badge variant="secondary">De por vida</Badge>
            </Card>

            <Card className="p-8 text-center hover:shadow-hover transition-smooth">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Cake className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Estudiantes Duoc</h3>
              <p className="text-muted-foreground mb-4">
                ¡Torta gratis el día de tu cumpleaños!
              </p>
              <Badge variant="secondary">Cumpleaños</Badge>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-display text-primary mb-2">
                Productos Destacados
              </h2>
              <p className="text-muted-foreground">
                Nuestras creaciones más populares
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate("/productos")}>
              Ver Todos
            </Button>
          </div>
          <ProductGrid
            products={featuredProducts}
            isLoading={isLoadingProducts}
            onAddToCart={handleAddToCart}
          />
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-display text-primary mb-2">
                Últimas Noticias
              </h2>
              <p className="text-muted-foreground">
                Historias, recetas y novedades
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate("/blog")}>
              Ver Blog
            </Button>
          </div>
          <BlogList posts={recentPosts} isLoading={isLoadingPosts} limit={3} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="p-12 text-center bg-gradient-to-br from-primary/5 to-secondary/10 border-none shadow-card">
            <Users className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-display text-primary mb-4">
              Únete a Nuestra Familia
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Regístrate ahora y empieza a disfrutar de todos nuestros beneficios especiales.
            </p>
            <Button size="lg" variant="hero" onClick={() => navigate("/registro")}>
              Crear Cuenta Gratis
            </Button>
          </Card>
        </div>
      </section>
    </MainLayout>
  );
}
