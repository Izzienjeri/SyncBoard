// types/product.types.ts (Updated for dummyjson API)

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number; // Note: this is a number, not an object
  stock: number;
  brand: string;
  category: string;
  thumbnail: string; // Main image field
  images: string[];
}

export type ProductFormData = Omit<Product, "id" | "rating" | "images" | "thumbnail" | "discountPercentage" | "stock" | "brand" | "category" >;
