import { createProduct, getProducts } from './product.service';
import { generateSlug } from '@/utils/generateSlug';

const seedData = [
  {
    name: 'Laptop Gaming ASUS ROG',
    category: 'Laptop',
    price: 18500000,
    stock: 15,
    description: 'Laptop gaming kelas berat ASUS ROG Strix G15.\n\nSpesifikasi Utama:\n- Prosesor: Intel Core i7-12700H (14-Core, up to 4.7GHz)\n- Grafis: NVIDIA GeForce RTX 3060 6GB GDDR6\n- Memori: 16GB DDR5 4800MHz Dual Channel\n- Penyimpanan: 512GB M.2 NVMe PCIe 4.0 SSD\n- Layar: 15.6-inch FHD (1920 x 1080) IPS, 144Hz, Adaptive-Sync\n- Konektivitas: Wi-Fi 6E, Bluetooth 5.2, Gigabit Ethernet\n- Sistem Operasi: Windows 11 Home asli\n- Garansi Resmi ASUS Indonesia 2 Tahun.',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80',
  },
  {
    name: 'Mechanical Keyboard RGB',
    category: 'Keyboard',
    price: 850000,
    stock: 40,
    description: 'Mechanical Keyboard RGB berkinerja tinggi dengan tata letak tenkeyless (TKL) 80% yang ringkas.\n\nFitur Utama:\n- Switch: Outemu Red Linear Switch (ringan dan senyap, cocok untuk gaming & mengetik)\n- Layout: 87 tombol standar dengan keycap ABS double-shot\n- Backlight: RGB Backlit dinamis dengan 18 mode pencahayaan preset\n- Durabilitas: Masa pakai switch hingga 50 juta kali ketukan\n- Konektor: Kabel USB Type-C braided 1.8 meter berlapis emas\n- Fitur Tambahan: Full anti-ghosting (N-key rollover) dan kompatibilitas universal (Windows/Mac).',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80',
  },
  {
    name: 'Wireless Mouse Logitech',
    category: 'Mouse',
    price: 350000,
    stock: 55,
    description: 'Wireless Mouse Logitech Signature M650 dengan teknologi SmartWheel.\n\nSpesifikasi & Fitur:\n- Koneksi: Bluetooth Low Energy (BLE) & USB Logi Bolt Receiver (jangkauan hingga 10 meter)\n- Scroll: SmartWheel scroll untuk akurasi baris-demi-baris atau scroll super cepat otomatis\n- Desain: Bentuk ergonomis berkontur dengan pegangan karet samping yang lembut\n- Klik Sunyi: Teknologi SilentTouch mengurangi 90% suara klik tanpa mengurangi sensasi klik\n- Baterai: 1x Baterai AA tahan hingga 24 bulan (Bluetooth)\n- Kompatibilitas: Windows, macOS, Linux, ChromeOS, iPadOS, Android.',
    image: 'https://images.unsplash.com/photo-1527814050087-179f376dd0e7?w=800&q=80',
  },
  {
    name: 'Gaming Headset HyperX',
    category: 'Headset',
    price: 1250000,
    stock: 20,
    description: 'Gaming Headset HyperX Cloud II - Headset Gaming Legendaris dengan Virtual 7.1 Surround Sound.\n\nFitur & Spesifikasi:\n- Audio: Driver dinamis 53mm khusus dengan magnet neodymium\n- Sound Card: Kotak kontrol audio USB premium dengan DSP bawaan untuk virtual 7.1 surround sound\n- Mikrofon: Detachable (bisa dilepas-pasang) dengan fitur noise-cancelling pasif\n- Kenyamanan: Pad busa memori (memory foam) berlapis kulit imitasi premium dan kerangka aluminium kokoh\n- Frekuensi Respon: 15Hz - 25kHz\n- Koneksi: Kabel jack 3.5mm (1m) + dongle USB kontrol suara (2m)\n- Kompatibilitas: PC, Mac, PS4, PS5, Xbox One, Xbox Series X|S, Nintendo Switch, dan perangkat seluler.',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
  },
];

/**
 * Checks if the products collection is empty, and if so, seeds it with 4 default products.
 */
export async function seedProductsIfEmpty(): Promise<boolean> {
  try {
    const existing = await getProducts();
    if (existing.length > 0) {
      console.log('Firestore products collection is not empty, skipping seeding.');
      return false;
    }

    console.log('Firestore products collection is empty. Seeding initial data...');
    const now = new Date().toISOString();

    for (const item of seedData) {
      const slug = generateSlug(item.name);
      await createProduct({
        name: item.name,
        slug: slug,
        description: item.description,
        category: item.category,
        price: item.price,
        stock: item.stock,
        image: item.image,
        createdAt: now,
        updatedAt: now,
      });
    }

    console.log('Initial product seeding completed successfully.');
    return true;
  } catch (error) {
    console.error('Error during product seeding:', error);
    return false;
  }
}
