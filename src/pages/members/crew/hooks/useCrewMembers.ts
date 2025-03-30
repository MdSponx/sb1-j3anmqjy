import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useFirebase } from '../../../../contexts/firebase';
import { useDebounce } from '../../../../hooks/useDebounce';
import type { CrewMember } from '../types';

export function useCrewMembers(searchQuery: string, selectedRole: string) {
  const { db } = useFirebase();
  const [members, setMembers] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const debouncedSearch = useDebounce(searchQuery?.trim().toLowerCase() || '', 300);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        
        const membersRef = collection(db, 'users');
        const constraints = [
          where('occupation', '==', 'crew'),
          where('verification_status', '==', 'approved')
        ];

        if (selectedRole !== 'all') {
          constraints.push(where('department_en', '==', selectedRole));
        }

        const q = query(membersRef, ...constraints);
        const snapshot = await getDocs(q);
        
        let membersList = snapshot.docs.map<CrewMember>(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            fullname_th: data.fullname_th || '',
            fullname_en: data.fullname_en || '',
            department_th: data.department_th || '',
            department_en: data.department_en || '',
            role_th: data.role_th || '',
            role_en: data.role_en || '',
            profile_image_url: data.profile_image_url || ''
          };
        });

        // Client-side search filtering
        if (debouncedSearch) {
          membersList = membersList.filter(member => {
            const searchFields = [
              member.fullname_th,
              member.fullname_en,
              member.role_th,
              member.role_en
            ].map(field => field.toLowerCase());

            return searchFields.some(field => field.includes(debouncedSearch));
          });
        }

        // Sort by Thai name
        membersList.sort((a, b) => a.fullname_th.localeCompare(b.fullname_th, 'th'));

        setMembers(membersList);
        setError(null);
      } catch (err) {
        console.error('Error fetching crew members:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch crew members'));
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [db, debouncedSearch, selectedRole]);

  return { members, loading, error };
}