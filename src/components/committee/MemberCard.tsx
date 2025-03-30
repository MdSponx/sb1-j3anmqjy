import React from 'react';
import { User } from 'lucide-react';
import { CommitteeMember } from '../../types/committee';

interface MemberCardProps {
  member: CommitteeMember;
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden transform transition-transform hover:scale-105">
      <div className="aspect-square relative">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="w-full h-full object-cover transition-opacity duration-300"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.opacity = '0';
              setTimeout(() => {
                target.src = ''; // Clear the src to show fallback
                target.style.opacity = '1';
              }, 300);
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-700">
            <User className="w-1/3 h-1/3 text-gray-500" />
          </div>
        )}
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="text-white font-medium text-base sm:text-lg md:text-xl mb-1 line-clamp-1">
          {member.name}
        </h3>
        <p className="text-red-500 text-sm sm:text-base line-clamp-1">
          {member.position}
        </p>
      </div>
    </div>
  );
}