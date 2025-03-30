import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek, parseISO, isBefore, isAfter, isValid } from 'date-fns';
import { th } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../../../contexts/LanguageContext';
import type { Event } from '../../../../types/event';

interface EventCalendarProps {
  events: Event[];
  selectedEvent: Event | null;
  onEventSelect: (event: Event) => void;
}

export function EventCalendar({ events, selectedEvent, onEventSelect }: EventCalendarProps) {
  const { language } = useLanguage();
  const [currentDate, setCurrentDate] = React.useState(new Date());

  // Get days for the calendar grid including previous/next month days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  // Get all days for the calendar grid
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Navigation handlers
  const previousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const nextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  // Safely parse date string
  const safeParseDate = (dateString: string): Date | null => {
    try {
      const date = parseISO(dateString);
      return isValid(date) ? date : null;
    } catch (error) {
      console.error('Error parsing date:', dateString);
      return null;
    }
  };

  // Get events for each day
  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventStartDate = safeParseDate(event.date);
      const eventEndDate = event.endDate ? safeParseDate(event.endDate) : eventStartDate;
      
      if (!eventStartDate || !eventEndDate) return false;
      
      return (
        (isSameDay(date, eventStartDate) || isAfter(date, eventStartDate)) &&
        (isSameDay(date, eventEndDate) || isBefore(date, eventEndDate))
      );
    });
  };

  // Calculate event span
  const getEventSpan = (event: Event, dayIndex: number) => {
    if (!event.endDate) return 1;
    
    const startDate = safeParseDate(event.date);
    const endDate = safeParseDate(event.endDate);
    
    if (!startDate || !endDate) return 1;
    
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Limit span to remaining days in week
    const daysLeftInWeek = 7 - (dayIndex % 7);
    return Math.min(daysDiff, daysLeftInWeek);
  };

  // Check if a date is the start date of an event
  const isEventStartDate = (date: Date, event: Event) => {
    const eventStartDate = safeParseDate(event.date);
    return eventStartDate ? isSameDay(date, eventStartDate) : false;
  };

  // Check if date is in current month
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  // Day names
  const dayNames = language === 'th' 
    ? ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white">
          {format(currentDate, 'MMMM yyyy', {
            locale: language === 'th' ? th : undefined
          })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Names */}
        {dayNames.map((day, index) => (
          <div
            key={day}
            className={`text-center text-sm font-medium text-gray-400 py-2
              ${index === 0 ? 'text-red-400' : ''}`}
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {calendarDays.map((day, dayIdx) => {
          const dayEvents = getEventsForDay(day);
          const hasEvents = dayEvents.length > 0;
          const dayNumber = format(day, 'd');

          // Get the first event that starts on this day
          const startingEvent = dayEvents.find(event => isEventStartDate(day, event));
          const span = startingEvent ? getEventSpan(startingEvent, dayIdx) : 1;

          return (
            <div
              key={day.toISOString()}
              className={`
                relative aspect-square rounded-lg overflow-hidden
                ${hasEvents ? 'cursor-pointer' : ''}
                ${startingEvent ? `col-span-${span}` : ''}
                ${!isCurrentMonth(day) ? 'opacity-30' : ''}
              `}
              onClick={() => hasEvents && onEventSelect(dayEvents[0])}
            >
              {startingEvent ? (
                <div className="absolute inset-0 group">
                  <img
                    src={startingEvent.image}
                    alt={startingEvent.title}
                    className="w-full h-full object-cover brightness-50 group-hover:brightness-75 transition-all"
                  />
                  <div className="absolute inset-0 p-2">
                    <span className={`
                      text-sm font-medium
                      ${isToday(day) ? 'text-red-400' : 'text-white'}
                    `}>
                      {dayNumber}
                    </span>
                    <div className="mt-1">
                      <p className="text-xs text-white font-medium line-clamp-2">
                        {startingEvent.title}
                      </p>
                      {dayEvents.length > 1 && (
                        <div className="flex gap-1 mt-1">
                          {dayEvents.slice(1).map((event, index) => (
                            <div 
                              key={index}
                              className="w-2 h-2 rounded-full bg-white/70"
                              title={event.title}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`
                  w-full h-full flex items-center justify-center
                  ${isToday(day) ? 'bg-red-500/10' : 'bg-gray-800/50'}
                  hover:bg-gray-800 transition-colors
                `}>
                  <span className={`
                    text-sm font-medium
                    ${isToday(day) ? 'text-red-400' : 'text-gray-400'}
                  `}>
                    {dayNumber}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}