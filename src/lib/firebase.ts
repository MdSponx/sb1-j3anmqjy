import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmQ1gKQ04SkZ4I3peR5--ZM0eS6NSfUnI",
  authDomain: "tfda-member-list.firebaseapp.com",
  projectId: "tfda-member-list",
  storageBucket: "tfda-member-list.firebasestorage.app",
  messagingSenderId: "946151455818",
  appId: "1:946151455818:web:6042c6b27c1fbc5ae3bab3",
  measurementId: "G-QWPG3DGKSV"
};

// Initialize Firebase services
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);