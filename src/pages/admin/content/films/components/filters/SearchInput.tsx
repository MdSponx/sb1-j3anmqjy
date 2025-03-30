import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../../../../../components/ui/input';
import { useLanguage } from '../../../../../../contexts/LanguageContext';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function SearchInput({ value, onChange, disabled }: SearchInputProps) {
  const { language } = useLanguage();

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={language === 'th' ? 'ค้นหาชื่อภาพยนตร์...' : 'Search movies...'}
        className="pl-10"
        disabled={disabled}
      />
    </div>
  );
}