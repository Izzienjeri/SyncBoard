
import { Product } from "@/types/product.types";

interface ProductsApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

const API_BASE_URL = "https://dummyjson.com";

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/products`);

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    const data: ProductsApiResponse = await res.json();
    return data.products;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Could not retrieve products. Please try again later.");
  }
}

