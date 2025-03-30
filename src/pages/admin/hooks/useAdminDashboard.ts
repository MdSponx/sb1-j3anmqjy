import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { useFirebase } from '../../../contexts/firebase';
import { calculateDashboardStats } from './utils/statsCalculator';
import type { DashboardStats } from '../types/dashboard';

export function useAdminDashboard() {
  const { db } = useFirebase();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    directors: 0,
    crews: 0,
    students: 0,
    generalPeople: 0,
    pendingDirectors: 0,
    approvedDirectors: 0,
    rejectedDirectors: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const statistics = calculateDashboardStats(users);
      setStats(statistics);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [db]);

  return {
    stats,
    loading,
    error,
    refreshData: fetchStats
  };
}