import React from 'react';
import { ArrowRight, Film } from 'lucide-react';
import { Director } from '../../types/director';
import { useLanguage } from '../../contexts/LanguageContext';

interface DirectorCardProps {
  director: Director;
}

export function DirectorCard({ director }: DirectorCardProps) {
  const { language } = useLanguage();

  return (
    <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">{director.name}</h3>
        <div className="flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-full">
          <Film className="h-4 w-4 text-red-500" />
          <span className="text-sm text-white">{director.totalWorks}</span>
        </div>
      </div>
      
      <div>
        <div className="space-y-2 mb-6">
          <p className="text-sm text-gray-400 mb-2">
            {language === 'th' ? 'ผลงานที่ผ่านมา' : 'Previous Works'}:
          </p>
          <div className="space-y-1.5">
            {director.movies.map((movie, index) => (
              <div 
                key={index} 
                className="flex items-start gap-2 text-gray-300 text-sm leading-tight"
              >
                <span className="text-red-500 mt-1">•</span>
                <span>{movie}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button 
        className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 
                 transition-colors text-sm font-medium"
      >
        {language === 'th' ? 'ดูรายละเอียด' : 'View Details'}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}