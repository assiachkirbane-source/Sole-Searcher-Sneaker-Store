export interface Product {
  id: number;
  name: string;
  price: string;
  imageUrl: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
}
