import midtransClient from 'midtrans-client';

// Safeguard server key check during build
const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '';
const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';

if (!serverKey && typeof window === 'undefined') {
  console.warn('WARNING: MIDTRANS_SERVER_KEY is not defined in env variables.');
}

export const snap = new midtransClient.Snap({
  isProduction,
  serverKey,
  clientKey,
});
