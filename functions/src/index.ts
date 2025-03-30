import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

admin.initializeApp();

// Initialize nodemailer with Gmail credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.password
  }
});

export const sendEmailNotification = functions.https.onCall(async (data, context) => {
  try {
    const { type, userId } = data;
    
    // Get user data
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    if (!userDoc.exists) {
      throw new Error('User not found');
    }
    const userData = userDoc.data();

    // Get admin users
    const adminSnapshot = await admin.firestore()
      .collection('users')
      .where('web_role', '==', 'admin')
      .get();

    const adminEmails = adminSnapshot.docs.map(doc => doc.data().email).filter(Boolean);

    let emailOptions;
    switch (type) {
      case 'new_director_signup':
        emailOptions = {
          to: adminEmails.join(','),
          subject: 'New Director Application',
          html: `
            <h2>New Director Application Received</h2>
            <p>A new director has signed up and requires verification:</p>
            <ul>
              <li>Name: ${userData.fullname_th || 'N/A'}</li>
              <li>Email: ${userData.email || 'N/A'}</li>
            </ul>
            <p>Please review their application at:</p>
            <a href="https://thaifilmdirectors.com/admin/applications" style="display: inline-block; padding: 10px 20px; background-color: #EF4444; color: white; text-decoration: none; border-radius: 5px;">Review Application</a>
          `
        };
        break;

      case 'director_approved':
        emailOptions = {
          to: userData.email,
          subject: 'Director Application Approved',
          html: `
            <h2>Congratulations!</h2>
            <p>Your director application has been approved.</p>
            <p>You can now access all director features on the platform.</p>
            <a href="https://thaifilmdirectors.com/profile" style="display: inline-block; padding: 10px 20px; background-color: #EF4444; color: white; text-decoration: none; border-radius: 5px;">View Profile</a>
          `
        };
        break;

      case 'director_rejected':
        emailOptions = {
          to: userData.email,
          subject: 'Director Application Status Update',
          html: `
            <h2>Application Status Update</h2>
            <p>We regret to inform you that your director application could not be verified at this time.</p>
            <p>Please contact us for more information or to provide additional verification.</p>
            <a href="mailto:contact@thaifilmdirectors.com" style="display: inline-block; padding: 10px 20px; background-color: #EF4444; color: white; text-decoration: none; border-radius: 5px;">Contact Us</a>
          `
        };
        break;

      default:
        throw new Error('Invalid notification type');
    }

    // Send email
    await transporter.sendMail({
      from: '"Thai Film Director Association" <noreply@thaifilmdirectors.com>',
      ...emailOptions
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending email notification:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send email notification');
  }
});