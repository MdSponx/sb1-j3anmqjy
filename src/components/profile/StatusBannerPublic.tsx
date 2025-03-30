import React from 'react';
import { Crown, User, ArrowUpCircle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface StatusBannerPublicProps {
  occupation?: string;
  planSelection?: string;
}

export function StatusBannerPublic({ occupation, planSelection }: StatusBannerPublicProps) {
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

  const handleUpgrade = () => {
    window.location.href = '/register';
  };

  const StatusBox = ({ 
    icon: Icon, 
    title, 
    value,
    onClick,
    clickable = false
  }: {
    icon: React.ElementType;
    title: string;
    value: string;
    onClick?: () => void;
    clickable?: boolean;
  }) => (
    <div 
      className={`bg-gray-800 rounded-lg p-4 flex-1 ${clickable ? 'cursor-pointer hover:bg-gray-700 transition-colors' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-5 h-5 text-red-500" />
        <h3 className="text-sm text-gray-400">{title}</h3>
      </div>
      <p className="text-base font-medium text-white">{value}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-3 gap-2">
      <StatusBox
        icon={Crown}
        title={language === 'th' ? 'แพ็คเกจ' : 'Plan'}
        value={planSelection || 'Public'}
      />
      <StatusBox
        icon={User}
        title={language === 'th' ? 'สถานะ' : 'Status'}
        value={getOccupationDisplay(occupation)}
      />
      <StatusBox
        icon={ArrowUpCircle}
        title={language === 'th' ? 'อัพเกรดแพ็คเกจ' : 'Upgrade Plan'}
        value={language === 'th' ? 'คลิกเพื่ออัพเกรด' : 'Click to Upgrade'}
        onClick={handleUpgrade}
        clickable={true}
      />
    </div>
  );
}