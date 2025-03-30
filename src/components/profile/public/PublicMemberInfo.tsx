import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { User } from 'lucide-react';

interface PublicMemberInfoProps {
  occupation?: string;
  planSelection?: string;
}

export function PublicMemberInfo({ occupation, planSelection }: PublicMemberInfoProps) {
  const { language } = useLanguage();

  const getOccupationDisplay = (occupation?: string) => {
    if (!occupation) return '-';

    switch (occupation) {
      case 'school student':
        return language === 'th' ? 'นักเรียน' : 'School Student';
      case 'college student':
        return language === 'th' ? 'นิสิตนักศึกษา' : 'College Student';
      case 'general people':
        return language === 'th' ? 'ประชาชนทั่วไป' : 'General Public';
      default:
        return occupation;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">
          {language === 'th' ? 'ข้อมูลสมาชิก' : 'Member Information'}
        </h2>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-700 rounded-lg">
              <User className="w-6 h-6 text-red-500" />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-gray-400 mb-1">
                  {language === 'th' ? 'สถานะ' : 'Status'}
                </h3>
                <p className="text-lg text-white">{getOccupationDisplay(occupation)}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 mb-1">
                  {language === 'th' ? 'แพ็คเกจ' : 'Plan'}
                </h3>
                <p className="text-lg text-white">{planSelection || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}