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


export interface Cart {
    id: number;
    products: {
        id: number;
        title: string;
        price: number;
        quantity: number;
        total: number;
        discountPercentage: number;
        discountedPrice: number;
        thumbnail: string;
    }[];
    total: number;
    discountedTotal: number;
    userId: number;
    totalProducts: number;
    totalQuantity: number;
}

export interface CartsApiResponse {
    carts: Cart[];
    total: number;
    skip: number;
    limit: number;
}
