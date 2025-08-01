import { AppUser } from "@/lib/fake-generators";

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

// The old User interface is removed.
// All API responses will now use the AppUser discriminated union.
export interface UsersApiResponse {
    users: AppUser[];
    total: number;
    skip: number;
    limit: number;
}
