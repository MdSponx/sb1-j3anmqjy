import React from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './dialog';
import { Button } from './button';
import { useLanguage } from '../../contexts/LanguageContext';

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export function SuccessDialog({ 
  isOpen, 
  onClose,
  title,
  message
}: SuccessDialogProps) {
  const { language } = useLanguage();

  const defaultTitle = language === 'th' 
    ? 'บันทึกข้อมูลสำเร็จ' 
    : 'Update Successful';

  const defaultMessage = language === 'th'
    ? 'ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว'
    : 'Your information has been successfully updated';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title || defaultTitle}</DialogTitle>
        </DialogHeader>

        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <X className="h-5 w-5 text-gray-400" />
          <span className="sr-only">Close</span>
        </button>

        <div className="py-4">
          <p className="text-gray-300">
            {message || defaultMessage}
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600"
          >
            {language === 'th' ? 'ตกลง' : 'OK'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}