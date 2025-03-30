import { useState, useCallback } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useFirebase } from '../contexts/firebase';

export function useAuth() {
  const { auth } = useFirebase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (err) {
      setError('Invalid email or password');
      return false;
    } finally {
      setLoading(false);
    }
  }, [auth]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await signOut(auth);
      return true;
    } catch (err) {
      setError('Error signing out');
      return false;
    } finally {
      setLoading(false);
    }
  }, [auth]);

  return {
    loading,
    error,
    login,
    logout
  };
}