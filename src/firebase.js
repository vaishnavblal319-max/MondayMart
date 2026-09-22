import { initializeApp } from 'firebase/app';
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
  serverTimestamp,
} from 'firebase/firestore';

// Your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyD7W7-6NCyb84AnIQ4_9cv42yGK-MkJB9Y",
  authDomain: "monday-market-8cf15.firebaseapp.com",
  projectId: "monday-market-8cf15",
  storageBucket: "monday-market-8cf15.firebasestorage.app",
  messagingSenderId: "528892428321",
  appId: "1:528892428321:web:565a0336198759749ae360",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Firestore collection references
export const usersCol      = () => collection(db, 'users');
export const sellersCol    = () => collection(db, 'pendingSellers');
export const productsCol   = () => collection(db, 'products');
export const ordersCol     = () => collection(db, 'orders');

// Re-export Firestore helpers
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
  serverTimestamp,
};
