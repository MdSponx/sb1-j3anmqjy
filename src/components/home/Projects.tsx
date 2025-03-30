import React, { useState, useEffect, useMemo } from 'react';
import { Container } from '../ui/Container';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  isToday, 
  addMonths, 
  subMonths, 
  startOfWeek, 
  endOfWeek, 
  parseISO, 
  isBefore, 
  isAfter, 
  addDays,
  subWeeks,
  addWeeks,
  isSameMonth
} from 'date-fns';
import { th } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Video, Users } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useEvents } from '../../hooks/useEvents';
import { EventDetailsDialog } from '../../pages/activities/events/components/EventDetailsDialog';
import type { Event } from '../../types/event';

interface DayEvents {
  [key: string]: Event[];
}

interface EnhancedEvent extends Event {
  isStart?: boolean;
  isEnd?: boolean;
  spanDays?: number;
}

export function Projects() {
  const { language } = useLanguage();
  const { events, loading } = useEvents();
  // Initialize to current date in user's timezone
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentEventIndices, setCurrentEventIndices] = useState<{[key: string]: number}>({});
  const [viewMode] = useState<'month' | 'week'>('week');

  // Calculate events map and find first week with events
  const { dayEvents } = useMemo(() => {
    const eventsMap: Record<string, EnhancedEvent[]> = {};

    // Create events map
    events.forEach(event => {
      const startDate = parseISO(event.date);
      const endDate = event.endDate ? parseISO(event.endDate) : startDate;
      const spanDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      let currentDate = startDate;
      while (isSameDay(currentDate, endDate) || isBefore(currentDate, endDate)) {
        const dateKey = format(currentDate, 'yyyy-MM-dd');
        if (!eventsMap[dateKey]) {
          eventsMap[dateKey] = [];
        }
        
        eventsMap[dateKey].push({
          ...event,
          isStart: isSameDay(currentDate, startDate),
          isEnd: isSameDay(currentDate, endDate),
          spanDays
        });
        
        currentDate = addDays(currentDate, 1);
      }
    });

    return { dayEvents: eventsMap };
  }, [events]);

  // Calculate calendar days based on current date
  const { calendarDays, weekDays } = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const monthDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return { calendarDays: monthDays, weekDays };
  }, [currentDate]);

  // Handle event cycling for days with multiple events
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

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1));
  };

  if (loading) {
    return (
      <section className="bg-black py-16 min-h-[100vh]">
        <Container>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-48 mb-4" />
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-800 rounded-lg" />
              ))}
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-black py-16 min-h-[100vh]">
      <Container>
        {/* Section Title */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
            {language === 'th' ? 'ปฏิทินกิจกรรม' : 'Event Calendar'}
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 font-light">
            {language === 'th' 
              ? 'ติดตามกิจกรรมและงานต่างๆ ของสมาคมผู้กำกับภาพยนตร์ไทย'
              : 'Stay updated with TFDA events and activities'}
          </p>
        </div>

        {/* Mobile Weekly View */}
        <div className="lg:hidden space-y-6">
          {/* Date Navigation */}
          <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => navigateWeek('prev')}>
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </button>
              <h3 className="text-lg font-medium text-white">
                {format(currentDate, 'MMMM yyyy', {
                  locale: language === 'th' ? th : undefined
                })}
              </h3>
              <button onClick={() => navigateWeek('next')}>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            {/* Week Days */}
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => {
                const dateKey = format(day, 'yyyy-MM-dd');
                const hasEvents = dayEvents[dateKey]?.length > 0;

                return (
                  <button
                    key={day.toISOString()}
                    className={`
                      flex flex-col items-center p-2 rounded-lg relative
                      ${isToday(day) ? 'bg-red-500 text-white' : 'text-gray-400 hover:bg-gray-800'}
                      ${hasEvents ? 'font-medium' : ''}
                      ${!isSameMonth(day, currentDate) ? 'opacity-50' : ''}
                      ${isToday(day) ? 'ring-2 ring-red-500' : ''}
                    `}
                  >
                    <span className="text-xs mb-1">
                      {format(day, 'EEE', { locale: language === 'th' ? th : undefined })}
                    </span>
                    <span className="text-lg">{format(day, 'd')}</span>
                    {hasEvents && (
                      <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-red-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-4">
            {weekDays.map(day => {
              const dateEvents = dayEvents[format(day, 'yyyy-MM-dd')] || [];
              if (dateEvents.length === 0) return null;

              return (
                <div key={day.toISOString()} className="space-y-4">
                  <h4 className="text-white font-medium">
                    {format(day, 'EEEE, d MMMM', {
                      locale: language === 'th' ? th : undefined
                    })}
                  </h4>
                  {dateEvents.map(event => (
                    <div 
                      key={event.id}
                      className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={event.image} 
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-500/20 text-red-400">
                              {event.time}
                            </span>
                            {event.locationUrl?.includes('meet.google.com') && (
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 flex items-center gap-1">
                                <Video className="w-3 h-3" />
                                Google Meet
                              </span>
                            )}
                          </div>
                          <h3 className="text-white font-medium mb-2">{event.title}</h3>
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Users className="w-4 h-4" />
                            <span>12 Participants</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop Month View */}
        <div className="hidden lg:block bg-gray-900/90 backdrop-blur-sm rounded-lg p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">
              {format(currentDate, 'MMMM yyyy', {
                locale: language === 'th' ? th : undefined
              })}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day Names */}
            {(language === 'th' 
              ? ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.']
              : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            ).map((day, index) => (
              <div
                key={day}
                className={`
                  text-center text-sm font-medium text-gray-400 py-2
                  ${index === 0 ? 'text-red-400' : ''}
                `}
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
                    ${!isSameMonth(day, currentDate) ? 'opacity-50' : ''}
                    ${isToday(day) ? 'ring-2 ring-red-500' : ''}
                  `}
                  onClick={() => !hasEvents && setSelectedEvent(null)}
                >
                  {currentEvent ? (
                    <div className="absolute inset-0 group">
                      <img
                        src={currentEvent.image}
                        alt={currentEvent.title}
                        className="w-full h-full object-cover brightness-50 group-hover:brightness-75 transition-all"
                      />
                      <div className="absolute inset-0 p-2">
                        <div className="flex justify-between items-start">
                          <span className={`
                            text-sm font-medium
                            ${isToday(day) ? 'text-red-400' : 'text-white'}
                          `}>
                            {format(day, 'd')}
                          </span>
                          <span className="text-xs text-gray-300">
                            {currentEvents.length} {language === 'th' ? 'กิจกรรม' : 'events'}
                          </span>
                        </div>

                        {/* Events List */}
                        <div className="mt-2 space-y-1.5 max-h-[calc(100%-2rem)] overflow-y-auto">
                          {currentEvents.map((event, index) => (
                            <button
                              key={event.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(event);
                              }}
                              className={`
                                w-full text-left px-2 py-1.5 rounded text-xs
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
                      w-full h-full flex items-center justify-center relative
                      ${isToday(day) ? 'bg-red-500/10' : 'bg-gray-800/50'}
                      hover:bg-gray-800 transition-colors
                    `}>
                      <span className={`
                        text-sm font-medium
                        ${isToday(day) ? 'text-red-400' : 'text-gray-400'}
                      `}>
                        {format(day, 'd')}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Event Details Dialog */}
        <EventDetailsDialog
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      </Container>
    </section>
  );
}