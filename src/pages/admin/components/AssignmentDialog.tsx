import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '../../../components/ui/alert-dialog';
import { useLanguage } from '../../../contexts/LanguageContext';

import { Loader2 } from 'lucide-react';

interface AssignmentConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  userEmail: string;
  selectedRole: string;
  isProcessing: boolean;
  fullname_th?: string; // เพิ่มเข้ามา
  fullname_en?: string; // เพิ่มเข้ามา
  occupation?: string; // เพิ่มเข้ามา
}

export function AssignmentConfirm({
  isOpen,
  onClose,
  onConfirm,
  userEmail,
  selectedRole,
  isProcessing,
  fullname_th,
  fullname_en,
  occupation,
}: AssignmentConfirmProps) {
  const { language } = useLanguage();

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  const getRoleTranslation = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return language === 'th' ? 'ผู้ดูแลระบบ' : 'Administrator';
      case 'editor':
        return language === 'th' ? 'ผู้จัดการข้อมูล' : 'Editor';
      case 'blogger':
        return language === 'th' ? 'นักเขียนบลอก' : 'Blogger';
      default:
        return role;
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-gray-900 border border-gray-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg text-white">
            {language === 'th'
              ? 'ยืนยันการเพิ่มสิทธิ์'
              : 'Confirm Role Assignment'}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2 text-gray-300">
            <div>
              <span className="text-gray-400">
                {language === 'th' ? 'ชื่อ-นามสกุล: ' : 'Full Name: '}
              </span>
              <span className="font-medium text-white">
                {language === 'th' ? fullname_th || '-' : fullname_en || '-'}
              </span>
            </div>
            <div>
              <span className="text-gray-400">
                {language === 'th' ? 'อีเมล: ' : 'Email: '}
              </span>
              <span className="font-medium text-white">{userEmail}</span>
            </div>
            <div>
              <span className="text-gray-400">
                {language === 'th' ? 'อาชีพ: ' : 'Occupation: '}
              </span>
              <span className="font-medium text-white">
                {occupation || '-'}
              </span>
            </div>
            <div>
              <span className="text-gray-400">
                {language === 'th'
                  ? 'สิทธิ์ที่จะได้รับ: '
                  : 'Role to be assigned: '}
              </span>
              <span className="font-medium text-white">
                {getRoleTranslation(selectedRole)}
              </span>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="bg-gray-800 text-white hover:bg-gray-700"
            disabled={isProcessing}
          >
            {language === 'th' ? 'ยกเลิก' : 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={handleConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {language === 'th' ? 'กำลังดำเนินการ...' : 'Processing...'}
              </span>
            ) : language === 'th' ? (
              'ยืนยัน'
            ) : (
              'Confirm'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
