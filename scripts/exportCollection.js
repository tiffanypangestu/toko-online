/* eslint-disable */
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Verify service account environment variable
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
if (!serviceAccountPath) {
  console.error('ERROR: FIREBASE_SERVICE_ACCOUNT_PATH is not defined in environment variables.');
  console.log('Usage: Set FIREBASE_SERVICE_ACCOUNT_PATH to the path of your firebase service account json key file.');
  process.exit(1);
}

try {
  const serviceAccount = require(path.resolve(serviceAccountPath));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase Admin SDK initialized successfully.');
} catch (err) {
  console.error('Failed to initialize Firebase Admin SDK. Check service account file path:', err);
  process.exit(1);
}

const db = admin.firestore();

/**
 * Exports all documents inside a firestore collection to a local backup JSON file.
 * @param {string} collectionName Name of Firestore Collection
 */
async function exportCollection(collectionName) {
  try {
    console.log(`Exporting Firestore collection "${collectionName}"...`);
    const snapshot = await db.collection(collectionName).get();
    const documents = [];

    snapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });

    const backupDir = path.join(__dirname, '../backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFilePath = path.join(backupDir, `${collectionName}-backup-${timestamp}.json`);
    
    fs.writeFileSync(backupFilePath, JSON.stringify(documents, null, 2), 'utf-8');
    console.log(`SUCCESS: Exported ${documents.length} docs to ${backupFilePath}`);
  } catch (error) {
    console.error(`FAILED: Error exporting collection "${collectionName}":`, error);
  }
}

// Run export on target collections
const targetCollections = ['products', 'orders', 'audit_logs'];
(async () => {
  for (const collection of targetCollections) {
    await exportCollection(collection);
  }
})();
