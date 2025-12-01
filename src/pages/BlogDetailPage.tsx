import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/templates/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/atoms/Spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BlogPost } from "@/models/blog";
import { getBlogPostById } from "@/services/blogService";
import { formatDate } from "@/utils/formatters";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);
      try {
        const data = await getBlogPostById(id);
        setPost(data);
      } catch (err) {
        setError("Error al cargar la publicación. Por favor intenta de nuevo.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [id]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-20 flex justify-center">
          <Spinner size={40} />
        </div>
      </MainLayout>
    );
  }

  if (error || !post) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-20">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || "Publicación no encontrada"}</AlertDescription>
          </Alert>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/blog")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Blog
        </Button>

        <article className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <span className="text-sm text-muted-foreground">
                {formatDate(post.publishedAt)}
              </span>
              {post.tags && post.tags.length > 0 && (
                <>
                  <span className="text-muted-foreground">·</span>
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-primary mb-4">
              {post.title}
            </h1>
            <p className="text-xl text-muted-foreground">{post.excerpt}</p>
          </div>

          <div className="aspect-video mb-8 overflow-hidden rounded-lg bg-muted">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-lg max-w-none">
            <div
              className="text-foreground leading-relaxed whitespace-pre-line"
              style={{ wordBreak: "break-word" }}
            >
              {post.content}
            </div>
          </div>

          <div className="mt-12 pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              Publicado por <span className="font-medium text-foreground">{post.author}</span>
            </p>
          </div>
        </article>
      </div>
    </MainLayout>
  );
}
