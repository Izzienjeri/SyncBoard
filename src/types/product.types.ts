// types/product.types.ts

// Based on the structure from DummyJSON API
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
  
  // We can also define the shape for creating/updating a product.
  // Often, you don't need to provide an `id` or other read-only fields.
  export type ProductFormData = Omit<Product, 'id' | 'rating'>;