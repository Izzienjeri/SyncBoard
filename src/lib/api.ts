import { Product } from "@/types/product.types";
import { ProductSchema } from "@/validators/product.schema";

const API_BASE_URL = "https://fakestoreapi.com";

export async function getProducts(url: string): Promise<Product[]> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    const data: Product[] = await res.json();
    // Mock audit data since the API doesn't provide it
    return data.map((product) => ({
      ...product,
      createdAt: new Date(Date.now() - Math.random() * 1e10).toISOString(),
      createdBy: "Admin",
    }));
  } catch {
    throw new Error("Could not retrieve products. Please try again later.");
  }
}

export async function createProduct(
  productData: ProductSchema
): Promise<Product> {
  try {
    const payload = {
      ...productData,
      image: "https://i.pravatar.cc",
      category: "electronic",
    };
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Failed to create product");
    }

    const newProduct: Product = await res.json();
    // Add mocked audit data on creation
    return {
      ...newProduct,
      createdAt: new Date().toISOString(),
      createdBy: "System",
    };
  } catch {
    throw new Error("Could not create the product.");
  }
}

export async function updateProduct(
  productId: number,
  productData: Partial<ProductSchema>
): Promise<Product> {
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
    // Add mocked audit data on update
    return {
      ...updatedProduct,
      ...productData, // The API returns the old object, so we merge the new data
      updatedAt: new Date().toISOString(),
      updatedBy: "System",
    };
  } catch {
    throw new Error("Could not update the product.");
  }
}

export async function deleteProduct(productId: number): Promise<Product> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete product");
    }

    const deletedProduct: Product = await res.json();
    return deletedProduct;
  } catch {
    throw new Error("Could not delete the product.");
  }
}
