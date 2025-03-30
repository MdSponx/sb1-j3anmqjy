import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../';
import type { User } from '../../../types/user';

/**
 * Get user document by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return null;
    return {
      id: userDoc.id,
      ...userDoc.data()
    } as User;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

/**
 * Update user document
 */
export async function updateUser(userId: string, data: Partial<User>): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...data,
      updated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}