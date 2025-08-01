import type { AppUser } from "@/lib/schemas";

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface UsersApiResponse {
    users: AppUser[];
    total: number;
    skip: number;
    limit: number;
}
