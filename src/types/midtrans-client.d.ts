declare module 'midtrans-client' {
  export class Snap {
    constructor(options: {
      isProduction: boolean;
      serverKey: string;
      clientKey: string;
    });

    createTransaction(parameter: {
      transaction_details: {
        order_id: string;
        gross_amount: number;
      };
      item_details?: Array<{
        id: string;
        price: number;
        quantity: number;
        name: string;
        category?: string;
        brand?: string;
        merchant_name?: string;
      }>;
      customer_details?: {
        first_name: string;
        last_name?: string;
        email: string;
        phone: string;
        billing_address?: {
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          address?: string;
          city?: string;
          postal_code?: string;
          country_code?: string;
        };
        shipping_address?: {
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          address?: string;
          city?: string;
          postal_code?: string;
          country_code?: string;
        };
      };
      expiry?: {
        start_time?: string;
        unit?: 'minute' | 'hour' | 'day';
        duration?: number;
      };
      callbacks?: {
        finish?: string;
      };
    }): Promise<{
      token: string;
      redirect_url: string;
    }>;
  }
}
