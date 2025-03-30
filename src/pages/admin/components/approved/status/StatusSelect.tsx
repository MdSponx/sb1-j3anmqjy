import React from 'react';
import { Select } from '../../../../../components/ui/select';
import { useLanguage } from '../../../../../contexts/LanguageContext';

interface Option {
  value: string;
  labelTh: string;
  labelEn: string;
}

interface StatusSelectProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}

export function StatusSelect({ label, value, options, onChange }: StatusSelectProps) {
  const { language } = useLanguage();

  return (
    <div>
      <label className="text-sm text-gray-400 mb-1 block">
        {label}
      </label>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {language === 'th' ? option.labelTh : option.labelEn}
          </option>
        ))}
      </Select>
    </div>
  );
}