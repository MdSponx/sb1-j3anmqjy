import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  QueryConstraint, 
  onSnapshot,
  DocumentData 
} from 'firebase/firestore';
import { useFirebase } from '../contexts/FirebaseContext';

export function useFirestore<T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) {
  const { db } = useFirebase();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(collection(db, collectionName), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const documents = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(documents);
        setLoading(false);
      },
      (err) => {
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, collectionName, constraints]);

  return { data, loading, error };
}