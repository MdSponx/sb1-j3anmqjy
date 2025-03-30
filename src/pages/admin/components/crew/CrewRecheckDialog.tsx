import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import { Button } from '../../../../components/ui/button';
import { X } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { useFirebase } from '../../../../contexts/firebase';
import { DocumentPreview } from '../approved/status/DocumentPreview';
import type { CrewApplication } from '../../types/application';

interface CrewRecheckDialogProps {
  isOpen: boolean;
  onClose: () => void;
  member: CrewApplication;
  onImageSelect: (url: string) => void;
  onUpdate?: () => void;
}

export function CrewRecheckDialog({
  isOpen,
  onClose,
  member,
  onImageSelect,
  onUpdate,
}: CrewRecheckDialogProps) {
  const { language } = useLanguage();
  const { db } = useFirebase();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    member_status: '',
    payment_status: '',
    verification_status: '',
  });

  useEffect(() => {
    if (member) {
      setFormData({
        member_status: member.member_status,
        payment_status: member.payment_status,
        verification_status: member.verification_status,
      });
    }
  }, [member]);

  const memberStatusOptions = [
    { value: 'ว่าที่สามัญ', labelTh: 'ว่าที่สามัญ', labelEn: 'Acting Regular' },
    { value: 'สามัญ', labelTh: 'สามัญ', labelEn: 'Regular' },
    { value: 'วิสามัญ', labelTh: 'วิสามัญ', labelEn: 'Associate' },
  ];

  const paymentStatusOptions = [
    { value: 'paid', labelTh: 'ชำระแล้ว', labelEn: 'Paid' },
    { value: 'pending', labelTh: 'รอตรวจสอบ', labelEn: 'Pending' },
    { value: 'not paid', labelTh: 'ยังไม่ชำระ', labelEn: 'Not Paid' },
  ];

  const verificationStatusOptions = [
    { value: 'approved', labelTh: 'อนุมัติแล้ว', labelEn: 'Approved' },
    { value: 'pending', labelTh: 'รอตรวจสอบ', labelEn: 'Pending' },
    { value: 'rejected', labelTh: 'ปฏิเสธ', labelEn: 'Rejected' },
  ];

  const handleStatusChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!member) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const userRef = doc(db, 'users', member.id);
      await updateDoc(userRef, {
        ...formData,
        updated_at: new Date().toISOString(),
      });
      onUpdate?.();
      onClose();
    } catch (err) {
      console.error('Error updating member status:', err);
      setError(
        language === 'th'
          ? 'เกิดข้อผิดพลาดในการอัพเดทสถานะ'
          : 'Error updating status'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">
            {language === 'th'
              ? 'ตรวจสอบข้อมูลทีมงาน'
              : 'Crew Member Information Check'}
          </DialogTitle>
        </DialogHeader>

        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <X className="h-5 w-5 text-gray-400" />
        </button>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400">
                {language === 'th' ? 'ชื่อ-นามสกุล' : 'Full Name'}
              </label>
              <p className="text-white">{member.fullname_th}</p>
            </div>
            <div>
              <label className="text-sm text-gray-400">
                {language === 'th' ? 'แผนก' : 'Department'}
              </label>
              <p className="text-white">
                {language === 'th' ? member.department_th : member.department_en}
              </p>
            </div>
          </div>

          {/* Status Selects */}
          <div className="grid grid-cols-3 gap-4">
            {/* Member Status */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">
                {language === 'th' ? 'ประเภทสมาชิก' : 'Member Status'}
              </label>
              <Select 
                value={formData.member_status} 
                onValueChange={(value) => handleStatusChange('member_status', value)}
              >
                <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder={language === 'th' ? 'เลือกประเภท' : 'Select type'} />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {memberStatusOptions.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white"
                    >
                      {language === 'th' ? option.labelTh : option.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Payment Status */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">
                {language === 'th' ? 'สถานะการชำระเงิน' : 'Payment Status'}
              </label>
              <Select 
                value={formData.payment_status} 
                onValueChange={(value) => handleStatusChange('payment_status', value)}
              >
                <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder={language === 'th' ? 'เลือกสถานะ' : 'Select status'} />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {paymentStatusOptions.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white"
                    >
                      {language === 'th' ? option.labelTh : option.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Verification Status */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">
                {language === 'th' ? 'สถานะการยืนยัน' : 'Verification Status'}
              </label>
              <Select 
                value={formData.verification_status} 
                onValueChange={(value) => handleStatusChange('verification_status', value)}
              >
                <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder={language === 'th' ? 'เลือกสถานะ' : 'Select status'} />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {verificationStatusOptions.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="text-white hover:bg-gray-700 focus:bg-gray-700 focus:text-white"
                    >
                      {language === 'th' ? option.labelTh : option.labelEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Document Preview */}
          <div className="grid grid-cols-2 gap-4">
            <DocumentPreview
              label={language === 'th' ? 'บัตรประชาชน' : 'ID Card'}
              imageUrl={member.id_card_image_url}
              onImageSelect={onImageSelect}
            />

            <DocumentPreview
              label={language === 'th' ? 'สลิปการโอน' : 'Payment Slip'}
              imageUrl={member.payment_slip_url}
              onImageSelect={onImageSelect}
            />
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-500/10 border border-red-500">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-600 w-24 h-8"
            >
              {language === 'th' ? 'ยกเลิก' : 'Cancel'}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-red-500 hover:bg-red-600 w-24 h-8"
            >
              {isSubmitting
                ? language === 'th'
                  ? 'กำลังบันทึก...'
                  : 'Saving...'
                : language === 'th'
                ? 'บันทึก'
                : 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}