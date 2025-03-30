import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../';
import type { Director } from '../../../types/director';

/**
 * Search directors by name
 */
export async function searchDirectors(name: string): Promise<Director[]> {
  try {
    const directorsRef = collection(db, 'directors');
    const q = query(
      directorsRef,
      where('Director', '>=', name),
      where('Director', '<=', name + '\uf8ff')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().Director || '',
      movies: doc.data().Movies?.split('•').filter(Boolean).map((m: string) => m.trim()) || [],
      totalWorks: doc.data()['Total Work'] || 0,
      latestWorkYear: doc.data()['Latest Work C.E.'] || new Date().getFullYear()
    }));
  } catch (error) {
    console.error('Error searching directors:', error);
    throw error;
  }
}