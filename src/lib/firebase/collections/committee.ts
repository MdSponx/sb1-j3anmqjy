import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../';
import type { CommitteeMember } from '../../../types/committee';

/**
 * Fetch committee members
 */
export async function fetchCommitteeMembers(): Promise<CommitteeMember[]> {
  try {
    const committeeRef = collection(db, 'comittee');
    const q = query(committeeRef, orderBy('ตำแหน่ง'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data()['ชื่อ-นามสกุล'] || '',
      position: doc.data()['ตำแหน่ง'] || '',
      photo: doc.data()['photo']
    }));
  } catch (error) {
    console.error('Error fetching committee members:', error);
    throw error;
  }
}