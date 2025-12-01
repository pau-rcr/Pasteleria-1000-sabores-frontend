import { BlogPost } from "@/models/blog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatters";
import { useNavigate } from "react-router-dom";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-hover transition-smooth group"
      onClick={() => navigate(`/blog/${post.id}`)}
    >
      <div className="aspect-video overflow-hidden bg-muted">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
        />
      </div>
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-xs text-muted-foreground">{formatDate(post.publishedAt)}</p>
          {post.tags && post.tags.length > 0 && (
            <>
              <span className="text-muted-foreground">·</span>
              {post.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </>
          )}
        </div>
        <h3 className="font-bold text-xl leading-tight line-clamp-2">{post.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
        <p className="text-sm text-primary font-medium">Leer más →</p>
      </div>
    </Card>
  );
}
