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


export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    image: string;
    address: {
        address: string;
        city: string;
        postalCode: string;
        state: string;
    }
}

export interface UsersApiResponse {
    users: User[];
    total: number;
    skip: number;
    limit: number;
}


