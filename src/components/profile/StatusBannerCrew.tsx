import React from 'react';
import { User, Building2, Film, Crown } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface StatusBannerCrewProps {
  occupation?: string;
  department_th?: string;
  department_en?: string;
  role_th?: string;
  role_en?: string;
  planSelection?: string;
  onRoleClick?: () => void;
}

export function StatusBannerCrew({ 
  occupation,
  department_th,
  department_en,
  role_th,
  role_en,
  planSelection,
  onRoleClick
}: StatusBannerCrewProps) {
  const { language } = useLanguage();

  const StatusBox = ({ 
    icon: Icon, 
    title, 
    value, 
    description,
    valueColor = 'text-white',
    onClick,
    clickable = false
  }: {
    icon: React.ElementType;
    title: string;
    value: string;
    description?: string;
    valueColor?: string;
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
      <p className={`text-base font-medium ${valueColor} mb-1`}>{value}</p>
      {description && (
        <p className="text-[10px] leading-tight text-gray-400">{description}</p>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-4 gap-2">
      {/* Occupation */}
      <StatusBox
        icon={User}
        title={language === 'th' ? 'อาชีพ' : 'Occupation'}
        value={occupation || '-'}
      />

      {/* Department */}
      <StatusBox
        icon={Building2}
        title={language === 'th' ? 'แผนก' : 'Department'}
        value={language === 'th' ? department_th || '-' : department_en || '-'}
      />

      {/* Role */}
      <StatusBox
        icon={Film}
        title={language === 'th' ? 'ตำแหน่ง' : 'Role'}
        value={language === 'th' ? role_th || '-' : role_en || '-'}
        description={language === 'th' ? 'คลิกเพื่อแก้ไขตำแหน่งงาน' : 'Click to edit your work'}
        onClick={onRoleClick}
        clickable={true}
      />

      {/* Plan */}
      <StatusBox
        icon={Crown}
        title={language === 'th' ? 'แพ็คเกจ' : 'Plan'}
        value={planSelection || '-'}
      />
    </div>
  );
}