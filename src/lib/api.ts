import { Product } from "@/types/product.types";
import { ProductSchema } from "@/validators/product.schema";

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

export async function createProduct(productData: ProductSchema): Promise<Product> {
  console.log("Simulating CREATE request with:", productData);
  try {
    const res = await fetch(`${API_BASE_URL}/products/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    if (!res.ok) {
      throw new Error("Failed to create product");
    }

    const newProduct: Product = await res.json();
    console.log("Simulated CREATE response:", newProduct);
    return newProduct;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Could not create the product.");
  }
}

export async function updateProduct(
  productId: number,
  productData: Partial<ProductSchema>
): Promise<Product> {
  console.log(`Simulating UPDATE request for ID ${productId} with:`, productData);
  try {
    const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    if (!res.ok) {
      throw new Error("Failed to update product");
    }
    
    const updatedProduct: Product = await res.json();
    console.log("Simulated UPDATE response:", updatedProduct);
    return updatedProduct;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Could not update the product.");
  }
}
