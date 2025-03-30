import React from 'react';
import { Search, X } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';

interface EventsHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function EventsHeader({
  searchQuery,
  onSearchChange,
}: EventsHeaderProps) {
  const { language } = useLanguage();
  const today = new Date();

  const monthNames = {
    th: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  };

  const month = language === 'th' ? monthNames.th[today.getMonth()] : monthNames.en[today.getMonth()];
  const year = language === 'th' ? today.getFullYear() + 543 : today.getFullYear();

  return (
    <div className="flex flex-col space-y-6">
      {/* Title and Calendar Row */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {language === 'th' ? 'กิจกรรมที่กำลังจะมาถึง' : 'Upcoming Events'}
          </h2>
          <p className="text-gray-400">
            {language === 'th' 
              ? 'ค้นหากิจกรรมที่น่าสนใจได้ที่นี่' 
              : 'Find interesting events here'}
          </p>
        </div>

        {/* Calendar Box */}
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <div className="bg-red-600 px-4 py-1">
            <p className="text-white text-sm font-medium text-center">{month}</p>
          </div>
          <div className="px-4 py-2 text-center">
            <p className="text-2xl font-bold text-white">{today.getDate()}</p>
            <p className="text-xs text-gray-400">{year}</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={language === 'th' ? 'ค้นหากิจกรรม...' : 'Search events...'}
          className="w-full pl-12 pr-12 py-3 bg-gray-800 text-white rounded-lg 
                   border border-gray-600 focus:border-red-500
                   placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 
                     hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}