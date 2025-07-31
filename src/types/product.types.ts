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
  
  // The shape for creating/updating a product.
  export type ProductFormData = Omit<Product, 'id' | 'rating'>;
