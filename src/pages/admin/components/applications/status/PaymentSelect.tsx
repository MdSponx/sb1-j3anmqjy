import React from 'react';
import { Select } from '../../../../../components/ui/select';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import type { PaymentStatus } from '../../../types/application';

interface PaymentSelectProps {
  value: PaymentStatus;
  onChange: (value: PaymentStatus) => void;
  disabled?: boolean;
}

export function PaymentSelect({ value, onChange, disabled }: PaymentSelectProps) {
  const { language } = useLanguage();

  const options = [
    { value: 'pending', labelTh: 'รอตรวจสอบ', labelEn: 'Pending' },
    { value: 'paid', labelTh: 'ชำระแล้ว', labelEn: 'Paid' },
    { value: 'not paid', labelTh: 'ยังไม่ชำระ', labelEn: 'Not Paid' }
  ] as const;

  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value as PaymentStatus)}
      disabled={disabled}
      className="bg-gray-700 border-gray-600 text-white"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {language === 'th' ? option.labelTh : option.labelEn}
        </option>
      ))}
    </Select>
  );
}