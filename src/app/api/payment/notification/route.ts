import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { getOrderByOrderId, updateOrder } from '@/services/order.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      transaction_id,
    } = body;

    if (!order_id || !status_code || !gross_amount || !signature_key || !transaction_status) {
      return NextResponse.json(
        { error: 'Bad Request. Payload tidak lengkap.' },
        { status: 400 },
      );
    }

    // 1. VERIFY SIGNATURE KEY (Security check)
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    const signPayload = order_id + status_code + gross_amount + serverKey;
    const computedHash = createHash('sha512').update(signPayload).digest('hex');

    if (computedHash !== signature_key) {
      console.error(`Forbidden signature key mismatch for Order ${order_id}`);
      return NextResponse.json(
        { error: 'Forbidden. Signature tidak valid.' },
        { status: 403 },
      );
    }

    console.log(`Signature key verified successfully for Order ${order_id}`);

    // 2. UPDATE FIRESTORE ORDER
    const orderDoc = await getOrderByOrderId(order_id);
    if (!orderDoc || !orderDoc.id) {
      console.warn(`Order document with Order ID ${order_id} not found in Firestore during notification.`);
      return NextResponse.json(
        { error: 'Order not found.' },
        { status: 404 },
      );
    }

    // Map system statuses: SUCCESS -> PAID (As prompt maps status: PAID, PENDING, FAILED, CANCELLED, EXPIRED)
    // First look at the order status mapping we'll set in Firestore:
    let finalPaymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'EXPIRED' = 'PENDING';
    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      finalPaymentStatus = 'PAID';
    } else if (transaction_status === 'pending') {
      finalPaymentStatus = 'PENDING';
    } else if (transaction_status === 'deny') {
      finalPaymentStatus = 'FAILED';
    } else if (transaction_status === 'cancel') {
      finalPaymentStatus = 'CANCELLED';
    } else if (transaction_status === 'expire') {
      finalPaymentStatus = 'EXPIRED';
    }

    console.log(`Updating order ${order_id} status to ${finalPaymentStatus}`);

    await updateOrder(orderDoc.id, {
      paymentStatus: finalPaymentStatus,
      transactionId: transaction_id || '',
      paymentMethod: 'MIDTRANS',
    });

    return NextResponse.json({ success: true, message: 'Status berhasil diperbarui.' });
  } catch (error) {
    console.error('Error handling Midtrans webhook notification:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 },
    );
  }
}
