import { useState, useEffect, useMemo } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useFirebase } from '../../../contexts/firebase';
import { useDebounce } from '../../../hooks/useDebounce';
import type { Member } from '../types/member';

export function useMembers(searchQuery: string) {
  const { db } = useFirebase();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const debouncedSearch = useDebounce(searchQuery?.trim().toLowerCase() || '', 300);

  // Fetch all approved directors first
  useEffect(() => {
    let isSubscribed = true;

    const fetchMembers = async () => {
      try {
        setLoading(true);
        
        const membersRef = collection(db, 'users');
        // Simplified query - only essential filters
        const q = query(
          membersRef,
          where('occupation', '==', 'director'),
          where('verification_status', '==', 'approved')
        );

        const snapshot = await getDocs(q);
        
        if (!isSubscribed) return;

        const membersList = snapshot.docs.map<Member>(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            fullname_th: data.fullname_th || '',
            fullname_en: data.fullname_en || '',
            nickname_th: data.nickname_th || '',
            nickname_en: data.nickname_en || '',
            profile_image_url: data.profile_image_url || ''
          };
        });

        setMembers(membersList);
        setError(null);
      } catch (err) {
        console.error('Error fetching members:', err);
        if (isSubscribed) {
          setError(err instanceof Error ? err : new Error('Failed to fetch members'));
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    fetchMembers();

    return () => {
      isSubscribed = false;
    };
  }, [db]);

  // Filter members based on search query on the client side
  const filteredMembers = useMemo(() => {
    if (!debouncedSearch) return members;

    return members.filter(member => {
      const searchFields = [
        member.fullname_th,
        member.fullname_en,
        member.nickname_th,
        member.nickname_en
      ].map(field => field.toLowerCase());

      return searchFields.some(field => field.includes(debouncedSearch));
    });
  }, [members, debouncedSearch]);

  // Sort members by Thai fullname
  const sortedMembers = useMemo(() => {
    return [...filteredMembers].sort((a, b) => 
      a.fullname_th.localeCompare(b.fullname_th, 'th')
    );
  }, [filteredMembers]);

  return {
    members: sortedMembers,
    loading,
    error,
    isEmpty: !loading && sortedMembers.length === 0
  };
}