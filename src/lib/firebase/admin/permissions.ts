import { doc, getDoc } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

export async function checkAdminPermissions(db: Firestore, userId: string): Promise<boolean> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data();
    
    // Check for either token-based or role-based admin status
    return userData?.web_role === 'admin' || userData?.token?.admin === true;
  } catch (error) {
    console.error('Error checking admin permissions:', error);
    return false;
  }
}

export function getPermissionErrorMessage(error: any, language: 'th' | 'en'): string {
  if (error?.code === 'permission-denied') {
    return language === 'th'
      ? 'คุณไม่มีสิทธิ์ในการดำเนินการนี้ กรุณาติดต่อผู้ดูแลระบบ'
      : 'You do not have permission to perform this action. Please contact an administrator.';
  }
  
  return language === 'th'
    ? 'เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง'
    : 'An unexpected error occurred. Please try again.';
}