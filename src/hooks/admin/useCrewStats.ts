import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useFirebase } from '../../contexts/firebase';
import type { CrewRoleStats } from '../types/crew';

export function useCrewStats() {
  const { db } = useFirebase();
  const [stats, setStats] = useState<CrewRoleStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCrewStats = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, 'users'),
          where('occupation', '==', 'crew')
        );
        
        const snapshot = await getDocs(q);
        const crewMembers = snapshot.docs.map(doc => doc.data());
        
        // Group by role and calculate counts
        const roleStats = crewMembers.reduce((acc, member) => {
          const role = member.role_en || 'Other';
          const existingRole = acc.find(item => item.role === role);
          
          if (existingRole) {
            existingRole.count++;
          } else {
            acc.push({ role, count: 1 });
          }
          
          return acc;
        }, [] as CrewRoleStats[]);

        // Calculate percentages
        const total = roleStats.reduce((sum, stat) => sum + stat.count, 0);
        roleStats.forEach(stat => {
          stat.percentage = (stat.count / total) * 100;
        });

        setStats(roleStats);
        setError(null);
      } catch (err) {
        console.error('Error fetching crew statistics:', err);
        setError('Failed to load crew statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchCrewStats();
  }, [db]);

  return { stats, loading, error };
}