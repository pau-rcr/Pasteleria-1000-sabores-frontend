export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  publishedAt: string;
  tags?: string[];
}

export interface CreateBlogPayload {
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  tags?: string[];
}
