import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let dbInstance: Firestore | null = null;

export function initFirebase() {
  if (dbInstance) {
    return dbInstance;
  }

  if (!getApps().length) {
    try {
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        let accountString = process.env.FIREBASE_SERVICE_ACCOUNT;

        // Strip out surrounding single quotes if dotenv added them
        if (accountString.startsWith("'") && accountString.endsWith("'")) {
          accountString = accountString.slice(1, -1);
        }

        const serviceAccount = JSON.parse(accountString);

        // Note: Sometimes gRPC errors occur if the implicitly extracted DB
        // string format isn't perfectly mapped. It's safer to pass the projectId
        // explicitly here when using the admin SDK outside of GCP environments.
        initializeApp({
          credential: cert(serviceAccount),
        });
      } else {
        // Fallback for local emulator or default ADC
        initializeApp();
      }
    } catch (error) {
      console.error("Firebase Initialization Error:", error);
      throw new Error("Could not initialize Firebase Admin SDK");
    }
  }

  const db = getFirestore();

  // Only call settings if we are the ones creating the instance now
  try {
    db.settings({ databaseId: "default", ignoreUndefinedProperties: true });
  } catch (e) {
    // Ignore setting errors if already initialized somehow
  }

  dbInstance = db;
  return dbInstance;
}
