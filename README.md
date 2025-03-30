# sb1-j3anmqjy

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/MdSponx/sb1-j3anmqjy)

## Recent Updates

### 3/30/2025 - Email Notification Fix

Fixed an issue with email notifications for new director submissions:

- Problem: Emails were not being delivered when sent from admin@thaifilmdirectors.com
- Solution: Modified the Cloud Function to use the Gmail account as the sender with admin@thaifilmdirectors.com as the reply-to address
- Implementation:
  - Updated the email configuration in functions/src/index.ts
  - Used the authenticated Gmail account in the "from" field to ensure delivery
  - Added admin@thaifilmdirectors.com as the "replyTo" address
  - Maintained the Thai Film Directors Association display name for brand consistency
- Result: Admin users now receive email notifications when new directors submit applications
