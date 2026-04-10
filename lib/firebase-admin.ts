import * as admin from "firebase-admin";

// Prevent multiple initializations in development (Next.js hot reloading)
if (!admin.apps.length) {
  admin.initializeApp({
    // In production, ensure you have set the GOOGLE_APPLICATION_CREDENTIALS 
    // environment variable pointing to your Firebase service account key JSON file.
    credential: admin.credential.applicationDefault(),
    projectId: "maplegoodsauth", // From your lib/firebase.ts
  });
}

export const db = admin.firestore();