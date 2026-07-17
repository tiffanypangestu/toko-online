# Toko Online MVP

[![CI Pipeline](https://github.com/yourusername/yourrepo/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/yourrepo/actions/workflows/ci.yml)
[![Release & Deploy](https://github.com/yourusername/yourrepo/actions/workflows/release.yml/badge.svg)](https://github.com/yourusername/yourrepo/actions/workflows/release.yml)

Sebuah aplikasi E-Commerce (Toko Online) modern, responsive, dan production-ready yang dibangun menggunakan Next.js 15, React 19, TypeScript, dan Tailwind CSS v4. Aplikasi ini terintegrasi dengan Firebase Firestore, Firebase Storage, dan Midtrans Snap Sandbox.

---

## Fitur Utama

- **Home (Landing Page)**: Hero section menarik, keunggulan kompetitif, CTA, FAQ interaktif, dan produk pilihan.
- **Katalog Produk**: Pencarian dinamis (debounced search), filter kategori, sorting (harga, tanggal, stok), dan pagination.
- **Keranjang Belanja (Shopping Cart)**: Persistent state via local storage, validasi stok maks, diskon voucher (`HEMAT10`), dan hitung ongkir otomatis.
- **Checkout Page**: Validasi form dengan React Hook Form + Zod, mitigasi stok berlebih, dan generate Order ID unik.
- **Integrasi Midtrans Snap**: Pembayaran modern menggunakan QRIS Sandbox via popup/redirect dengan Webhook Callback + Signature Key check.
- **Admin Panel**: Login khusus, analytics dashboard, custom SVG charting, realtime order management, dan produk CRUD.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Library**: React 19
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Firebase Firestore
- **File Storage**: Firebase Storage
- **Payment Gateway**: Midtrans Snap API (Sandbox)
- **Form Management**: React Hook Form & Zod
- **Icons**: Lucide React
- **Notifications**: Sonner Toast

---

## Cara Install

Pastikan Node.js (v18+) terinstal di mesin Anda, lalu jalankan perintah berikut di folder proyek:

```bash
npm install
```

---

## Cara Menjalankan (Development)

Jalankan server pengembangan lokal:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat hasilnya.

---

## Cara Build (Production)

Buat bundle production yang dioptimasi:

```bash
npm run build
```

Jalankan server production lokal:

```bash
npm run start
```

---

## Konfigurasi Layanan

### 1. Firebase Firestore & Storage
1. Buat proyek baru di [Firebase Console](https://console.firebase.google.com/).
2. Aktifkan **Cloud Firestore** dan **Firebase Storage**.
3. Buat Web App pada setelan proyek untuk mendapatkan kredensial Firebase SDK.
4. Set Firestore Security Rules menggunakan file `firestore.rules` di root folder.
5. Set Storage Security Rules menggunakan file `storage.rules` di root folder.

### 2. Midtrans Sandbox
1. Daftar/masuk ke [Dashboard Midtrans](https://dashboard.midtrans.com/) (pilih mode **Sandbox**).
2. Salin **Server Key** dan **Client Key** dari menu *Settings > Access Keys*.
3. Atur **Notification URL** di menu *Settings > Configuration* mengarah ke:
   `https://[domain-anda].vercel.app/api/payment/notification`

---

## Variabel Lingkungan (Environment Variables)

Salin `.env.example` ke `.env.local` dan isi nilainya:

```ini
# Application Configuration
NEXT_PUBLIC_APP_NAME=OnlineShop
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Firebase SDK Setup
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Midtrans Configuration
MIDTRANS_SERVER_KEY=your_server_key
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_client_key
MIDTRANS_IS_PRODUCTION=false
```

---

## Backup & Export Firestore Database

Untuk mencadangkan atau melakukan ekspor data koleksi Firestore ke format JSON lokal:
1. Unduh file kunci akun layanan (Service Account Key) di *Firebase Console > Project Settings > Service accounts*.
2. Simpan file JSON tersebut di tempat yang aman.
3. Tambahkan environment variable:
   `export FIREBASE_SERVICE_ACCOUNT_PATH="/path/to/service-account.json"`
4. Jalankan script ekspor:
   ```bash
   node scripts/exportCollection.js
   ```
5. File ekspor akan disimpan di folder `backups/` di root proyek.

---

## Struktur Folder

```text
src/
├── app/                  # Route Pages (App Router)
│   ├── (shop)/           # Katalog, Landing Page, Keranjang, Checkout, Status
│   ├── admin/            # Dashboard Admin & CRUD Produk/Order
│   ├── api/              # API Route Handlers (Payment API & Webhook Notification)
│   ├── globals.css       # Global styles & Tailwind v4 Customizations
│   ├── layout.tsx        # Root layout wrapper
│   ├── robots.ts         # robots.txt dynamic generator
│   └── sitemap.ts        # sitemap.xml dynamic generator
├── components/           # Reusable Components (UI, cards, layouts)
├── context/              # React Context (CartContext)
├── firebase/             # Inisialisasi SDK Firebase (app, db, storage)
├── hooks/                # Custom React Hooks (useCart, useDebounce)
├── lib/                  # Library clients (Midtrans Snap)
├── services/             # Firebase Database Queries
├── types/                # TypeScript Interfaces (product, order, cart)
└── utils/                # Helper functions (format, slug generator)
```

---

## Alur Transaksi & Pembayaran

### 1. Checkout Flow
1. Pembeli mengisi form informasi data diri dan alamat di `/checkout`.
2. Validasi input form dilakukan oleh Zod & React Hook Form.
3. Kuantitas barang belanja dibandingkan dengan stok Firestore real-time.
4. Data pesanan disimpan ke Firestore pada collection `orders` dengan status awal `PENDING` dan Order ID berformat `ORD-YYYYMMDD-XXXX`.
5. Frontend memanggil Route Handler `/api/payment/create` untuk memproses Snap token transaksi.

### 2. Payment Flow
1. Route Handler `/api/payment/create` mengontak Midtrans API untuk membuat Snap Token, menyisipkan ongkir & diskon voucher sebagai line-items.
2. Token & Redirect URL yang diperoleh dari Midtrans di-update ke order Firestore.
3. Snap Popup/Iframe terpasang di client-side untuk memfasilitasi transaksi QRIS/Bank Transfer.
4. Setelah transaksi selesai, pembeli diarahkan ke halaman status `/payment/success` atau `/payment/pending`.
5. Midtrans mengirim Webhook Callback secara asinkron ke `/api/payment/notification`.
6. Webhook memverifikasi validitas `signature_key` dari Midtrans. Jika valid, update status order Firestore (`PAID`, `PENDING`, `FAILED`, `CANCELLED`, `EXPIRED`).
7. Keranjang belanja otomatis dikosongkan setelah status terkonfirmasi sukses (`PAID`).
