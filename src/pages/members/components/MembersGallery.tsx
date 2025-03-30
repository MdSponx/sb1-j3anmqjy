import React from 'react';
import { MemberCard } from './MemberCard';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { Member } from '../types/member';

interface MembersGalleryProps {
  members: Member[];
}

export function MembersGallery({ members }: MembersGalleryProps) {
  const { language } = useLanguage();

  if (members.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">
          {language === 'th'
            ? 'ไม่พบสมาชิกที่ตรงกับการค้นหา'
            : 'No members found matching your search'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {members.map((member) => (
        <MemberCard key={member.id} member={member} />
      ))}
    </div>
  );
}