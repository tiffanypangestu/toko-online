import { NextResponse } from 'next/server';
import { snap } from '@/lib/payment/midtrans';
import { getOrderByOrderId, updateOrder } from '@/services/order.service';

interface CheckoutItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, customer, items, subtotal, shipping, discount, grandTotal } = body;

    // Validation
    if (
      !orderId ||
      !customer ||
      !items ||
      typeof subtotal === 'undefined' ||
      typeof shipping === 'undefined' ||
      typeof discount === 'undefined' ||
      typeof grandTotal === 'undefined'
    ) {
      return NextResponse.json(
        { error: 'Bad Request. Seluruh field wajib diisi.' },
        { status: 400 },
      );
    }

    const customerInfo = customer as CustomerInfo;
    const checkoutItems = items as CheckoutItem[];

    // Map checkout items to Midtrans snap payload format
    const itemDetails = checkoutItems.map((item) => ({
      id: item.productId,
      price: Number(item.price),
      quantity: Number(item.quantity),
      name: item.name.substring(0, 50), // Midtrans limits item name length to 50
    }));

    // Add shipping cost as a virtual item line
    if (Number(shipping) > 0) {
      itemDetails.push({
        id: 'shipping-fee',
        price: Number(shipping),
        quantity: 1,
        name: 'Ongkos Kirim',
      });
    }

    // Add voucher discount as a negative virtual item line
    if (Number(discount) > 0) {
      itemDetails.push({
        id: 'discount-voucher',
        price: -Number(discount),
        quantity: 1,
        name: 'Potongan Voucher',
      });
    }

    // Configure Midtrans Transaction payload
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: Number(grandTotal),
      },
      item_details: itemDetails,
      customer_details: {
        first_name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        billing_address: {
          first_name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: customerInfo.address,
          city: customerInfo.city,
          postal_code: customerInfo.postalCode,
          country_code: 'IDN',
        },
        shipping_address: {
          first_name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: customerInfo.address,
          city: customerInfo.city,
          postal_code: customerInfo.postalCode,
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
