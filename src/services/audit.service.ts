import { db, isFirebaseConfigured } from '@/firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';

export interface AuditLog {
  id?: string;
  action:
    | 'ADMIN_LOGIN'
    | 'ADMIN_LOGOUT'
    | 'PRODUCT_CREATE'
    | 'PRODUCT_UPDATE'
    | 'PRODUCT_DELETE'
    | 'ORDER_CHECKOUT'
    | 'ORDER_PAYMENT_SUCCESS'
    | 'ORDER_PAYMENT_FAILED'
    | 'WEBHOOK_RECEIVED';
  user: string;
  timestamp: string;
  ipAddress: string;
  description: string;
}

/**
 * Creates a new audit log entry inside Firestore.
 * Catates admin actions, user transactions, and checkout logs securely.
 */
export async function createAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<string> {
  try {
    if (!isFirebaseConfigured || !db) {
      console.warn('Firebase Firestore not configured. Bypassing audit log write.');
      return '';
    }

    const auditRef = collection(db, 'audit_logs');
    const finalLog: AuditLog = {
      ...log,
      timestamp: new Date().toISOString(),
    };

    const docRef = await addDoc(auditRef, finalLog);
    return docRef.id;
  } catch (error) {
    console.error('Error writing audit log to Firestore:', error);
    return '';
  }
}
