import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { useFirebase } from '../../../../contexts/firebase';
import type { Project } from '../../../../types/project';

export function useProjects() {
  const { db } = useFirebase();
  const [projects, setProjects] = useState<Project[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const projectsRef = collection(db, 'projects');
        const now = new Date().toISOString();

        // Fetch all projects that haven't ended yet
        const q = query(
          projectsRef,
          where('endDate', '>=', now),
          orderBy('endDate', 'asc')
        );

        const snapshot = await getDocs(q);
        const allProjects = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Project[];

        // Separate featured and regular projects
        const featured = allProjects.filter(project => project.isHighlight);
        const regular = allProjects.filter(project => !project.isHighlight);

        setFeaturedProjects(featured);
        setProjects(regular);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [db]);

  return { projects, featuredProjects, loading, error };
}