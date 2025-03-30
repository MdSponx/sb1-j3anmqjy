import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { verifyAdminPermissions } from '../permissions/admin';
import { sendApprovalEmail } from '../email';
import type { ApplicationStatus, PaymentStatus } from '../../../types/application';

export async function updateApplicationStatus(
  db: Firestore,
  userId: string,
  applicationId: string,
  updates: Partial<{
    member_status: string;
    payment_status: PaymentStatus;
    verification_status: ApplicationStatus;
  }>
) {
  // Verify admin permissions before proceeding
  const isAdmin = await verifyAdminPermissions(userId);
  if (!isAdmin) {
    throw new Error('permission-denied');
  }

  // Get user data for email
  const userDoc = await doc(db, 'users', applicationId).get();
  const userData = userDoc.data();

  // Update document
  await updateDoc(doc(db, 'users', applicationId), {
    ...updates,
    updated_at: serverTimestamp(),
    updated_by: userId
  });

  // Send approval email if status is being set to approved
  if (updates.verification_status === 'approved' && userData?.email) {
    await sendApprovalEmail({
      to: userData.email,
      name: userData.fullname_th || '',
      occupation: userData.occupation || '',
      language: userData.language || 'th'
    });
  }
}