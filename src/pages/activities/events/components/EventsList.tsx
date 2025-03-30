import React from 'react';
import { EventCard } from './EventCard';
import { EventDetailsDialog } from './EventDetailsDialog';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { parseISO, compareDesc } from 'date-fns';
import type { Event } from '../../../../types/event';

interface EventsListProps {
  events: Event[];
  selectedEventId?: string;
}

export function EventsList({ events, selectedEventId }: EventsListProps) {
  const { language } = useLanguage();
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);

  // Sort events by date (most recent first)
  const sortedEvents = React.useMemo(() => {
    return [...events].sort((a, b) => 
      compareDesc(parseISO(a.date), parseISO(b.date))
    );
  }, [events]);

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">
          {language === 'th'
            ? 'ไม่มีกิจกรรมในขณะนี้'
            : 'No events at this time'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {sortedEvents.map((event) => (
          <div
            key={event.id}
            data-event-id={event.id}
            className={`transform transition-all duration-300 ${
              selectedEventId === event.id 
                ? 'scale-[1.02] -translate-x-2 animate-pulse' 
                : 'hover:scale-[1.01]'
            }`}
          >
            <EventCard
              event={event}
              onDetailsClick={() => setSelectedEvent(event)}
              isSelected={selectedEventId === event.id}
            />
          </div>
        ))}
      </div>

      <EventDetailsDialog
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  );
}