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
} from '../ui/alert-dialog';
import { useLanguage } from '../../contexts/LanguageContext';

interface UploadConfirmDialogProps {
  type: 'id_card' | 'payment_slip';
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function UploadConfirmDialog({
  type,
  isOpen,
  onConfirm,
  onClose
}: UploadConfirmDialogProps) {
  const { language } = useLanguage();
  const [consentChecked, setConsentChecked] = React.useState(false);

  const getTitle = () => {
    if (type === 'id_card') {
      return language === 'th' 
        ? 'ยืนยันข้อมูลบัตรประชาชน'
        : 'Confirm ID Card Information';
    }
    return language === 'th'
      ? 'ยืนยันการชำระเงิน'
      : 'Confirm Payment';
  };

  const getDescription = () => {
    if (type === 'id_card') {
      return language === 'th'
        ? 'ข้าพเจ้าขอยืนยันว่าเป็นเอกสารของตนเอง และอนุญาตให้เว็บไซต์ TFDA เก็บรักษาข้อมูลบัตรประชาชนเพื่อใช้ในการยืนยันตัวตนเท่านั้น'
        : 'I confirm that this is my own document and Allow TFDA website to store ID card information for verification purposes only';
    }
    return language === 'th'
      ? 'หลังจากอัพโหลดสลิปการโอนเงิน เจ้าหน้าที่จะตรวจสอบและยืนยันการชำระเงินภายใน 24 ชั่วโมง'
      : 'After uploading the payment slip, staff will verify the payment within 24 hours';
  };

  const getConsentText = () => {
    if (type === 'id_card') {
      return language === 'th'
        ? 'ข้าพเจ้ายินยอมให้เว็บไซต์ TFDA จัดเก็บและใช้ข้อมูลบัตรประชาชนเพื่อการยืนยันตัวตนเท่านั้น'
        : 'I consent to TFDA website storing and using my ID card information for verification purposes only';
    }
    return language === 'th'
      ? 'ข้าพเจ้ายืนยันว่าได้ชำระเงินตามจำนวนที่กำหนดและรอการตรวจสอบจากเจ้าหน้าที่'
      : 'I confirm that I have paid the specified amount and await staff verification';
  };

  const handleConfirm = () => {
    if (consentChecked) {
      onConfirm();
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{getTitle()}</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-400">
            {getDescription()}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex items-start my-4">
          <input
            type="checkbox"
            id="consent"
            checked={consentChecked}
            onChange={(e) => setConsentChecked(e.target.checked)}
            className="mt-1"
          />
          <label htmlFor="consent" className="ml-2 text-sm text-gray-400">
            {getConsentText()}
          </label>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            {language === 'th' ? 'ยกเลิก' : 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!consentChecked}
            className="bg-red-500 hover:bg-red-600"
          >
            {language === 'th' ? 'ยืนยัน' : 'Confirm'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}