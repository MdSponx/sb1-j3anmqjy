import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { useFirebase } from '../contexts/firebase';
import { useDebounce } from './useDebounce';
import type { Member } from '../types/member';

export function useMembers(searchQuery: string) {
  const { db } = useFirebase();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const membersRef = collection(db, 'users');
        let constraints = [
          where('occupation', '==', 'director'),
          where('verification_status', '==', 'approved'),
          orderBy('fullname_th')
        ];

        if (debouncedSearch) {
          constraints = [
            where('occupation', '==', 'director'),
            where('verification_status', '==', 'approved'),
            where('fullname_th', '>=', debouncedSearch),
            where('fullname_th', '<=', debouncedSearch + '\uf8ff')
          ];
        }

        const q = query(membersRef, ...constraints);
        const snapshot = await getDocs(q);

        const membersList = snapshot.docs.map(doc => ({
          id: doc.id,
          fullname_th: doc.data().fullname_th || '',
          fullname_en: doc.data().fullname_en || '',
          nickname_th: doc.data().nickname_th || '',
          nickname_en: doc.data().nickname_en || '',
          profile_image_url: doc.data().profile_image_url
        }));

        setMembers(membersList);
        setError(null);
      } catch (err) {
        console.error('Error fetching members:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [db, debouncedSearch]);

  return { members, loading, error };
}