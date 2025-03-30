import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useFirebase } from '../../contexts/firebase';
import { checkAdminPermissions } from '../../lib/firebase/admin/permissions';

export function useAdminStatus() {
  const { user } = useAuth();
  const { db } = useFirebase();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const verifyAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const hasPermission = await checkAdminPermissions(db, user.uid);
        setIsAdmin(hasPermission);
      } catch (err) {
        console.error('Error verifying admin status:', err);
        setError(err as Error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAdminStatus();
  }, [user, db]);

  return { isAdmin, loading, error };
}