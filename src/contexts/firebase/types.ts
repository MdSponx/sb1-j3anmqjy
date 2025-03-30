import { Analytics } from 'firebase/analytics';
import { Firestore } from 'firebase/firestore';
import { Storage } from 'firebase/storage';
import { Auth } from 'firebase/auth';
import { FirebaseApp } from 'firebase/app';

export interface FirebaseContextType {
  app: FirebaseApp;
  analytics: Analytics;
  db: Firestore;
  storage: Storage;
  auth: Auth;
}