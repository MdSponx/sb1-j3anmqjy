import React from 'react';
import { useLanguage } from '../../../../../contexts/LanguageContext';

export function TableHeader() {
  const { language } = useLanguage();

  return (
    <thead>
      <tr className="border-b border-gray-700">
        <th className="py-3 px-4 text-gray-400 font-medium">
          {language === 'th' ? 'รูปโปรไฟล์' : 'Profile'}
        </th>
        <th className="py-3 px-4 text-gray-400 font-medium">
          {language === 'th' ? 'ชื่อ-นามสกุล' : 'Full Name'}
        </th>
        <th className="py-3 px-4 text-gray-400 font-medium">
          {language === 'th' ? 'อีเมล' : 'Email'}
        </th>
        <th className="py-3 px-4 text-gray-400 font-medium">
          {language === 'th' ? 'เบอร์โทรศัพท์' : 'Phone'}
        </th>
        <th className="py-3 px-4 text-gray-400 font-medium">
          {language === 'th' ? 'ประเภทสมาชิก' : 'Member Type'}
        </th>
        <th className="py-3 px-4 text-gray-400 font-medium">
          {language === 'th' ? 'สถานะการชำระเงิน' : 'Payment Status'}
        </th>
      </tr>
    </thead>
  );
}