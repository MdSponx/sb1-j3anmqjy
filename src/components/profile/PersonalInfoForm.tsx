import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface PersonalInfoFormProps {
  values: {
    fullname_th?: string;
    fullname_en?: string;
    nickname_th?: string;
    nickname_en?: string;
    birthdate?: string;
    gender?: string;
  };
  onChange: (field: string, value: string) => void;
}

export function PersonalInfoForm({ values, onChange }: PersonalInfoFormProps) {
  const { language } = useLanguage();

  const genderOptions = [
    { value: 'male', label: language === 'th' ? 'ชาย' : 'Male' },
    { value: 'female', label: language === 'th' ? 'หญิง' : 'Female' },
    { value: 'other', label: language === 'th' ? 'อื่นๆ' : 'Other' }
  ];

  const formValues = {
    fullname_th: values.fullname_th || '',
    fullname_en: values.fullname_en || '',
    nickname_th: values.nickname_th || '',
    nickname_en: values.nickname_en || '',
    birthdate: values.birthdate || '',
    gender: values.gender || 'male'
  };

  const RequiredLabel = ({ htmlFor, children }: { htmlFor: string, children: React.ReactNode }) => (
    <Label htmlFor={htmlFor}>
      {children} <span className="text-red-500">*</span>
    </Label>
  );

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">
        {language === 'th' ? 'ข้อมูลส่วนตัว' : 'Personal Information'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <RequiredLabel htmlFor="fullname_th">
            {language === 'th' ? 'ชื่อ-นามสกุล (ภาษาไทย)' : 'Full Name (Thai)'}
          </RequiredLabel>
          <Input
            id="fullname_th"
            value={formValues.fullname_th}
            onChange={(e) => onChange('fullname_th', e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
            required
          />
        </div>

        <div className="space-y-2">
          <RequiredLabel htmlFor="fullname_en">
            {language === 'th' ? 'ชื่อ-นามสกุล (ภาษาอังกฤษ)' : 'Full Name (English)'}
          </RequiredLabel>
          <Input
            id="fullname_en"
            value={formValues.fullname_en}
            onChange={(e) => onChange('fullname_en', e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
            required
          />
        </div>

        <div className="space-y-2">
          <RequiredLabel htmlFor="nickname_th">
            {language === 'th' ? 'ชื่อเล่น (ภาษาไทย)' : 'Nickname (Thai)'}
          </RequiredLabel>
          <Input
            id="nickname_th"
            value={formValues.nickname_th}
            onChange={(e) => onChange('nickname_th', e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
            required
          />
        </div>

        <div className="space-y-2">
          <RequiredLabel htmlFor="nickname_en">
            {language === 'th' ? 'ชื่อเล่น (ภาษาอังกฤษ)' : 'Nickname (English)'}
          </RequiredLabel>
          <Input
            id="nickname_en"
            value={formValues.nickname_en}
            onChange={(e) => onChange('nickname_en', e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
            required
          />
        </div>

        <div className="space-y-2">
          <RequiredLabel htmlFor="birthdate">
            {language === 'th' ? 'วันเกิด' : 'Birth Date'}
          </RequiredLabel>
          <Input
            id="birthdate"
            type="date"
            value={formValues.birthdate}
            onChange={(e) => onChange('birthdate', e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">
            {language === 'th' ? 'เพศ' : 'Gender'}
          </Label>
          <Select
            value={formValues.gender}
            onValueChange={(value) => onChange('gender', value)}
          >
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {genderOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-white hover:bg-gray-700"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}