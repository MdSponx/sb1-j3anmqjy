import React, { useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Calendar } from './components/Calendar';
import { EventEditorPanel } from './components/EventEditorPanel';
import { useLanguage } from '../../../../contexts/LanguageContext';
import type { Event } from '../../../../pages/activities/events/types';

export function EventEditorPage() {
  const { language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsEditorOpen(true);
  };

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedEvent(null);
    setSelectedDate(null);
  };

  const handleSaveSuccess = () => {
    setIsEditorOpen(false);
    setSelectedEvent(null);
    setSelectedDate(null);
    // Refresh calendar data here
  };

  return (
    <AdminLayout
      title={language === 'th' ? 'จัดการกิจกรรม' : 'Event Management'}
      subtitle={language === 'th' 
        ? 'จัดการกิจกรรมและปฏิทินกิจกรรมของสมาคมฯ' 
        : 'Manage association events and calendar'}
    >
      <Calendar 
        onDateSelect={handleDateSelect}
        onEventSelect={handleEventSelect}
      />

      <EventEditorPanel
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        selectedDate={selectedDate}
        event={selectedEvent}
        onSaveSuccess={handleSaveSuccess}
      />
    </AdminLayout>
  );
}

export default EventEditorPage;