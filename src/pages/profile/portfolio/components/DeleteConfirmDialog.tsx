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
} from '../../../../components/ui/alert-dialog';
import { useLanguage } from '../../../../contexts/LanguageContext';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm
}: DeleteConfirmDialogProps) {
  const { language } = useLanguage();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {language === 'th' 
              ? 'ยืนยันการลบผลงาน' 
              : 'Confirm Delete Credit'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {language === 'th'
              ? 'คุณแน่ใจหรือไม่ที่จะลบผลงานนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้'
              : 'Are you sure you want to delete this credit? This action cannot be undone.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {language === 'th' ? 'ยกเลิก' : 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600"
          >
            {isDeleting
              ? language === 'th'
                ? 'กำลังลบ...'
                : 'Deleting...'
              : language === 'th'
              ? 'ลบ'
              : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}