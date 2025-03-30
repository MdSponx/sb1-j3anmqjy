import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { useFirebase } from '../contexts/firebase';
import { CommitteeMember, positionOrder } from '../types/committee';

export function useCommitteeMembers() {
  const { db } = useFirebase();
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const q = query(collection(db, 'comittee'), orderBy('ตำแหน่ง'));
        const querySnapshot = await getDocs(q);
        
        const membersData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data['ชื่อ-นามสกุล'] || '',
            position: data['ตำแหน่ง'] || '',
            photo: data['photo'] || undefined
          };
        });

        // Sort members by position order
        const sortedMembers = membersData.sort((a, b) => {
          const posA = positionOrder.indexOf(a.position as any);
          const posB = positionOrder.indexOf(b.position as any);
          return posA - posB;
        });

        setMembers(sortedMembers);
      } catch (err) {
        console.error('Error fetching committee members:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchMembers();
  }, [db]);

  return { members, loading, error };
}