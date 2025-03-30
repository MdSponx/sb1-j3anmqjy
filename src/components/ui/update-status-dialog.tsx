import React from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './dialog';
import { Button } from './button';
import { useLanguage } from '../../contexts/LanguageContext';

interface UpdateStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'success' | 'error';
  message?: string;
}

export function UpdateStatusDialog({ 
  isOpen, 
  onClose, 
  status, 
  message 
}: UpdateStatusDialogProps) {
  const { language } = useLanguage();

  const getTitle = () => {
    if (status === 'success') {
      return language === 'th' ? 'บันทึกข้อมูลสำเร็จ' : 'Update Successful';
    }
    return language === 'th' ? 'เกิดข้อผิดพลาด' : 'Update Failed';
  };

  const getDefaultMessage = () => {
    if (status === 'success') {
      return language === 'th'
        ? 'ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว'
        : 'Your information has been successfully updated';
    }
    return language === 'th'
      ? 'เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง'
      : 'An error occurred while saving. Please try again.';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {status === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            <span>{getTitle()}</span>
          </DialogTitle>
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
            {message || getDefaultMessage()}
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={onClose}
            className={status === 'success' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}
          >
            {language === 'th' ? 'ตกลง' : 'OK'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}