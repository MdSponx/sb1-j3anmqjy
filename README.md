# sb1-j3anmqjy

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/MdSponx/sb1-j3anmqjy)

## Recent Updates

### 3/30/2025 - Email Notification Fix and Automation

Fixed and enhanced email notifications for director submissions:

- Problem: 
  - Emails were not being delivered when sent from admin@thaifilmdirectors.com
  - Email notifications weren't automatically triggered on user actions

- Solution: 
  - Modified the Cloud Function to use directorthaifilm@gmail.com as the sender with admin@thaifilmdirectors.com as the reply-to address
  - Added Firestore triggers to automatically send email notifications when specific events occur

- Implementation:
  - Updated the email configuration in functions/src/index.ts
  - Used directorthaifilm@gmail.com in the "from" field to ensure delivery
  - Added admin@thaifilmdirectors.com as the "replyTo" address
  - Maintained the Thai Film Directors Association display name for brand consistency
  - Added two new Cloud Functions with Firestore triggers:
    1. `onNewDirectorSignup`: Triggers when a new user with occupation="director" is created in the users collection
    2. `onDirectorStatusChange`: Triggers when a director's verification_status is changed by an admin

- Result: 
  - Admin users now receive email notifications automatically when new directors submit applications
  - Directors receive email notifications automatically when their application is approved or rejected
  - Fallback email addresses (jmdsponx@gmail.com and admin@thaifilmdirectors.com) are used if no admin users are found
