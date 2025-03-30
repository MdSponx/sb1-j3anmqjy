import React from 'react';
import { User } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { Member } from '../types/member';

interface MemberCardProps {
  member: Member;
}

export function MemberCard({ member }: MemberCardProps) {
  const { language } = useLanguage();

  const handleClick = () => {
    window.location.href = `/profile/public/${member.id}`;
  };

  return (
    <div 
      onClick={handleClick}
      className="group bg-gray-800 rounded-lg overflow-hidden hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
    >
      {/* Profile Image */}
      <div className="aspect-square relative">
        {member.profile_image_url ? (
          <img
            src={member.profile_image_url}
            alt={member.fullname_th}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-700">
            <User className="w-16 h-16 text-gray-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Member Info */}
      <div className="p-4">
        <h3 className="text-white font-medium mb-1 text-base sm:text-lg md:text-xl">
          {language === 'th' ? member.fullname_th : member.fullname_en}
        </h3>
        <p className="text-gray-400 text-sm sm:text-base md:text-lg">
          {language === 'th' ? member.nickname_th : member.nickname_en}
        </p>
      </div>
    </div>
  );
}