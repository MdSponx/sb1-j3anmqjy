import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useFirebase } from '../../../contexts/firebase';
import type { CrewApplication } from '../types/application';

export function usePendingCrewApplications() {
  const { db } = useFirebase();
  const [applications, setApplications] = useState<CrewApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    
    // Create query for pending crew applications
    const q = query(
      collection(db, 'users'),
      where('occupation', '==', 'crew'),
      where('verification_status', '==', 'pending')
    );

    // Use realtime listener
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const apps = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as CrewApplication[];

        // Sort applications by creation date
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

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [db]);

  return {
    applications,
    loading,
    error
  };
}