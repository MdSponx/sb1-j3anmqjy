import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useFirebase } from '../../../../contexts/firebase';

export function useEventSeats(eventId: string) {
  const { db } = useFirebase();
  const [totalSeats, setTotalSeats] = useState<number | null>(null);
  const [remainingSeats, setRemainingSeats] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        setLoading(true);
        
        // Get event registrations
        const registrationsRef = collection(db, 'events_registration');
        const q = query(
          registrationsRef,
          where('eventId', '==', eventId),
          where('status', 'in', ['pending', 'confirmed'])
        );
        
        const snapshot = await getDocs(q);
        
        // Calculate total registered seats
        const registeredSeats = snapshot.docs.reduce((total, doc) => {
          return total + (doc.data().persons || 1);
        }, 0);

        // Get event details for max_participants
        const eventsRef = collection(db, 'events');
        const eventDoc = await getDocs(query(eventsRef, where('id', '==', eventId)));
        
        if (!eventDoc.empty) {
          const eventData = eventDoc.docs[0].data();
          const maxParticipants = eventData.max_participants || 0;
          
          setTotalSeats(maxParticipants);
          setRemainingSeats(Math.max(0, maxParticipants - registeredSeats));
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching seats:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchSeats();
    }
  }, [db, eventId]);

  return { totalSeats, remainingSeats, loading, error };
}