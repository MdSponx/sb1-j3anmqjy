import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useFirebase } from '../../../contexts/firebase';
import type { AdminUser } from '../types/admin';

export function useAdminUsers() {
  const { db } = useFirebase();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const q = query(
        collection(db, 'users'),
        where('web_role', 'in', ['admin', 'editor', 'blogger'])
      );
      
      const snapshot = await getDocs(q);
      const adminUsers = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data.email,
          web_role: data.web_role,
          fullname_th: data.fullname_th || '-',
          fullname_en: data.fullname_en || '-',
          occupation: data.occupation || '-',
        };
      });

      setUsers(adminUsers);
    } catch (err) {
      console.error('Error fetching admin users:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [db]);

  const addUser = useCallback((user: AdminUser) => {
    setUsers(prev => [...prev, user]);
  }, []);

  const removeUser = useCallback(async (userId: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        web_role: 'user',
        updated_at: new Date().toISOString(),
      });

      setUsers(prev => prev.filter(user => user.id !== userId));
      return true;
    } catch (err) {
      console.error('Error removing user role:', err);
      throw err;
    }
  }, [db]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    addUser,
    removeUser,
    refreshUsers: fetchUsers
  };
}