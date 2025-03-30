import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useFirebase } from '../../contexts/firebase';
import { updateApplicationStatus } from '../../lib/firebase/admin/applications';
import { handlePermissionError } from '../../lib/firebase/permissions/admin';
import type { ApplicationStatus, PaymentStatus } from '../../types/application';

export function useApplicationActions() {
  const { user } = useAuth();
  const { db } = useFirebase();
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (
    applicationId: string,
    updates: Partial<{
      member_status: string;
      payment_status: PaymentStatus;
      verification_status: ApplicationStatus;
    }>
  ) => {
    if (!user) {
      setError('You must be logged in to perform this action');
      return;
    }

    try {
      await updateApplicationStatus(db, user.uid, applicationId, updates);
      setError(null);
      return true;
    } catch (err: any) {
      const errorMessage = handlePermissionError(err);
      setError(errorMessage);
      return false;
    }
  };

  const handleStatusChange = (applicationId: string, status: string) => {
    return handleAction(applicationId, { member_status: status });
  };

  const handlePaymentVerification = (applicationId: string, status: PaymentStatus) => {
    return handleAction(applicationId, { payment_status: status });
  };

  const handleApplicationApproval = (applicationId: string) => {
    return handleAction(applicationId, { verification_status: 'approved' });
  };

  const handleApplicationRejection = (applicationId: string) => {
    return handleAction(applicationId, { verification_status: 'rejected' });
  };

  return {
    handleStatusChange,
    handlePaymentVerification,
    handleApplicationApproval,
    handleApplicationRejection,
    error
  };
}