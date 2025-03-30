import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useFirebase } from '../../../contexts/firebase';
import type { DirectorApplication } from '../types/application';

export function useApprovedMembers() {
  const { db } = useFirebase();
  const [members, setMembers] = useState<DirectorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);

    // สร้าง query เหมือนเดิม
    const q = query(
      collection(db, 'users'),
      where('occupation', '==', 'director'),
      where('verification_status', '==', 'approved')
    );

    // ใช้ onSnapshot แทน getDocs
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const approvedMembers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as DirectorApplication[];

        // Sort by name
        const sortedMembers = approvedMembers.sort((a, b) => 
          a.fullname_th.localeCompare(b.fullname_th)
        );

        setMembers(sortedMembers);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching approved members:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    // Cleanup listener เมื่อ unmount
    return () => unsubscribe();
  }, [db]);

  // ไม่จำเป็นต้องมี refreshMembers แล้วเพราะใช้ realtime listener
  return { 
    members, 
    loading, 
    error
  };
}