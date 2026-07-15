export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  image: string;
  stock: number;
  quantity: number;
  subtotal: number;
  createdAt: string;
}
