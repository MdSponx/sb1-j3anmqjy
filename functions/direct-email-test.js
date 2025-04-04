const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Function to directly call the sendEmailNotification function
async function sendDirectEmailNotification() {
  try {
    // Create a test user document in Firestore
    const testUserId = `test-user-${Date.now()}`;
    const testUserData = {
      fullname_TH: 'Test User',
      email: 'test@example.com',
      login_email: 'test@example.com',
      occupation: 'general people',
      verification_status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Add the test user to Firestore
    await admin.firestore().collection('users').doc(testUserId).set(testUserData);
    console.log(`Created test user: ${testUserId}`);

    // Get a reference to the sendEmailNotification callable function
    const sendEmailNotification = admin.functions().httpsCallable('sendEmailNotification');

    // Call the function with the test user ID
    console.log(`Calling sendEmailNotification function with userId: ${testUserId}`);
    const result = await sendEmailNotification({
      type: 'new_user_signup',
      userId: testUserId
    });

    console.log('Email notification sent successfully:', result.data);
    
    // Clean up the test user
    await admin.firestore().collection('users').doc(testUserId).delete();
    console.log(`Deleted test user: ${testUserId}`);
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
}

// Run the test
sendDirectEmailNotification().then(() => {
  console.log('Test script completed');
  process.exit(0);
}).catch(error => {
  console.error('Test script failed:', error);
  process.exit(1);
});
