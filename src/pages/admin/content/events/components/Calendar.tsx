import React, { useState, useEffect, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek, parseISO, isBefore, isAfter } from 'date-fns';
import { th } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useLanguage } from '../../../../../contexts/LanguageContext';
import { useEvents } from '../hooks/useEvents';
import type { Event } from '../../../../activities/events/types';

interface CalendarProps {
  onDateSelect: (date: Date) => void;
  onEventSelect: (event: Event) => void;
}

interface DayEvents {
  [key: string]: Event[];
}

export function Calendar({ onDateSelect, onEventSelect }: CalendarProps) {
  const { language } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const { events, loading } = useEvents();
  const [currentEventIndices, setCurrentEventIndices] = useState<{[key: string]: number}>({});

  // Get calendar days
  const { calendarDays, dayEvents } = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    
    // Pre-calculate events for each day
    const eventsMap: DayEvents = {};
    days.forEach(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      eventsMap[dateKey] = events.filter(event => {
        const eventStartDate = parseISO(event.date);
        const eventEndDate = event.endDate ? parseISO(event.endDate) : eventStartDate;
        return (
          (isSameDay(day, eventStartDate) || isAfter(day, eventStartDate)) &&
          (isSameDay(day, eventEndDate) || isBefore(day, eventEndDate))
        );
      });
    });

    return { calendarDays: days, dayEvents: eventsMap };
  }, [currentDate, events]);

  // Set up cycling intervals for days with multiple events
  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];

    Object.entries(dayEvents).forEach(([dateKey, events]) => {
      if (events.length > 1) {
        const interval = setInterval(() => {
          setCurrentEventIndices(prev => ({
            ...prev,
            [dateKey]: ((prev[dateKey] || 0) + 1) % events.length
          }));
        }, 3000);
        intervals.push(interval);
      }
    });

    return () => intervals.forEach(clearInterval);
  }, [dayEvents]);

  const handleEventClick = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventSelect(event);
  };

  const handleDateSelect = (day: Date) => {
    // Create a new date at noon to avoid timezone issues
    const selectedDate = new Date(day);
    selectedDate.setHours(12, 0, 0, 0);
    onDateSelect(selectedDate);
  };

  // Day names
  const dayNames = language === 'th' 
    ? ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded mb-8 w-48" />
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 42 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-800 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white">
          {format(currentDate, 'MMMM yyyy', {
            locale: language === 'th' ? th : undefined
          })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentDate(prev => subMonths(prev, 1))}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={() => setCurrentDate(prev => addMonths(prev, 1))}
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
        {calendarDays.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const currentEvents = dayEvents[dateKey] || [];
          const hasEvents = currentEvents.length > 0;
          const currentEventIndex = currentEventIndices[dateKey] || 0;
          const currentEvent = hasEvents ? currentEvents[currentEventIndex] : null;

          return (
            <div
              key={dateKey}
              className={`
                relative aspect-square rounded-lg overflow-hidden
                ${hasEvents ? 'cursor-pointer' : ''}
                hover:ring-2 hover:ring-gray-700 transition-all
              `}
              onClick={() => !hasEvents && handleDateSelect(day)}
            >
              {currentEvent ? (
                <div className="absolute inset-0">
                  {/* Background Image */}
                  <img
                    src={currentEvent.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover brightness-50 transition-opacity duration-1000"
                  />
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-2">
                    <div className="flex justify-between items-start">
                      <span className={`
                        text-sm font-medium
                        ${isToday(day) ? 'text-red-400' : 'text-white'}
                      `}>
                        {format(day, 'd')}
                      </span>
                      <span className="text-xs text-gray-400">
                        {currentEvents.length} {language === 'th' ? 'กิจกรรม' : 'events'}
                      </span>
                    </div>

                    {/* Events List */}
                    <div className="mt-2 space-y-1 max-h-[calc(100%-2rem)] overflow-y-auto">
                      {currentEvents.map((event, index) => (
                        <button
                          key={event.id}
                          onClick={(e) => handleEventClick(event, e)}
                          className={`
                            w-full text-left px-2 py-1 rounded text-xs
                            ${index === currentEventIndex 
                              ? 'bg-white/20 text-white' 
                              : 'hover:bg-white/10 text-gray-300'}
                            transition-colors duration-200
                          `}
                        >
                          {event.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`
                  w-full h-full flex items-center justify-center
                  ${isToday(day) ? 'bg-red-500/10' : 'bg-gray-800/50'}
                  hover:bg-gray-800 transition-colors
                  group
                `}>
                  <span className={`
                    text-sm font-medium
                    ${isToday(day) ? 'text-red-400' : 'text-gray-400'}
                  `}>
                    {format(day, 'd')}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="w-6 h-6 text-gray-400" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}