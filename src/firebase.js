import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  getDoc,
  serverTimestamp,
  where,
} from 'firebase/firestore';

// Firebase project configuration — loaded from .env (VITE_ prefix required by Vite)
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser environments)
export const analytics = getAnalytics(app);

// Initialize Cloud Firestore (NOT Realtime Database — this project uses Firestore)
export const db = getFirestore(app);

// ─── Firestore collection references ──────────────────────────────────────────
export const usersCol    = () => collection(db, 'users');
export const sellersCol  = () => collection(db, 'pendingSellers');
export const productsCol = () => collection(db, 'products');
export const ordersCol   = () => collection(db, 'orders');

// ─── Re-export Firestore helpers ───────────────────────────────────────────────
export {
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  getDoc,
  serverTimestamp,
  where,
};
