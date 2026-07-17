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
    description: 'Laptop gaming dengan prosesor Intel Core i7 dan RTX.',
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
    description: 'Mechanical keyboard switch merah RGB.',
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
    description: 'Wireless mouse ergonomis.',
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
    description: 'Headset gaming surround 7.1.',
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
