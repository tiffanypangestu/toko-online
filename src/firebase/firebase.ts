import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

// Verify if required environment variables are provided
export const isFirebaseConfigured = !!(
  apiKey &&
  projectId &&
  appId
);

console.log('Firebase Init Check:', {
  isConfigured: isFirebaseConfigured,
  hasApiKey: !!apiKey,
  hasProjectId: !!projectId,
  hasAppId: !!appId,
  envKeys: typeof window !== 'undefined' ? Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC_')) : []
});

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.error('Failed to initialize Firebase App / Firestore / Storage:', error);
  }
} else {
  if (typeof window === 'undefined') {
    console.warn(
      'WARNING: Firebase env variables are missing. Firestore client is bypassed.',
    );
  }
}

export { app, db, storage };
