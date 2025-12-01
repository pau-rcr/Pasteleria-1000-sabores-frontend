import api from "./apiClient";
import { BlogPost, CreateBlogPayload } from "@/models/blog";

export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data } = await api.get<BlogPost[]>("/blogs");
  return data;
}

export async function getBlogPostById(id: string): Promise<BlogPost> {
  const { data } = await api.get<BlogPost>(`/blogs/${id}`);
  return data;
}

export async function createBlogPost(payload: CreateBlogPayload): Promise<BlogPost> {
  const { data } = await api.post<BlogPost>("/blogs", payload);
  return data;
}
