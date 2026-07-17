import { db, isFirebaseConfigured } from '@/firebase/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export interface UserBalance {
  email: string;
  balance: number;
  updatedAt: string;
}

const DEFAULT_BALANCE = 5000000; // Default starting balance: Rp 5.000.000

/**
 * Get the balance for a given email. If the email doesn't have a balance record yet,
 * it creates one with the default starting balance (Rp 5.000.000).
 */
export async function getBalance(email: string): Promise<number> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) return 0;

  try {
    if (!isFirebaseConfigured || !db) {
      console.warn('Firebase is not configured. Simulating client balance.');
      // Local storage fallback for simulation if Firestore is not available
      if (typeof window !== 'undefined') {
        const localBal = localStorage.getItem(`saldo_${cleanEmail}`);
        if (localBal !== null) return Number(localBal);
        localStorage.setItem(`saldo_${cleanEmail}`, String(DEFAULT_BALANCE));
        return DEFAULT_BALANCE;
      }
      return DEFAULT_BALANCE;
    }

    const docRef = doc(db, 'balances', cleanEmail);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return Number(data.balance) || 0;
    } else {
      // Initialize with default balance
      const initialRecord: UserBalance = {
        email: cleanEmail,
        balance: DEFAULT_BALANCE,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(docRef, initialRecord);
      return DEFAULT_BALANCE;
    }
  } catch (error) {
    console.error(`Error fetching balance for ${cleanEmail}:`, error);
    throw error;
  }
}

/**
 * Top up / add funds to the user's balance.
 */
export async function topUpBalance(email: string, amount: number): Promise<number> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || amount <= 0) return 0;

  try {
    const current = await getBalance(cleanEmail);
    const newBalance = current + amount;

    if (!isFirebaseConfigured || !db) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`saldo_${cleanEmail}`, String(newBalance));
      }
      return newBalance;
    }

    const docRef = doc(db, 'balances', cleanEmail);
    await updateDoc(docRef, {
      balance: newBalance,
      updatedAt: new Date().toISOString(),
    });

    return newBalance;
  } catch (error) {
    console.error(`Error topping up balance for ${cleanEmail}:`, error);
    throw error;
  }
}

/**
 * Deduct funds from the user's balance. Throws error if funds are insufficient.
 */
export async function deductBalance(email: string, amount: number): Promise<number> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || amount <= 0) return 0;

  try {
    const current = await getBalance(cleanEmail);
    if (current < amount) {
      throw new Error('Saldo tidak mencukupi untuk melakukan transaksi ini.');
    }

    const newBalance = current - amount;

    if (!isFirebaseConfigured || !db) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`saldo_${cleanEmail}`, String(newBalance));
      }
      return newBalance;
    }

    const docRef = doc(db, 'balances', cleanEmail);
    await updateDoc(docRef, {
      balance: newBalance,
      updatedAt: new Date().toISOString(),
    });

    return newBalance;
  } catch (error) {
    console.error(`Error deducting balance for ${cleanEmail}:`, error);
    throw error;
  }
}
