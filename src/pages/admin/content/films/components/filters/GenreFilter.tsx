import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../../../components/ui/select';
import { useLanguage } from '../../../../../../contexts/LanguageContext';

interface GenreFilterProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const genres = [
  { en: 'Action', th: 'แอคชัน' },
  { en: 'Adventure', th: 'ผจญภัย' },
  { en: 'Animation', th: 'แอนิเมชัน' },
  { en: 'Biography', th: 'ชีวประวัติ' },
  { en: 'Comedy', th: 'ตลก' },
  { en: 'Crime', th: 'อาชญากรรม' },
  { en: 'Documentary', th: 'สารคดี' },
  { en: 'Drama', th: 'ดราม่า' },
  { en: 'Experimental', th: 'ทดลอง' },
  { en: 'Erotic', th: 'อีโรติก' },
  { en: 'Family', th: 'ครอบครัว' },
  { en: 'Fantasy', th: 'แฟนตาซี' },
  { en: 'Sci-Fi', th: 'ไซไฟ' },
  { en: 'Horror', th: 'สยองขวัญ' },
  { en: 'Musical', th: 'เพลง' },
  { en: 'Romance', th: 'โรแมนซ์' },
  { en: 'Romantic Comedy', th: 'โรแมนติกคอมเมดี้' },
  { en: 'Suspense', th: 'ระทึกขวัญ' },
  { en: 'TBC', th: 'รอการจัดประเภท' },
  { en: 'Thriller', th: 'ระทึกใจ' },
  { en: 'War', th: 'สงคราม' }
];

export function GenreFilter({ value, onChange, disabled }: GenreFilterProps) {
  const { language } = useLanguage();

  return (
    <Select onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={language === 'th' ? 'เลือกประเภท' : 'Select Genre'} />
      </SelectTrigger>
      <SelectContent>
        {genres.map((genre) => (
          <SelectItem key={genre.en} value={genre.en}>
            {language === 'th' ? genre.th : genre.en}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}