import React from 'react';
import { CrewCard } from './CrewCard';
import { useLanguage } from '../../../../contexts/LanguageContext';
import type { CrewMember } from '../types';

interface CrewGalleryProps {
  members: CrewMember[];
}

export function CrewGallery({ members }: CrewGalleryProps) {
  const { language } = useLanguage();

  if (members.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">
          {language === 'th'
            ? 'ไม่พบทีมงานที่ตรงกับการค้นหา'
            : 'No crew members found matching your search'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {members.map((member) => (
        <CrewCard key={member.id} member={member} />
      ))}
    </div>
  );
}