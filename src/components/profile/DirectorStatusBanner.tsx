import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Select } from '../ui/select';

interface DirectorStatusBannerProps {
  memberStatus?: string;
  paymentStatus?: string;
  verificationStatus?: string;
  onStatusChange: (field: string, value: string) => void;
}

export function DirectorStatusBanner({
  memberStatus = 'ว่าที่สามัญ',
  paymentStatus = 'not paid',
  verificationStatus = 'pending',
  onStatusChange
}: DirectorStatusBannerProps) {
  const { language } = useLanguage();

  const memberStatusOptions = [
    { value: 'ว่าที่สามัญ', label: language === 'th' ? 'ว่าที่สามัญ' : 'Acting Regular' },
    { value: 'สามัญ', label: language === 'th' ? 'สามัญ' : 'Regular' },
    { value: 'วิสามัญ', label: language === 'th' ? 'วิสามัญ' : 'Associate' }
  ];

  const paymentStatusOptions = [
    { value: 'not paid', label: language === 'th' ? 'ยังไม่ชำระ' : 'Not Paid' },
    { value: 'pending', label: language === 'th' ? 'รอตรวจสอบ' : 'Pending' },
    { value: 'paid', label: language === 'th' ? 'ชำระแล้ว' : 'Paid' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          {language === 'th' ? 'ประเภทสมาชิก' : 'Member Status'}
        </label>
        <Select
          value={memberStatus}
          onChange={(e) => onStatusChange('member_status', e.target.value)}
          className="w-full"
        >
          {memberStatusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          {language === 'th' ? 'สถานะการชำระเงิน' : 'Payment Status'}
        </label>
        <Select
          value={paymentStatus}
          onChange={(e) => onStatusChange('payment_status', e.target.value)}
          className="w-full"
        >
          {paymentStatusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          {language === 'th' ? 'สถานะการยืนยัน' : 'Verification Status'}
        </label>
        <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
          verificationStatus === 'approved' ? 'bg-green-500/10 text-green-400' :
          verificationStatus === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
          'bg-red-500/10 text-red-400'
        }`}>
          {verificationStatus === 'approved' 
            ? language === 'th' ? 'ยืนยันแล้ว' : 'Approved'
            : verificationStatus === 'pending'
            ? language === 'th' ? 'รอการยืนยัน' : 'Pending'
            : language === 'th' ? 'ไม่ผ่านการยืนยัน' : 'Rejected'}
        </div>
      </div>
    </div>
  );
}