import { useState, useEffect, useCallback } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useFirebase } from '../../../../../contexts/firebase';
import type { Project } from '../../../../../types/project';

export function useProjects() {
  const { db } = useFirebase();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Use realtime updates with onSnapshot instead of one-time fetch
  useEffect(() => {
    const projectsRef = collection(db, 'projects');
    const q = query(projectsRef, orderBy('created_at', 'desc'));

    // Set up realtime listener
    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const projectsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Project[];
        setProjects(projectsList);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching projects:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [db]);

  // Refresh function now just triggers loading state
  const refreshData = useCallback(() => {
    setLoading(true);
  }, []);

  return { projects, loading, error, refreshData };
}