import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface ProfileStatsProps {
  views?: number;
  projects?: number;
  endorsements?: number;
}

export function ProfileStats({ views = 0, projects = 0, endorsements = 0 }: ProfileStatsProps) {
  const { language } = useLanguage();

  const stats = [
    {
      value: views,
      label: language === 'th' ? 'ผู้เข้าชม' : 'Views'
    },
    {
      value: projects,
      label: language === 'th' ? 'ผลงาน' : 'Projects'
    },
    {
      value: endorsements,
      label: language === 'th' ? 'การรับรอง' : 'Endorsements'
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-center"
        >
          <div className="text-xl sm:text-2xl font-bold text-red-500 mb-1">
            {stat.value.toLocaleString()}
          </div>
          <div className="text-xs sm:text-sm text-gray-400">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}