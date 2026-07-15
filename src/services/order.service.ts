import { db, isFirebaseConfigured } from '@/firebase/firebase';
import { Order } from '@/types/order';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

const COLLECTION_NAME = 'orders';

/**
 * Creates a new order in Firestore.
 * Generates a document inside the 'orders' collection.
 */
export async function createOrder(order: Omit<Order, 'id'>): Promise<string> {
  try {
    if (!isFirebaseConfigured || !db) {
      throw new Error('Firebase Firestore is not configured. Set environment variables.');
    }
    const ordersRef = collection(db, COLLECTION_NAME);
    const docRef = doc(ordersRef); // Generates auto document ID
    const finalOrder: Order = {
      ...order,
      id: docRef.id,
    };
    await setDoc(docRef, finalOrder);
    return docRef.id;
  } catch (error) {
    console.error('Error creating order in Firestore:', error);
    throw error;
  }
}

/**
 * Fetches a single order from Firestore by document ID.
 */
export async function getOrderById(id: string): Promise<Order | null> {
  try {
    if (!isFirebaseConfigured || !db) {
      throw new Error('Firebase Firestore is not configured. Set environment variables.');
    }
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Order;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching order with document ID ${id}:`, error);
    throw error;
  }
}

/**
 * Fetches a single order from Firestore by its formatted Order ID (ORD-YYYYMMDD-XXXX).
 */
export async function getOrderByOrderId(orderId: string): Promise<Order | null> {
  try {
    if (!isFirebaseConfigured || !db) {
      throw new Error('Firebase Firestore is not configured. Set environment variables.');
    }
    const ordersRef = collection(db, COLLECTION_NAME);
    const q = query(ordersRef, where('orderId', '==', orderId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as Order;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching order with Order ID ${orderId}:`, error);
    throw error;
  }
}

/**
 * Updates an order in Firestore by document ID.
 */
export async function updateOrder(id: string, updates: Partial<Omit<Order, 'id' | 'createdAt'>>): Promise<void> {
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
    console.error(`Error updating order with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Deletes an order in Firestore by document ID.
 */
export async function deleteOrder(id: string): Promise<void> {
  try {
    if (!isFirebaseConfigured || !db) {
      throw new Error('Firebase Firestore is not configured. Set environment variables.');
    }
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting order with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Fetches all orders from Firestore, ordered by creation date descending.
 */
export async function getOrders(): Promise<Order[]> {
  try {
    if (!isFirebaseConfigured || !db) {
      throw new Error('Firebase Firestore is not configured. Set environment variables.');
    }
    const ordersRef = collection(db, COLLECTION_NAME);
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    querySnapshot.forEach((docSnap) => {
      orders.push(docSnap.data() as Order);
    });
    return orders;
  } catch (error) {
    console.error('Error fetching orders from Firestore:', error);
    throw error;
  }
}
