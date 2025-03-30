import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useFirebase } from '../../../contexts/firebase';
import type { DirectorApplication } from '../types/application';

export function useApplicationApproval() {
  const { db } = useFirebase();

  const handleApproval = async (applicationId: string) => {
    const userRef = doc(db, 'users', applicationId);
    
    try {
      await updateDoc(userRef, {
        verification_status: 'approved',
        member_status: 'สามัญ',
        updated_at: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error('Error approving application:', error);
      throw error;
    }
  };

  const handleRejection = async (applicationId: string) => {
    const userRef = doc(db, 'users', applicationId);
    
    try {
      await updateDoc(userRef, {
        verification_status: 'rejected',
        updated_at: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error('Error rejecting application:', error);
      throw error;
    }
  };

  return {
    handleApproval,
    handleRejection
  };
}