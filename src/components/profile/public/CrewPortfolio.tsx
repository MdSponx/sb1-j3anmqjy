import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Building2 } from 'lucide-react';

interface CrewPortfolioProps {
  department?: string;
  role?: string;
}

export function CrewPortfolio({ department, role }: CrewPortfolioProps) {
  const { language } = useLanguage();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">
          {language === 'th' ? 'ข้อมูลวิชาชีพ' : 'Professional Information'}
        </h2>

        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-700 rounded-lg">
              <Building2 className="w-6 h-6 text-red-500" />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-gray-400 mb-1">
                  {language === 'th' ? 'แผนก' : 'Department'}
                </h3>
                <p className="text-lg text-white">{department || '-'}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-400 mb-1">
                  {language === 'th' ? 'ตำแหน่ง' : 'Role'}
                </h3>
                <p className="text-lg text-white">{role || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}