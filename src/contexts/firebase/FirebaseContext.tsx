import React, { createContext, useContext } from 'react';
import { app, analytics, db, storage, auth } from '../../lib/firebase';
import type { FirebaseContextType } from './types';

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const value: FirebaseContextType = {
    app,
    analytics,
    db,
    storage,
    auth,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === null) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}