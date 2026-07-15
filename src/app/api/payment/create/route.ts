import { NextResponse } from 'next/server';
import { snap } from '@/lib/payment/midtrans';
import { getOrderByOrderId, updateOrder } from '@/services/order.service';
import { createAuditLog } from '@/services/audit.service';
import { isRateLimited } from '@/utils/rateLimit';
import * as z from 'zod';

// Define request validation schema using Zod
const createPaymentSchema = z.object({
  orderId: z.string().min(1, { message: 'orderId wajib diisi' }),
  customer: z.object({
    name: z.string().min(3),
    email: z.string().email(),
    phone: z.string().min(10),
    address: z.string().min(15),
    city: z.string().min(1),
    province: z.string().min(1),
    postalCode: z.string().length(5),
  }),
  items: z.array(
    z.object({
      productId: z.string().min(1),
      name: z.string().min(1),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
      subtotal: z.number().positive(),
    })
  ).min(1),
  subtotal: z.number().nonnegative(),
  shipping: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  grandTotal: z.number().positive(),
});

export async function POST(request: Request) {
  try {
    // 1. Enforce Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown-ip';
    if (isRateLimited(ip, 10)) {
      console.warn(`Rate limit exceeded for IP: ${ip} on create transaction.`);
      return NextResponse.json(
        { error: 'Terlalu banyak permintaan. Silakan coba lagi setelah beberapa saat.' },
        { status: 429 },
      );
    }

    const rawBody = await request.json();
    
    // 2. Validate request payload using Zod schema
    const validationResult = createPaymentSchema.safeParse(rawBody);
    if (!validationResult.success) {
      const errorMsg = validationResult.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return NextResponse.json(
        { error: `Bad Request. Validasi gagal: ${errorMsg}` },
        { status: 400 },
      );
    }

    const { orderId, customer, items, shipping, discount, grandTotal } = validationResult.data;

    // Map items to Midtrans snap format
    const itemDetails = items.map((item) => ({
      id: item.productId,
      price: item.price,
      quantity: item.quantity,
      name: item.name.substring(0, 50),
    }));

    if (shipping > 0) {
      itemDetails.push({
        id: 'shipping-fee',
        price: shipping,
        quantity: 1,
        name: 'Ongkos Kirim',
      });
    }

    if (discount > 0) {
      itemDetails.push({
        id: 'discount-voucher',
        price: -discount,
        quantity: 1,
        name: 'Potongan Voucher',
      });
    }

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grandTotal,
      },
      item_details: itemDetails,
      customer_details: {
        first_name: customer.name,
        email: customer.email,
        phone: customer.phone,
        billing_address: {
          first_name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          postal_code: customer.postalCode,
          country_code: 'IDN',
        },
        shipping_address: {
          first_name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          postal_code: customer.postalCode,
          country_code: 'IDN',
        },
      },
    };

    console.log(`Requesting Midtrans Snap Token for Order: ${orderId}`);
    
    // Create Midtrans Transaction Snap Token
    const snapResponse = await snap.createTransaction(parameter);

    // Save tokens and urls into Firestore Order record
    const orderDoc = await getOrderByOrderId(orderId);
    if (orderDoc && orderDoc.id) {
      await updateOrder(orderDoc.id, {
        paymentToken: snapResponse.token,
        paymentUrl: snapResponse.redirect_url,
        paymentMethod: 'MIDTRANS',
      });

      // Write Audit Log
      await createAuditLog({
        action: 'ORDER_CHECKOUT',
        user: customer.email,
        ipAddress: ip,
        description: `Melakukan checkout order ${orderId} dengan total pembayaran ${grandTotal}`,
      });
    } else {
      console.warn(`Order document with Order ID ${orderId} was not found in Firestore.`);
    }

    return NextResponse.json({
      token: snapResponse.token,
      redirectUrl: snapResponse.redirect_url,
    });
  } catch (error) {
    console.error('Error creating Midtrans transaction:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 },
    );
  }
}
