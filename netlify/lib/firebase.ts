import * as admin from "firebase-admin";

let dbInstance: admin.firestore.Firestore | null = null;

export function initFirebase() {
  if (dbInstance) {
    return dbInstance;
  }

  if (!admin.apps.length) {
    try {
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        let accountString = process.env.FIREBASE_SERVICE_ACCOUNT;

        // Strip out surrounding single quotes if dotenv added them
        if (accountString.startsWith("'") && accountString.endsWith("'")) {
          // console.log("Stripping single quotes from FIREBASE_SERVICE_ACCOUNT env var");
          accountString = accountString.slice(1, -1);
        }

        const serviceAccount = JSON.parse(accountString);

        // Note: Sometimes gRPC errors occur if the implicitly extracted DB
        // string format isn't perfectly mapped. It's safer to pass the projectId
        // explicitly here when using the admin SDK outside of GCP environments.
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      } else {
        // Fallback for local emulator or default ADC
        admin.initializeApp();
      }
    } catch (error) {
      console.error("Firebase Initialization Error:", error);
      throw new Error("Could not initialize Firebase Admin SDK");
    }
  }

  const db = admin.firestore();

  // Only call settings if we are the ones creating the instance now
  try {
    db.settings({ databaseId: "default", ignoreUndefinedProperties: true });
  } catch (e) {
    // Ignore setting errors if already initialized somehow
  }

  dbInstance = db;
  return dbInstance;
}
