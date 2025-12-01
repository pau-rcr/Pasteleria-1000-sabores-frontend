import { apiV1 } from "./apiClient";
import { Product, ProductFilters, CreateProductPayload, UpdateProductPayload } from "@/models/product";

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters?.search) params.append("search", filters.search);
  
  const queryString = params.toString();
  const { data } = await apiV1.get<Product[]>(`/products${queryString ? `?${queryString}` : ""}`);
  return data;
}

export async function getProductById(id: number): Promise<Product> {
  const { data } = await apiV1.get<Product>(`/products/${id}`);
  return data;
}

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  const { data } = await apiV1.post<Product>("/products", payload);
  return data;
}

export async function updateProduct(id: number, payload: UpdateProductPayload): Promise<Product> {
  const { data } = await apiV1.put<Product>(`/products/${id}`, payload);
  return data;
}

export async function deleteProduct(id: number): Promise<void> {
  await apiV1.delete(`/products/${id}`);
}
