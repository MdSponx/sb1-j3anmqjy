import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useFirebase } from '../../../contexts/firebase';
import type { ApplicationStatus, PaymentStatus } from '../types/application';

export function useApplicationActions() {
  const { db } = useFirebase();

  const handleStatusChange = async (applicationId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'users', applicationId), {
        member_status: status,
        updated_at: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  };

  const handlePaymentVerification = async (applicationId: string, status: PaymentStatus) => {
    try {
      await updateDoc(doc(db, 'users', applicationId), {
        payment_status: status,
        updated_at: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  };

  const handleApplicationApproval = async (applicationId: string) => {
    try {
      await updateDoc(doc(db, 'users', applicationId), {
        verification_status: 'approved' as ApplicationStatus,
        updated_at: serverTimestamp()
      });
    } catch (error) {
      console.error('Error approving application:', error);
      throw error;
    }
  };

  const handleApplicationRejection = async (applicationId: string) => {
    try {
      await updateDoc(doc(db, 'users', applicationId), {
        verification_status: 'rejected' as ApplicationStatus,
        updated_at: serverTimestamp()
      });
    } catch (error) {
      console.error('Error rejecting application:', error);
      throw error;
    }
  };

  return {
    handleStatusChange,
    handlePaymentVerification,
    handleApplicationApproval,
    handleApplicationRejection
  };
}