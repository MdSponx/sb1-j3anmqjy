import React from 'react';
import { format, parseISO, isValid } from 'date-fns';
import { th } from 'date-fns/locale';
import { MapPin, Clock } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import type { Event } from '../../../../types/event';

interface EventCardProps {
  event: Event;
  onDetailsClick: () => void;
  isSelected?: boolean;
}

export function EventCard({ event, onDetailsClick, isSelected }: EventCardProps) {
  const { language } = useLanguage();

  // Safely format the date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return null;
    
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) {
        console.error('Invalid date:', dateString);
        return null;
      }
      
      return {
        day: format(date, 'd'),
        month: format(date, 'MMM', {
          locale: language === 'th' ? th : undefined
        }),
        year: format(date, 'yyyy', {
          locale: language === 'th' ? th : undefined
        })
      };
    } catch (error) {
      console.error('Error formatting date:', error);
      return null;
    }
  };

  const dateInfo = formatDate(event.date);

  return (
    <div 
      onClick={onDetailsClick}
      className={`
        bg-gray-800 rounded-lg overflow-hidden flex h-40 cursor-pointer
        transform transition-all duration-300
        ${isSelected ? 'ring-2 ring-red-500 bg-gray-700 scale-[1.02]' : 'hover:bg-gray-700'}
      `}
    >
      {/* Date Sidebar */}
      <div className="w-24 bg-red-600 text-white flex flex-col items-center justify-center py-4 flex-shrink-0">
        {dateInfo ? (
          <>
            <span className="text-3xl font-bold">{dateInfo.day}</span>
            <span className="text-sm mt-1">{dateInfo.month}</span>
            <span className="text-xs opacity-75">{dateInfo.year}</span>
          </>
        ) : (
          <span className="text-sm">TBA</span>
        )}
      </div>

      {/* Event Image */}
      <div className="w-40 flex-shrink-0 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className={`
            w-full h-40 object-cover transition-all duration-500
            ${isSelected ? 'grayscale-0' : 'grayscale hover:grayscale-0'}
          `}
        />
      </div>

      {/* Event Details */}
      <div className="flex-1 p-4">
        <h3 className="text-xl font-bold text-white mb-2">
          {event.title}
        </h3>

        <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{event.venue}</span>
          </div>
          {event.time && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{event.time}</span>
            </div>
          )}
        </div>

        <p className="text-gray-300 text-sm line-clamp-2">
          {event.description}
        </p>
      </div>
    </div>
  );
}