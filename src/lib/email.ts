import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './firebase';

/**
 * Send email notification using Firebase Cloud Functions
 */
export async function sendEmailNotification(type: 'new_director_signup' | 'director_approved' | 'director_rejected', userId: string) {
  try {
    const functions = getFunctions(app);
    const sendEmail = httpsCallable(functions, 'sendEmailNotification');
    
    const result = await sendEmail({
      type,
      userId
    });

    return result.data;
  } catch (error) {
    console.error('Error sending email notification:', error);
    throw error;
  }
}