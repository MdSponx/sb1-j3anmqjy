import React from 'react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { CameraAnimation } from '../../../../components/shared/CameraAnimation';

interface ContentCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  value: string | number;
  loading?: boolean;
  status?: string;
  href: string;
}

export function ContentCard({
  title,
  subtitle,
  icon,
  value,
  loading,
  status,
  href
}: ContentCardProps) {
  const { language } = useLanguage();

  return (
    <a 
      href={href}
      className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-6 hover:bg-gray-800/90 transition-colors"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-gray-800 rounded-lg">
          {icon}
        </div>
        {status && (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400">
            {status}
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold text-white mb-1">
        {title}
      </h3>
      <p className="text-sm text-gray-400 mb-4">
        {subtitle}
      </p>

      {loading ? (
        <div className="flex justify-center">
          <CameraAnimation />
        </div>
      ) : (
        <p className="text-3xl font-bold text-white">
          {typeof value === 'number' 
            ? value.toLocaleString(language === 'th' ? 'th-TH' : 'en-US')
            : value}
        </p>
      )}
    </a>
  );
}