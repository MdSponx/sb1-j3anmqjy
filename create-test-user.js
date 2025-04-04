import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const testUserId = `test-user-${Date.now()}`;
const testUserData = {
  fullname_TH: 'Test User',
  email: 'test@example.com',
  login_email: 'test@example.com',
  occupation: 'general people',
  verification_status: 'pending',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const userRef = doc(collection(db, 'users'), testUserId);

setDoc(userRef, testUserData)
  .then(() => {
    console.log(`Created test user: ${testUserId}`);
    console.log('This should trigger the onNewUserSignup function and send an email notification to jmdsponx@gmail.com');
  })
  .catch(err => {
    console.error('Error creating test user:', err);
  });
