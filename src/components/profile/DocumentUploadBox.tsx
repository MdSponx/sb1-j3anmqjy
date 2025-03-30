import React, { useState } from 'react';
import { DocumentUpload } from './DocumentUpload';
import { UploadConfirmDialog } from './UploadConfirmDialog';
import { useLanguage } from '../../contexts/LanguageContext';

interface DocumentUploadBoxProps {
  type: 'id_card' | 'payment_slip';
  currentFile?: File;
  currentUrl?: string;
  onFileSelect: (file: File) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  uploadProgress?: number;
}

export function DocumentUploadBox({
  type,
  currentFile,
  currentUrl,
  onFileSelect,
  onConfirm,
  isLoading,
  uploadProgress
}: DocumentUploadBoxProps) {
  const { language } = useLanguage();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    onFileSelect(file);
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    onConfirm();
    setSelectedFile(null);
  };

  const getTitle = () => {
    if (type === 'id_card') {
      return language === 'th' ? 'บัตรประชาชน' : 'ID Card';
    }
    return language === 'th' ? 'สลิปการชำระเงิน' : 'Payment Slip';
  };

  const getDescription = () => {
    if (type === 'id_card') {
      return language === 'th'
        ? '1. ทางสมาคมจำเป็นต้องใช้ข้อมูลเพื่อป้องกันการแอบอ้างโพรไฟล์\n2. เราจะเก็บรักษาข้อมูลของท่านให้เป็นความลับ\n3. ข้อมูลจะถูกใช้เพื่อการยืนยันตัวตนเท่านั้น'
        : '1. We need this information to prevent profile impersonation\n2. Your data will be kept confidential\n3. Information will be used for verification only';
    }
    return language === 'th'
      ? 'กรุณาโอนเงิน 1,000 บาท มาที่บัญชี\nธ.กรุงเทพ 215-303-971-0\nชื่อบัญชี สมาคมผู้กำกับภาพยนตร์ไทย'
      : 'Please transfer 1,000 THB to:\nBangkok Bank 215-303-971-0\nAccount Name: Thai Film Director Association';
  };

  return (
    <>
      <div className="bg-gray-900 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-2">
          {getTitle()}
        </h3>
        <p className="text-sm text-gray-400 mb-4 whitespace-pre-line">
          {getDescription()}
        </p>
        <DocumentUpload
          id={type}
          label={language === 'th' 
            ? `อัพโหลด${type === 'id_card' ? 'บัตรประชาชน' : 'สลิปการชำระเงิน'}`
            : `Upload ${type === 'id_card' ? 'ID Card' : 'Payment Slip'}`}
          currentFile={currentFile}
          currentUrl={currentUrl}
          onFileSelect={handleFileSelect}
          isLoading={isLoading}
          uploadProgress={uploadProgress}
        />
      </div>

      <UploadConfirmDialog
        type={type}
        isOpen={showConfirmDialog}
        onConfirm={handleConfirm}
        onClose={() => setShowConfirmDialog(false)}
      />
    </>
  );
}