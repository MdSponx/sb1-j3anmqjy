import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useFirebase } from '../../contexts/firebase';
import { useAdminPermissions } from './useAdminPermissions';
import type { DirectorApplication } from '../../types/application';

export function usePendingApplications() {
  const { db } = useFirebase();
  const { isAdmin, loading: permissionLoading } = useAdminPermissions();
  const [applications, setApplications] = useState<DirectorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPendingApplications = async () => {
      if (permissionLoading || !isAdmin) return;
      
      try {
        setLoading(true);
        const q = query(
          collection(db, 'users'),
          where('occupation', '==', 'director'),
          where('verification_status', '==', 'pending'),
          orderBy('created_at', 'desc')
        );

        const snapshot = await getDocs(q);
        const apps = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as DirectorApplication[];

        setApplications(apps);
      } catch (err) {
        console.error('Error fetching pending applications:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingApplications();
  }, [db, isAdmin, permissionLoading]);

  return { applications, loading: loading || permissionLoading, error };
}