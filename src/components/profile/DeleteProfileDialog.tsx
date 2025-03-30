import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '../ui/alert-dialog';
import { Input } from '../ui/input';
import { useLanguage } from '../../contexts/LanguageContext';

interface DeleteProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fullNameEn: string;
}

export function DeleteProfileDialog({
  isOpen,
  onClose,
  onConfirm,
  fullNameEn
}: DeleteProfileDialogProps) {
  const { language } = useLanguage();
  const [confirmText, setConfirmText] = useState('');
  const isValid = confirmText === fullNameEn;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-500">
            {language === 'th' 
              ? 'ยืนยันการลบโปรไฟล์' 
              : 'Confirm Profile Deletion'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <div className="space-y-4">
              <div className="text-gray-300">
                {language === 'th'
                  ? 'การดำเนินการนี้ไม่สามารถย้อนกลับได้ ข้อมูลทั้งหมดของคุณจะถูกลบออกจากระบบ'
                  : 'This action cannot be undone. All your data will be permanently deleted.'}
              </div>
              <div className="text-sm text-gray-400">
                {language === 'th'
                  ? `พิมพ์ชื่อ-นามสกุลภาษาอังกฤษของคุณ "${fullNameEn}" เพื่อยืนยันการลบ`
                  : `Type your full name in English "${fullNameEn}" to confirm deletion`}
              </div>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={fullNameEn}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {language === 'th' ? 'ยกเลิก' : 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={!isValid}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-700"
          >
            {language === 'th' ? 'ลบโปรไฟล์' : 'Delete Profile'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}