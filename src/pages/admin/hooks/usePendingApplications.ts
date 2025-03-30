import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useFirebase } from '../../../contexts/firebase';
import type { DirectorApplication } from '../types/application';

export function usePendingApplications() {
  const { db } = useFirebase();
  const [applications, setApplications] = useState<DirectorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    
    // สร้าง query
    const q = query(
      collection(db, 'users'),
      where('occupation', '==', 'director'),
      where('verification_status', '==', 'pending')
    );

    // ใช้ onSnapshot แทน getDocs
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const apps = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as DirectorApplication[];

        // Sort applications
        const sortedApps = apps.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });

        setApplications(sortedApps);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching applications:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    // Cleanup listener เมื่อ component unmount
    return () => unsubscribe();
  }, [db]);

  // ตัด fetchApplications ออกเพราะใช้ realtime listener แล้ว
  return {
    applications,
    loading,
    error
  };
}