import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useFirebase } from '../../../contexts/firebase';
import type { CrewApplication } from '../types/application';

export function useApprovedCrewMembers() {
  const { db } = useFirebase();
  const [members, setMembers] = useState<CrewApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);

    // Query for approved crew members
    const q = query(
      collection(db, 'users'),
      where('occupation', '==', 'crew'),
      where('verification_status', '==', 'approved')
    );

    // Use realtime listener
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        try {
          const approvedMembers = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              fullname_th: data.fullname_th || '',
              fullname_en: data.fullname_en || '',
              email: data.email || '',
              phone: data.phone || '',
              occupation: 'crew' as const,
              department_th: data.department_th || '',
              department_en: data.department_en || '',
              role_th: data.role_th || '',
              role_en: data.role_en || '',
              verification_status: data.verification_status || 'pending',
              member_status: data.member_status || 'ว่าที่สามัญ',
              payment_status: data.payment_status || 'not paid',
              profile_image_url: data.profile_image_url,
              id_card_image_url: data.id_card_image_url,
              payment_slip_url: data.payment_slip_url,
              created_at: data.created_at,
              updated_at: data.updated_at
            } as CrewApplication;
          });

          // Sort by name, with null check
          const sortedMembers = approvedMembers.sort((a, b) => {
            if (!a.fullname_th) return 1;  // Move empty names to end
            if (!b.fullname_th) return -1; // Move empty names to end
            return a.fullname_th.localeCompare(b.fullname_th, 'th');
          });

          setMembers(sortedMembers);
          setError(null);
        } catch (err) {
          console.error('Error processing members data:', err);
          setError(err instanceof Error ? err : new Error('Failed to process members data'));
          setMembers([]);
        }
      },
      (err) => {
        console.error('Error fetching approved members:', err);
        setError(err as Error);
        setMembers([]);
      }
    );

    setLoading(false);
    return () => unsubscribe();
  }, [db]);

  const refreshData = () => {
    // No need to implement since we're using realtime listener
  };

  return { 
    members, 
    loading, 
    error,
    refreshData
  };
}