import { doc, getDoc } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

export async function verifyAdminPermissions(db: Firestore, userId: string) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data();
    return userData?.web_role === 'admin';
  } catch (error) {
    console.error('Error verifying admin permissions:', error);
    return false;
  }
}

export function handlePermissionError(error: any): string {
  if (error.code === 'permission-denied') {
    return 'You do not have permission to perform this action. Please contact an administrator.';
  }
  return 'An unexpected error occurred. Please try again.';
}