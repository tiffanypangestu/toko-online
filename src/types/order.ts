export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id?: string; // Firestore document ID
  orderId: string; // Formatted ID: ORD-YYYYMMDD-XXXX
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  grandTotal: number;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'EXPIRED';
  paymentMethod: 'MIDTRANS';
  paymentToken: string;
  paymentUrl: string;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}
