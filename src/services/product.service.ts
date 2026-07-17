import { db, isFirebaseConfigured } from '@/firebase/firebase';
import { Product } from '@/types/product';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';

const COLLECTION_NAME = 'products';

const dummyProducts: Product[] = [
  {
    id: 'dummy-1',
    name: 'Laptop Gaming ASUS ROG',
    slug: 'laptop-gaming-asus-rog',
    category: 'Laptop',
    price: 18500000,
    stock: 15,
    description: 'Laptop gaming kelas berat ASUS ROG Strix G15.\n\nSpesifikasi Utama:\n- Prosesor: Intel Core i7-12700H (14-Core, up to 4.7GHz)\n- Grafis: NVIDIA GeForce RTX 3060 6GB GDDR6\n- Memori: 16GB DDR5 4800MHz Dual Channel\n- Penyimpanan: 512GB M.2 NVMe PCIe 4.0 SSD\n- Layar: 15.6-inch FHD (1920 x 1080) IPS, 144Hz, Adaptive-Sync\n- Konektivitas: Wi-Fi 6E, Bluetooth 5.2, Gigabit Ethernet\n- Sistem Operasi: Windows 11 Home asli\n- Garansi Resmi ASUS Indonesia 2 Tahun.',
    image: 'https://placehold.co/600x600?text=ASUS+ROG',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dummy-2',
    name: 'Mechanical Keyboard RGB',
    slug: 'mechanical-keyboard-rgb',
    category: 'Keyboard',
    price: 850000,
    stock: 40,
    description: 'Mechanical Keyboard RGB berkinerja tinggi dengan tata letak tenkeyless (TKL) 80% yang ringkas.\n\nFitur Utama:\n- Switch: Outemu Red Linear Switch (ringan dan senyap, cocok untuk gaming & mengetik)\n- Layout: 87 tombol standar dengan keycap ABS double-shot\n- Backlight: RGB Backlit dinamis dengan 18 mode pencahayaan preset\n- Durabilitas: Masa pakai switch hingga 50 juta kali ketukan\n- Konektor: Kabel USB Type-C braided 1.8 meter berlapis emas\n- Fitur Tambahan: Full anti-ghosting (N-key rollover) dan kompatibilitas universal (Windows/Mac).',
    image: 'https://placehold.co/600x600?text=Keyboard+RGB',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dummy-3',
    name: 'Wireless Mouse Logitech',
    slug: 'wireless-mouse-logitech',
    category: 'Mouse',
    price: 350000,
    stock: 55,
    description: 'Wireless Mouse Logitech Signature M650 dengan teknologi SmartWheel.\n\nSpesifikasi & Fitur:\n- Koneksi: Bluetooth Low Energy (BLE) & USB Logi Bolt Receiver (jangkauan hingga 10 meter)\n- Scroll: SmartWheel scroll untuk akurasi baris-demi-baris atau scroll super cepat otomatis\n- Desain: Bentuk ergonomis berkontur dengan pegangan karet samping yang lembut\n- Klik Sunyi: Teknologi SilentTouch mengurangi 90% suara klik tanpa mengurangi sensasi klik\n- Baterai: 1x Baterai AA tahan hingga 24 bulan (Bluetooth)\n- Kompatibilitas: Windows, macOS, Linux, ChromeOS, iPadOS, Android.',
    image: 'https://placehold.co/600x600?text=Logitech+Mouse',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'dummy-4',
    name: 'Gaming Headset HyperX',
    slug: 'gaming-headset-hyperx',
    category: 'Headset',
    price: 1250000,
    stock: 20,
    description: 'Gaming Headset HyperX Cloud II - Headset Gaming Legendaris dengan Virtual 7.1 Surround Sound.\n\nFitur & Spesifikasi:\n- Audio: Driver dinamis 53mm khusus dengan magnet neodymium\n- Sound Card: Kotak kontrol audio USB premium dengan DSP bawaan untuk virtual 7.1 surround sound\n- Mikrofon: Detachable (bisa dilepas-pasang) dengan fitur noise-cancelling pasif\n- Kenyamanan: Pad busa memori (memory foam) berlapis kulit imitasi premium dan kerangka aluminium kokoh\n- Frekuensi Respon: 15Hz - 25kHz\n- Koneksi: Kabel jack 3.5mm (1m) + dongle USB kontrol suara (2m)\n- Kompatibilitas: PC, Mac, PS4, PS5, Xbox One, Xbox Series X|S, Nintendo Switch, dan perangkat seluler.',
    image: 'https://placehold.co/600x600?text=HyperX+Headset',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Fetch all products from Firestore ordered by creation date descending.
 */
export async function getProducts(): Promise<Product[]> {
  try {
    if (!isFirebaseConfigured || !db) {
      console.warn('Firebase is not configured. Returning 4 dummy products for demo purposes.');
      return dummyProducts;
    }
    const productsRef = collection(db, COLLECTION_NAME);
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      products.push({
        id: docSnap.id,
        name: data.name || '',
        slug: data.slug || '',
        description: data.description || '',
        category: data.category || '',
        price: Number(data.price) || 0,
        stock: Number(data.stock) || 0,
        image: data.image || '',
        createdAt: data.createdAt || '',
        updatedAt: data.updatedAt || '',
      });
    });
    return products;
  } catch (error) {
    console.error('Error fetching products from Firestore:', error);
    throw error;
  }
}

/**
 * Fetch a single product by its Firestore ID.
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    if (!isFirebaseConfigured || !db) {
      console.warn('Firebase is not configured. Searching in dummy products.');
      return dummyProducts.find(p => p.id === id) || dummyProducts.find(p => p.slug === id) || null;
    }
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name || '',
        slug: data.slug || '',
        description: data.description || '',
        category: data.category || '',
        price: Number(data.price) || 0,
        stock: Number(data.stock) || 0,
        image: data.image || '',
        createdAt: data.createdAt || '',
        updatedAt: data.updatedAt || '',
      };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching product with ID ${id} from Firestore:`, error);
    throw error;
  }
}

/**
 * Creates a new product in Firestore.
 */
export async function createProduct(
  product: Omit<Product, 'id'> & { id?: string },
): Promise<string> {
  try {
    if (!isFirebaseConfigured || !db) {
      throw new Error('Firebase Firestore is not configured. Set environment variables.');
    }
    const productsRef = collection(db, COLLECTION_NAME);
    const docRef = product.id ? doc(productsRef, product.id) : doc(productsRef);
    const finalId = docRef.id;
    const finalProduct: Product = {
      ...product,
      id: finalId,
    };
    await setDoc(docRef, finalProduct);
    return finalId;
  } catch (error) {
    console.error('Error creating product in Firestore:', error);
    throw error;
  }
}

/**
 * Updates an existing product in Firestore.
 */
export async function updateProduct(
  id: string,
  updates: Partial<Omit<Product, 'id' | 'createdAt'>>,
): Promise<void> {
  try {
    if (!isFirebaseConfigured || !db) {
      throw new Error('Firebase Firestore is not configured. Set environment variables.');
    }
    const docRef = doc(db, COLLECTION_NAME, id);
    const finalUpdates = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await updateDoc(docRef, finalUpdates);
  } catch (error) {
    console.error(`Error updating product with ID ${id} in Firestore:`, error);
    throw error;
  }
}

/**
 * Deletes a product from Firestore by ID.
 */
export async function deleteProduct(id: string): Promise<void> {
  try {
    if (!isFirebaseConfigured || !db) {
      throw new Error('Firebase Firestore is not configured. Set environment variables.');
    }
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting product with ID ${id} from Firestore:`, error);
    throw error;
  }
}
