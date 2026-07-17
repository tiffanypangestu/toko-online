import { db, isFirebaseConfigured } from '@/firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';

export interface ContactSubmission {
  name: string;
  email: string;
  message: string;
  createdAt?: string;
}

export async function submitContact(data: ContactSubmission): Promise<string> {
  try {
    if (!isFirebaseConfigured || !db) {
      console.warn('Firebase is not configured. Simulating contact form submission.');
      return 'dummy-contact-id';
    }

    const contactsRef = collection(db, 'contacts');
    const submission = {
      ...data,
      createdAt: new Date().toISOString(),
    };
    
    const docRef = await addDoc(contactsRef, submission);
    return docRef.id;
  } catch (error) {
    console.error('Error submitting contact form to Firestore:', error);
    throw error;
  }
}
