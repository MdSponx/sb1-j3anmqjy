const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Function to test email notification
async function testEmailNotification() {
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

    // Wait a moment for the onCreate trigger to fire
    console.log('Waiting for onCreate trigger...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('Test completed. Check the Firebase Functions logs for email notification status.');
    
    // Clean up the test user
    await admin.firestore().collection('users').doc(testUserId).delete();
    console.log(`Deleted test user: ${testUserId}`);
  } catch (error) {
    console.error('Error testing email notification:', error);
  }
}

// Run the test
testEmailNotification().then(() => {
  console.log('Test script completed');
  process.exit(0);
}).catch(error => {
  console.error('Test script failed:', error);
  process.exit(1);
});
