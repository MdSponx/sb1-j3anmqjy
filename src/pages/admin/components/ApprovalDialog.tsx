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

interface ApprovalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  memberName?: string;
}

export function ApprovalDialog({
  isOpen,
  onClose,
  onConfirm,
  memberName
}: ApprovalDialogProps) {
  const { language } = useLanguage();

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {language === 'th' 
              ? 'ยืนยันการอนุมัติสมาชิก' 
              : 'Confirm Member Approval'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {language === 'th'
              ? `คุณต้องการอนุมัติสมาชิกภาพของ ${memberName} ใช่หรือไม่?`
              : `Are you sure you want to approve ${memberName}'s membership?`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {language === 'th' ? 'ยกเลิก' : 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-green-500 hover:bg-green-600">
            {language === 'th' ? 'อนุมัติ' : 'Approve'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}