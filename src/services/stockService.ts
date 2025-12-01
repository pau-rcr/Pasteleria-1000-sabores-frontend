import { apiV1 } from "./apiClient";

export interface ReduceStockItem {
    productId: number;
    quantity: number;
}

export async function reduceStock(items: ReduceStockItem[]): Promise<void> {
    await apiV1.post("/products/reduce-stock", { items });
}
