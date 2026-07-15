import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { getOrderByOrderId, updateOrder } from '@/services/order.service';
import { createAuditLog } from '@/services/audit.service';
import { isRateLimited } from '@/utils/rateLimit';
import * as z from 'zod';

// Define request validation schema using Zod
const notificationSchema = z.object({
  order_id: z.string().min(1),
  status_code: z.string().min(1),
  gross_amount: z.string().min(1),
  signature_key: z.string().min(1),
  transaction_status: z.string().min(1),
  transaction_id: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    // 1. Enforce Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown-ip';
    if (isRateLimited(ip, 30)) {
      console.warn(`Rate limit exceeded for IP: ${ip} on webhook endpoint.`);
      return NextResponse.json(
        { error: 'Terlalu banyak permintaan.' },
        { status: 429 },
      );
    }

    const rawBody = await request.json();

    // 2. Validate request payload using Zod
    const validationResult = notificationSchema.safeParse(rawBody);
    if (!validationResult.success) {
      const errorMsg = validationResult.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return NextResponse.json(
        { error: `Bad Request. Validasi gagal: ${errorMsg}` },
        { status: 400 },
      );
    }

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      transaction_id,
    } = validationResult.data;

    // 3. VERIFY SIGNATURE KEY (Security check)
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

    // 4. FETCH FIRESTORE ORDER
    const orderDoc = await getOrderByOrderId(order_id);
    if (!orderDoc || !orderDoc.id) {
      console.warn(`Order document with Order ID ${order_id} not found in Firestore during notification.`);
      return NextResponse.json(
        { error: 'Order tidak ditemukan.' },
        { status: 404 },
      );
    }

    // Map system statuses: SUCCESS -> PAID (As prompt maps status: PAID, PENDING, FAILED, CANCELLED, EXPIRED)
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

    // Write Webhook Audit Log
    await createAuditLog({
      action: 'WEBHOOK_RECEIVED',
      user: 'midtrans-system',
      ipAddress: ip,
      description: `Menerima status webhook untuk Order ${order_id}: ${transaction_status} (Sistem: ${finalPaymentStatus})`,
    });

    if (finalPaymentStatus === 'PAID') {
      await createAuditLog({
        action: 'ORDER_PAYMENT_SUCCESS',
        user: orderDoc.email,
        ipAddress: ip,
        description: `Pembayaran sukses terkonfirmasi untuk Order ID ${order_id} sebesar ${orderDoc.grandTotal}`,
      });
    } else if (finalPaymentStatus === 'FAILED' || finalPaymentStatus === 'EXPIRED' || finalPaymentStatus === 'CANCELLED') {
      await createAuditLog({
        action: 'ORDER_PAYMENT_FAILED',
        user: orderDoc.email,
        ipAddress: ip,
        description: `Pembayaran gagal/batal untuk Order ID ${order_id} (Status: ${finalPaymentStatus})`,
      });
    }

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
