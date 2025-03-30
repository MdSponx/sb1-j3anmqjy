import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { verifyAdminPermissions } from '../../lib/firebase/permissions/admin';

export function useAdminPermissions() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkPermissions = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const hasPermission = await verifyAdminPermissions(user.uid);
        setIsAdmin(hasPermission);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    checkPermissions();
  }, [user]);

  return { isAdmin, loading, error };
}