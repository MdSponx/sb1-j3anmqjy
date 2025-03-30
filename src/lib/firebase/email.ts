interface ApprovalEmailParams {
  to: string;
  name: string;
  occupation: string;
  language: 'th' | 'en';
}

export async function sendApprovalEmail({ to, name, occupation, language }: ApprovalEmailParams) {
  try {
    const response = await fetch('https://us-central1-tfda-member-list.cloudfunctions.net/sendApprovalEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        name,
        occupation,
        language
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send approval email');
    }

    return true;
  } catch (error) {
    console.error('Error sending approval email:', error);
    throw error;
  }
}