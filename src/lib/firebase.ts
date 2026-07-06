import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot as originalOnSnapshot,
  query,
  where,
  orderBy,
  limit,
  initializeFirestore
} from "firebase/firestore";
import firebaseConfigJson from "../../firebase-applet-config.json";

// Config from firebase-applet-config.json
const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
  measurementId: firebaseConfigJson.measurementId || ""
};

// Initialize Firebase App
let app: any;
let auth: any;
let db: any;

try {
  app = initializeApp(firebaseConfig);
  // Specify custom firestoreDatabaseId as the third argument of initializeFirestore
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true, // helpful in sandboxed iframe environments to bypass gRPC blocks
  }, firebaseConfigJson.firestoreDatabaseId || "(default)");
  auth = getAuth(app);
} catch (error) {
  console.error("Firebase initialization failed, using fallback:", error);
}

const safeOnSnapshot = (...args: any[]) => {
  try {
    if (args.length === 2 && typeof args[1] === "function") {
      return originalOnSnapshot(args[0], args[1], (error: any) => {
        console.warn("Firestore listener warning (handled):", error?.message || error);
      });
    } else if (args.length === 3 && typeof args[1] === "object" && typeof args[2] === "function") {
      return originalOnSnapshot(args[0], args[1], args[2], (error: any) => {
        console.warn("Firestore listener warning (handled):", error?.message || error);
      });
    }
    return originalOnSnapshot(...(args as [any, any]));
  } catch (err) {
    console.warn("Failed to attach snapshot listener:", err);
    return () => {};
  }
};

export { auth, db, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged };
export { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  safeOnSnapshot as onSnapshot,
  query,
  where,
  orderBy,
  limit 
};
