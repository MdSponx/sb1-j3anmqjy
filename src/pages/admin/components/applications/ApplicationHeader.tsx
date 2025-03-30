import React from 'react';
import { User, Mail, Phone, Film } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import type { DirectorApplication } from '../../types/application';

interface ApplicationHeaderProps {
  application: DirectorApplication;
  onImageSelect?: (url: string) => void;
  onPortfolioClick?: () => void;
  isLoadingPortfolio?: boolean;
}

export function ApplicationHeader({ 
  application, 
  onImageSelect,
  onPortfolioClick,
  isLoadingPortfolio
}: ApplicationHeaderProps) {
  const { language } = useLanguage();

  const handleImageClick = () => {
    if (application.profile_image_url && onImageSelect) {
      onImageSelect(application.profile_image_url);
    }
  };

  return (
    <div className="relative aspect-square">
      <div 
        className="w-full h-full cursor-pointer"
        onClick={handleImageClick}
      >
        {application.profile_image_url ? (
          <img
            src={application.profile_image_url}
            alt={application.fullname_th}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            <User className="w-20 h-20 text-gray-600" />
          </div>
        )}
      </div>

      {/* Contact and Portfolio Actions */}
      <div className="absolute top-4 right-4 flex gap-2">
        {application.email && (
          <a
            href={`mailto:${application.email}`}
            className="p-2 rounded-lg bg-black/50 hover:bg-black/70 text-white transition-colors"
            title={application.email}
          >
            <Mail className="w-4 h-4" />
          </a>
        )}
        {application.phone && (
          <a
            href={`tel:${application.phone}`}
            className="p-2 rounded-lg bg-black/50 hover:bg-black/70 text-white transition-colors"
            title={application.phone}
          >
            <Phone className="w-4 h-4" />
          </a>
        )}
        <button
          onClick={onPortfolioClick}
          disabled={isLoadingPortfolio}
          className={`p-2 rounded-lg bg-black/50 hover:bg-black/70 text-white transition-colors ${
            isLoadingPortfolio ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title={language === 'th' ? 'ผลงาน' : 'Portfolio'}
        >
          <Film className="w-4 h-4" />
        </button>
      </div>

      {/* Name and Info */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
        <h3 className="text-lg font-medium text-white">
          {application.fullname_th}
        </h3>
      </div>
    </div>
  );
}