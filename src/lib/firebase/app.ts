import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { firebaseConfig } from './config';

let app: FirebaseApp;

// Initialize Firebase only if no apps exist
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export { app };