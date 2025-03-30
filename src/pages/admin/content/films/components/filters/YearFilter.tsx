import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../../../components/ui/select';
import { useLanguage } from '../../../../../../contexts/LanguageContext';

interface Movie {
  year_be: number;
  year_ce: number;
  // เพิ่ม properties อื่นๆ ตามต้องการ
}

interface YearFilterProps {
  value: string;
  onChange: (value: string) => void;
  onFilter: (filteredData: Movie[]) => void;
  data: Movie[];
  disabled?: boolean;
  className?: string;
}

export function YearFilter({ 
  value, 
  onChange,
  onFilter,
  data,
  disabled,
  className 
}: YearFilterProps) {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear() + 543; // Convert to BE
  const oldestYear = 2530; // Oldest year in DB
  const yearCount = currentYear - oldestYear + 1;
  const years = Array.from({ length: yearCount }, (_, i) => currentYear - i);

  // Handle year change and filtering
  const handleYearChange = (selectedYear: string) => {
    onChange(selectedYear);
    
    // Filter data based on selected year
    const filteredData = selectedYear === 'all' 
      ? data 
      : data.filter((item) => {
          const yearNumber = parseInt(selectedYear, 10);
          if (language === 'th') {
            return item.year_be === yearNumber;
          } else {
            return item.year_ce === yearNumber;
          }
        });
    
    onFilter(filteredData);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Select
        value={value}
        onValueChange={handleYearChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-32 sm:w-40 md:w-48 lg:w-56">
          <SelectValue placeholder={language === 'th' ? 'เลือกปี' : 'Select Year'} />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          <SelectItem value="all">
            {language === 'th' ? 'ทุกปี' : 'All Years'}
          </SelectItem>
          {years.map((year) => {
            const displayYear = language === 'th' ? year : year - 543;
            return (
              <SelectItem key={year} value={year.toString()}>
                {displayYear.toString()}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}