import React from 'react';
import { User } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface CastContainerProps {
  cast: string;
}

export function CastContainer({ cast }: CastContainerProps) {
  const { language } = useLanguage();
  
  if (!cast) return null;

  // Split cast string by commas and clean up whitespace
  const castMembers = cast.split(',').map(member => member.trim());

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-sm font-medium text-gray-400 mb-4">
        {language === 'th' ? 'นักแสดง' : 'Cast'}
      </h3>
      <div className="space-y-3">
        {castMembers.map((member, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500" />
            </div>
            <span className="text-white">{member}</span>
          </div>
        ))}
      </div>
    </div>
  );
}