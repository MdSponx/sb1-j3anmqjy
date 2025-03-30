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

interface RemoveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  userEmail: string;
  fullname_th?: string;
  fullname_en?: string;
  currentRole: string;
  isProcessing: boolean;
}

export function RemoveDialog({
  isOpen,
  onClose,
  onConfirm,
  userEmail,
  fullname_th,
  fullname_en,
  currentRole,
  isProcessing
}: RemoveDialogProps) {
  const { language } = useLanguage();

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-gray-900 border border-gray-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg text-purple-400">
            {language === 'th' ? 'ยืนยันการลบสิทธิ์' : 'Confirm Role Removal'}
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
                {language === 'th' ? 'สิทธิ์ปัจจุบัน: ' : 'Current Role: '}
              </span>
              <span className="font-medium text-white">{currentRole}</span>
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
             className="bg-purple-600 text-white hover:bg-purple-700"
            onClick={handleConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {language === 'th' ? 'กำลังดำเนินการ...' : 'Processing...'}
              </span>
            ) : (
              language === 'th' ? 'ยืนยัน' : 'Confirm'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}