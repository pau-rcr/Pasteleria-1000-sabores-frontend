import { BlogPost } from "@/models/blog";
import { BlogCard } from "@/components/molecules/BlogCard";
import { Spinner } from "@/components/atoms/Spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface BlogListProps {
  posts: BlogPost[];
  isLoading?: boolean;
  error?: string | null;
  limit?: number;
}

export function BlogList({ posts, isLoading, error, limit }: BlogListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg">No hay publicaciones disponibles.</p>
      </div>
    );
  }

  const displayedPosts = limit ? posts.slice(0, limit) : posts;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayedPosts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
