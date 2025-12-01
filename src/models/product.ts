export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

export interface ProductFilters {
  search?: string;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {}
