import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select } from '../ui/select';

interface EducationalInfoFormProps {
  values: {
    institute_name?: string;
    education_type?: string;
  };
  onChange: (field: string, value: string) => void;
}

export function EducationalInfoForm({ values, onChange }: EducationalInfoFormProps) {
  const { language } = useLanguage();

  const educationTypes = [
    { value: 'high_school', labelTh: 'มัธยมศึกษา', labelEn: 'School' },
    { value: 'university', labelTh: 'มหาวิทยาลัย', labelEn: 'University' },
    { value: 'vocational', labelTh: 'ปวช.', labelEn: 'Vocational Certificate' },
    { value: 'high_vocational', labelTh: 'ปวส.', labelEn: 'High Vocational Certificate' }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">
        {language === 'th' ? 'ข้อมูลการศึกษา' : 'Educational Information'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="institute_name" required>
            {language === 'th' ? 'ชื่อสถาบัน' : 'Institute Name'}
          </Label>
          <Input
            id="institute_name"
            value={values.institute_name || ''}
            onChange={(e) => onChange('institute_name', e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="education_type" required>
            {language === 'th' ? 'ระดับการศึกษา' : 'Education Level'}
          </Label>
          <Select
            id="education_type"
            value={values.education_type || ''}
            onChange={(e) => onChange('education_type', e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
            required
          >
            <option value="">
              {language === 'th' ? '-- เลือกระดับการศึกษา --' : '-- Select Education Level --'}
            </option>
            {educationTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {language === 'th' ? type.labelTh : type.labelEn}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}