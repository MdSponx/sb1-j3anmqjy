import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { useLanguage } from '../../../contexts/LanguageContext';

interface YearFilterProps {
  selectedYear: string;
  years: string[];
  onYearChange: (year: string) => void;
  disabled?: boolean;
}

export function YearFilter({ selectedYear, years, onYearChange, disabled }: YearFilterProps) {
  const { language } = useLanguage();

  const formatYear = (year: string) => {
    if (year === 'all') {
      return language === 'th' ? 'ทุกปี' : 'All Years';
    }
    return language === 'th' 
      ? `พ.ศ. ${year}` 
      : `${year} CE`;
  };

  return (
    <Select
      value={selectedYear}
      onValueChange={onYearChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-full bg-gray-800 border-gray-700">
        <SelectValue placeholder={language === 'th' ? 'เลือกปี' : 'Select Year'}>
          {formatYear(selectedYear)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          {language === 'th' ? 'ทุกปี' : 'All Years'}
        </SelectItem>
        {years.map((year) => (
          <SelectItem key={year} value={year}>
            {formatYear(year)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}