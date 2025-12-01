import { useEffect, useState } from "react";
import { MainLayout } from "@/components/templates/MainLayout";
import { BlogList } from "@/components/organisms/BlogList";
import { BlogPost } from "@/models/blog";
import { getBlogPosts } from "@/services/blogService";

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getBlogPosts();
        setPosts(data);
      } catch (err) {
        setError("Error al cargar las publicaciones. Por favor intenta de nuevo.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mb-12">
          <h1 className="text-4xl md:text-5xl font-display text-primary mb-4">
            Nuestro Blog
          </h1>
          <p className="text-lg text-muted-foreground">
            Historias, recetas, consejos y las últimas novedades de nuestra pastelería
          </p>
        </div>

        <BlogList posts={posts} isLoading={isLoading} error={error} />
      </div>
    </MainLayout>
  );
}
