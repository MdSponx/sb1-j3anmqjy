import React from 'react';
import { Select } from '../../../../../components/ui/select';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import type { MembershipStatus } from '../../../types/membership';

interface MembershipSelectProps {
  value: MembershipStatus;
  onChange: (value: MembershipStatus) => void;
  disabled?: boolean;
}

export function MembershipSelect({ value, onChange, disabled }: MembershipSelectProps) {
  const { language } = useLanguage();

  const options = [
    { value: 'ว่าที่สามัญ', labelTh: 'ว่าที่สามัญ', labelEn: 'Acting Regular' },
    { value: 'สามัญ', labelTh: 'สามัญ', labelEn: 'Regular' },
    { value: 'วิสามัญ', labelTh: 'วิสามัญ', labelEn: 'Associate' }
  ] as const;

  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value as MembershipStatus)}
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